import Answer from "../models/Answer.js";

export const createAnswer = async (req, res, next) => {
	try {
		const { questionId, isCorrect, responseTime } = req.body;

		if (!questionId || responseTime === undefined) {
			return res.status(400).json({ message: "Missing fields" });
		}

		const newAnswer = await Answer.create({
			questionId,
			isCorrect,
			responseTime,
		});

		res.status(201).json({
			message: "Answer saved!",
			data: newAnswer,
		});
	} catch (err) {
		next(err);
	}
};
