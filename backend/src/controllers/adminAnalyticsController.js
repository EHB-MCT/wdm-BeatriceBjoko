import Event from "../models/Event.js";

export const getTabBlurByQuestion = async (req, res, next) => {
	try {
		const results = await Event.aggregate([
			{
				$match: {
					type: "tab_blur",
					"payload.questionId": { $ne: null },
				},
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
const MAX_WINDOW_MS = 5 * 60_000; // 5 min safety cap

export async function getTabBlurAfterHint(req, res, next) {
	try {
		const rawWindowMs = Number(req.query.windowMs);
		const windowMs = Number.isFinite(rawWindowMs) && rawWindowMs > 0 ? Math.min(Math.floor(rawWindowMs), MAX_WINDOW_MS) : DEFAULT_WINDOW_MS;

		// - Start from hint_used events
		// - For each hint_used, lookup tab_blur in same sessionId + questionId in a time window after hint
		// - Group by questionId and count
		const items = await Event.aggregate([
			{
				$match: {
					type: "hint_used",
					"payload.questionId": { $exists: true, $ne: null },
				},
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
