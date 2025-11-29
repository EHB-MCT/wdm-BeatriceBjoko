import Event from "../models/Event.js";

export const saveEvent = async (req, res, next) => {
	try {
		// user comes from the protect middleware
		const userId = req.user.id;

		const { type, metadata } = req.body;

		if (!type) {
			return res.status(400).json({ message: "Event type is required" });
		}

		const newEvent = await Event.create({
			user: userId,
			type,
			metadata: metadata || {},
		});

		return res.status(201).json({
			message: "Event stored successfully",
			event: newEvent,
		});
	} catch (err) {
		next(err);
	}
};
