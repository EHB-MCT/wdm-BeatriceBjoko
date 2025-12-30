import Event from "../models/Event.js";
import { ObjectId } from "mongodb";

export const getTabBlurByQuestion = async (req, res, next) => {
	try {
		const { userId } = req.query;
		const matchStage = {
			type: "tab_blur",
			"payload.questionId": { $ne: null },
		};

		if (userId) {
			matchStage.user = new ObjectId(String(userId));
		}

		const results = await Event.aggregate([
			{
				$match: matchStage,
			},
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
			{
				$sort: { tabBlurCount: -1 },
			},
		]);

		res.json({
			totalQuestions: results.length,
			items: results,
		});
	} catch (err) {
		next(err);
	}
};

const DEFAULT_WINDOW_MS = 30_000;
const MAX_WINDOW_MS = 5 * 60_000;

export async function getTabBlurAfterHint(req, res, next) {
	try {
		const { userId, windowMs: rawWindowMs } = req.query;
		const windowMs = Number.isFinite(rawWindowMs) && rawWindowMs > 0 ? Math.min(Math.floor(rawWindowMs), MAX_WINDOW_MS) : DEFAULT_WINDOW_MS;

		const matchStage = {
			type: "hint_used",
			"payload.questionId": { $exists: true, $ne: null },
		};

		if (userId) {
			matchStage.user = new ObjectId(String(userId));
		}

		// - Start from hint_used events
		// - For each hint_used, lookup tab_blur in same sessionId + questionId in a time window after hint
		// - Group by questionId and count
		const items = await Event.aggregate([
			{
				$match: matchStage,
			},
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
										{ $eq: ["$type", "tab_blur"] },
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
		]);

		return res.json({
			windowMs,
			totalQuestions: items.length,
			items,
		});
	} catch (err) {
		return next(err);
	}
}

export async function getTabBlurVsAnswerError(req, res, next) {
	try {
		const DEFAULT_WINDOW_MS = 15_000;
		const MAX_WINDOW_MS = 60_000;

		const { userId, windowMs: rawWindowMs } = req.query;
		const windowMs = Number.isFinite(rawWindowMs) && rawWindowMs > 0 ? Math.min(Math.floor(rawWindowMs), MAX_WINDOW_MS) : DEFAULT_WINDOW_MS;

		const matchStage = { type: "question_answer" };

		if (userId) {
			matchStage.user = new ObjectId(String(userId));
		}

		const results = await Event.aggregate([
			{
				$match: matchStage,
			},
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
										{ $eq: ["$type", "tab_blur"] },
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
		]);

		const withBlur = results.find((r) => r._id === true) || {
			totalAnswers: 0,
			errors: 0,
		};
		const withoutBlur = results.find((r) => r._id === false) || {
			totalAnswers: 0,
			errors: 0,
		};

		res.json({
			windowMs,
			withBlur: {
				answers: withBlur.totalAnswers,
				errors: withBlur.errors,
				errorRate: withBlur.totalAnswers > 0 ? withBlur.errors / withBlur.totalAnswers : 0,
			},
			withoutBlur: {
				answers: withoutBlur.totalAnswers,
				errors: withoutBlur.errors,
				errorRate: withoutBlur.totalAnswers > 0 ? withoutBlur.errors / withoutBlur.totalAnswers : 0,
			},
		});
	} catch (err) {
		next(err);
	}
}

export async function getHoverHesitationByQuestion(req, res, next) {
	try {
		const { userId } = req.query;
		
		const matchStage = {
			type: "answer_hover_intent",
			"payload.questionId": { $exists: true, $ne: null },
			"payload.intentDelayMs": { $exists: true, $gte: 0 },
		};

		if (userId) {
			matchStage.user = new ObjectId(String(userId));
		}

		const items = await Event.aggregate([
			{
				$match: matchStage,
			},
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
		]);

		return res.json({
			totalQuestions: items.length,
			items,
		});
	} catch (err) {
		return next(err);
	}
}

export async function getHoverIndecisionByQuestion(req, res, next) {
	try {
		const { userId } = req.query;
		
		const hoverSwitchMatch = {
			type: "answer_hover_switch",
			"payload.questionId": { $exists: true, $ne: null },
			"payload.fromAnswerId": { $exists: true, $ne: null },
			"payload.toAnswerId": { $exists: true, $ne: null },
		};

		const hoverIntentMatch = {
			type: "answer_hover_intent",
			"payload.questionId": { $exists: true, $ne: null },
		};

		if (userId) {
			hoverSwitchMatch.user = new ObjectId(String(userId));
			hoverIntentMatch.user = new ObjectId(String(userId));
		}

		const [switchResults, intentResults] = await Promise.all([
			Event.aggregate([
				{
					$match: hoverSwitchMatch,
				},
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
			]),
			Event.aggregate([
				{
					$match: hoverIntentMatch,
				},
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
			]),
		]);

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

		const allResults = [...combinedResults, ...questionsWithOnlyIntents].sort((a, b) => b.indecisionRatio - a.indecisionRatio);

		return res.json({
			totalQuestions: allResults.length,
			items: allResults,
		});
	} catch (err) {
		return next(err);
	}
}
