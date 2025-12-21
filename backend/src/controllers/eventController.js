import Event from "../models/Event.js";

export const createEvent = async (req, res, next) => {
	try {
		const { type, payload = {}, meta = {}, sessionId } = req.body;

		if (!type || !sessionId) {
			return res.status(400).json({
				message: "type and sessionId are required",
			});
		}

		const event = await Event.create({
			user: req.user.id,
			type,
			sessionId,
			payload,
			meta,
		});

		res.status(201).json({
			message: "Event stored successfully",
			event,
		});
	} catch (err) {
		next(err);
	}
};
