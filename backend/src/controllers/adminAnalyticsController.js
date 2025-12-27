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
