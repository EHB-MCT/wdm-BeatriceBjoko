import Event from "../models/Event.js";
import { ObjectId } from "mongodb";
import { EVENT_TYPES, AGGREGATION_CONFIG } from "../config/analyticsThresholds.js";

/**
 * Analytics Repository - Handles all MongoDB operations for analytics
 * Pure data access layer without business logic
 */
export class AnalyticsRepository {
	/**
	 * Get tab blur events grouped by question
	 * @param {string|null} userId - Optional user ID to filter by
	 * @returns {Promise<Array>} Array of tab blur analytics by question
	 */
	static async getTabBlurByQuestion(userId = null) {
		const matchStage = {
			type: EVENT_TYPES.TAB_BLUR,
			"payload.questionId": { $ne: null },
		};

		if (userId) {
			matchStage.user = new ObjectId(String(userId));
		}

		const pipeline = [
			{ $match: matchStage },
			{
				$group: {
					_id: "$payload.questionId",
					tabBlurCount: { $sum: 1 },
					uniqueUsers: { $addToSet: "$user" },
				},
			},
			{
				$project: {
					questionId: "$_id",
					tabBlurCount: 1,
					uniqueUserCount: { $size: "$uniqueUsers" },
					_id: 0,
				},
			},
			{ $sort: { tabBlurCount: -1 } },
		];

		return await Event.aggregate(pipeline);
	}

	/**
	 * Get hint usage and subsequent tab blur events
	 * @param {number} windowMs - Time window in milliseconds
	 * @param {string|null} userId - Optional user ID to filter by
	 * @returns {Promise<Array>} Array of hint effectiveness analytics
	 */
	static async getTabBlurAfterHint(windowMs, userId = null) {
		const matchStage = {
			type: EVENT_TYPES.HINT_USED,
			"payload.questionId": { $exists: true, $ne: null },
		};

		if (userId) {
			matchStage.user = new ObjectId(String(userId));
		}

		const pipeline = [
			{ $match: matchStage },
			{
				$project: {
					questionId: "$payload.questionId",
					sessionId: "$sessionId",
					user: "$user",
					hintAt: "$createdAt",
				},
			},
			{
				$lookup: {
					from: "events",
					let: {
						sessionId: "$sessionId",
						questionId: "$questionId",
						hintAt: "$hintAt",
						windowMs: windowMs,
					},
					pipeline: [
						{
							$match: {
								$expr: {
									$and: [
										{ $eq: ["$type", EVENT_TYPES.TAB_BLUR] },
										{ $eq: ["$sessionId", "$$sessionId"] },
										{ $eq: ["$payload.questionId", "$$questionId"] },
										{ $gt: ["$createdAt", "$$hintAt"] },
										{
											$lt: [
												"$createdAt",
												{
													$add: ["$$hintAt", { $multiply: ["$$windowMs", 1] }],
												},
											],
										},
									],
								},
							},
						},
						{ $limit: 1 },
						{ $project: { _id: 1 } },
					],
					as: "blurAfterHint",
				},
			},
			{
				$addFields: {
					hasBlurAfterHint: { $gt: [{ $size: "$blurAfterHint" }, 0] },
				},
			},
			{
				$group: {
					_id: "$questionId",
					hintCount: { $sum: 1 },
					tabBlurAfterHintCount: {
						$sum: { $cond: ["$hasBlurAfterHint", 1, 0] },
					},
					uniqueUsers: { $addToSet: "$user" },
				},
			},
			{
				$project: {
					_id: 0,
					questionId: "$_id",
					hintCount: 1,
					tabBlurAfterHintCount: 1,
					uniqueUserCount: { $size: "$uniqueUsers" },
					blurAfterHintRatio: {
						$cond: [{ $gt: ["$hintCount", 0] }, { $divide: ["$tabBlurAfterHintCount", "$hintCount"] }, 0],
					},
				},
			},
			{ $sort: { blurAfterHintRatio: -1, hintCount: -1 } },
		];

		return await Event.aggregate(pipeline);
	}

	/**
	 * Get correlation between tab blur and answer errors
	 * @param {number} windowMs - Time window in milliseconds
	 * @param {string|null} userId - Optional user ID to filter by
	 * @returns {Promise<Array>} Array of correlation data
	 */
	static async getTabBlurVsAnswerError(windowMs, userId = null) {
		const matchStage = { type: EVENT_TYPES.QUESTION_ANSWER };

		if (userId) {
			matchStage.user = new ObjectId(String(userId));
		}

		const pipeline = [
			{ $match: matchStage },
			{
				$project: {
					sessionId: 1,
					user: 1,
					questionId: "$payload.questionId",
					correct: "$payload.correct",
					answerAt: "$createdAt",
				},
			},
			{
				$lookup: {
					from: "events",
					let: {
						sessionId: "$sessionId",
						questionId: "$questionId",
						answerAt: "$answerAt",
						windowMs: windowMs,
					},
					pipeline: [
						{
							$match: {
								$expr: {
									$and: [
										{ $eq: ["$type", EVENT_TYPES.TAB_BLUR] },
										{ $eq: ["$sessionId", "$$sessionId"] },
										{ $eq: ["$payload.questionId", "$$questionId"] },
										{
											$gt: ["$createdAt", { $subtract: ["$$answerAt", "$$windowMs"] }],
										},
										{ $lt: ["$createdAt", "$$answerAt"] },
									],
								},
							},
						},
						{ $limit: 1 },
						{ $project: { _id: 1 } },
					],
					as: "blurBeforeAnswer",
				},
			},
			{
				$addFields: {
					hadBlurBeforeAnswer: {
						$gt: [{ $size: "$blurBeforeAnswer" }, 0],
					},
				},
			},
			{
				$group: {
					_id: "$hadBlurBeforeAnswer",
					totalAnswers: { $sum: 1 },
					errors: {
						$sum: { $cond: [{ $eq: ["$correct", false] }, 1, 0] },
					},
				},
			},
		];

		return await Event.aggregate(pipeline);
	}

	/**
	 * Get hover hesitation analytics by question
	 * @param {string|null} userId - Optional user ID to filter by
	 * @returns {Promise<Array>} Array of hover hesitation data
	 */
	static async getHoverHesitationByQuestion(userId = null) {
		const matchStage = {
			type: EVENT_TYPES.ANSWER_HOVER_INTENT,
			"payload.questionId": { $exists: true, $ne: null },
			"payload.intentDelayMs": { $exists: true, $gte: 0 },
		};

		if (userId) {
			matchStage.user = new ObjectId(String(userId));
		}

		const pipeline = [
			{ $match: matchStage },
			{
				$group: {
					_id: "$payload.questionId",
					totalHoverIntents: { $sum: 1 },
					avgIntentDelayMs: { $avg: "$payload.intentDelayMs" },
					maxIntentDelayMs: { $max: "$payload.intentDelayMs" },
					minIntentDelayMs: { $min: "$payload.intentDelayMs" },
					uniqueUsers: { $addToSet: "$user" },
					intentDelays: { $push: "$payload.intentDelayMs" },
				},
			},
			{
				$addFields: {
					medianIntentDelayMs: {
						$let: {
							vars: {
								sortedDelays: { $sortArray: { input: "$intentDelays", sortBy: 1 } },
								count: { $size: "$intentDelays" },
							},
							in: {
								$cond: {
									if: { $eq: [{ $mod: ["$$count", 2] }, 0] },
									then: {
										$avg: [
											{ $arrayElemAt: ["$$sortedDelays", { $subtract: [{ $divide: ["$$count", 2] }, 1] }] },
											{ $arrayElemAt: ["$$sortedDelays", { $divide: ["$$count", 2] }] },
										],
									},
									else: { $arrayElemAt: ["$$sortedDelays", { $floor: { $divide: ["$$count", 2] } }] },
								},
							},
						},
					},
				},
			},
			{
				$project: {
					_id: 0,
					questionId: "$_id",
					totalHoverIntents: 1,
					avgIntentDelayMs: { $round: ["$avgIntentDelayMs", 2] },
					medianIntentDelayMs: { $round: ["$medianIntentDelayMs", 2] },
					maxIntentDelayMs: 1,
					minIntentDelayMs: 1,
					uniqueUserCount: { $size: "$uniqueUsers" },
				},
			},
			{ $sort: { avgIntentDelayMs: -1 } },
		];

		return await Event.aggregate(pipeline);
	}

	/**
	 * Get hover indecision analytics by question
	 * @param {string|null} userId - Optional user ID to filter by
	 * @returns {Promise<Array>} Array of hover indecision data
	 */
	static async getHoverIndecisionByQuestion(userId = null) {
		const hoverSwitchMatch = {
			type: EVENT_TYPES.ANSWER_HOVER_SWITCH,
			"payload.questionId": { $exists: true, $ne: null },
			"payload.fromAnswerId": { $exists: true, $ne: null },
			"payload.toAnswerId": { $exists: true, $ne: null },
		};

		const hoverIntentMatch = {
			type: EVENT_TYPES.ANSWER_HOVER_INTENT,
			"payload.questionId": { $exists: true, $ne: null },
		};

		if (userId) {
			hoverSwitchMatch.user = new ObjectId(String(userId));
			hoverIntentMatch.user = new ObjectId(String(userId));
		}

		const [switchResults, intentResults] = await Promise.all([
			this._getHoverSwitchAggregation(hoverSwitchMatch),
			this._getHoverIntentAggregation(hoverIntentMatch),
		]);

		return this._combineHoverData(switchResults, intentResults);
	}

	/**
	 * Private helper method for hover switch aggregation
	 */
	static async _getHoverSwitchAggregation(matchStage) {
		const pipeline = [
			{ $match: matchStage },
			{
				$group: {
					_id: {
						questionId: "$payload.questionId",
						sessionId: "$sessionId",
					},
					switchCount: { $sum: 1 },
					uniqueAnswers: { $addToSet: "$payload.fromAnswerId" },
				},
			},
			{
				$group: {
					_id: "$_id.questionId",
					totalSwitches: { $sum: "$switchCount" },
					uniqueSessions: { $sum: 1 },
					uniqueAnswerPairs: { $addToSet: "$uniqueAnswers" },
				},
			},
			{
				$project: {
					_id: 0,
					questionId: "$_id",
					totalSwitches: 1,
					uniqueSessions: 1,
					avgSwitchesPerSession: { $round: [{ $divide: ["$totalSwitches", "$uniqueSessions"] }, 2] },
				},
			},
		];

		return await Event.aggregate(pipeline);
	}

	/**
	 * Private helper method for hover intent aggregation
	 */
	static async _getHoverIntentAggregation(matchStage) {
		const pipeline = [
			{ $match: matchStage },
			{
				$group: {
					_id: {
						questionId: "$payload.questionId",
						sessionId: "$sessionId",
					},
					intentCount: { $sum: 1 },
				},
			},
			{
				$group: {
					_id: "$_id.questionId",
					totalIntents: { $sum: "$intentCount" },
					sessionsWithIntents: { $sum: 1 },
				},
			},
			{
				$project: {
					_id: 0,
					questionId: "$_id",
					totalIntents: 1,
					sessionsWithIntents: 1,
				},
			},
		];

		return await Event.aggregate(pipeline);
	}

	/**
	 * Private helper method to combine hover switch and intent data
	 */
	static _combineHoverData(switchResults, intentResults) {
		const combinedResults = switchResults.map((switchItem) => {
			const intentItem = intentResults.find((i) => i.questionId === switchItem.questionId);
			return {
				questionId: switchItem.questionId,
				totalSwitches: switchItem.totalSwitches,
				totalIntents: intentItem ? intentItem.totalIntents : 0,
				uniqueSessions: switchItem.uniqueSessions,
				avgSwitchesPerSession: switchItem.avgSwitchesPerSession,
				indecisionRatio: intentItem && intentItem.totalIntents > 0 
					? Math.round((switchItem.totalSwitches / intentItem.totalIntents) * 100) / 100 
					: 0,
			};
		});

		const questionsWithOnlyIntents = intentResults
			.filter((intentItem) => !combinedResults.find((r) => r.questionId === intentItem.questionId))
			.map((intentItem) => ({
				questionId: intentItem.questionId,
				totalSwitches: 0,
				totalIntents: intentItem.totalIntents,
				uniqueSessions: intentItem.sessionsWithIntents,
				avgSwitchesPerSession: 0,
				indecisionRatio: 0,
			}));

		return [...combinedResults, ...questionsWithOnlyIntents].sort((a, b) => b.indecisionRatio - a.indecisionRatio);
	}
}

export default AnalyticsRepository;