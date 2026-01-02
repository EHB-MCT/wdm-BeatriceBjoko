import mongoose from "mongoose";
import User from "../models/User.js";
import Event from "../models/Event.js";

function toInt(value, fallback) {
	const n = Number.parseInt(value, 10);
	return Number.isNaN(n) ? fallback : n;
}

function toBool(value) {
	if (value === "true") return true;
	if (value === "false") return false;
	return undefined;
}

/**
 * - search on email
 * - pagination
 */
export const getUsers = async (req, res, next) => {
	try {
		const { search = "", role } = req.query;

		const page = Math.max(1, toInt(req.query.page, 1));
		const limit = Math.min(100, Math.max(1, toInt(req.query.limit, 25)));
		const skip = (page - 1) * limit;

		const filter = {};
		if (role) filter.role = role;

		if (search.trim()) {
			filter.email = { $regex: search.trim(), $options: "i" };
		}

		const [items, total] = await Promise.all([User.find(filter).select("_id email role createdAt lastLogin deviceMetadata").sort({ createdAt: -1 }).skip(skip).limit(limit), User.countDocuments(filter)]);

		res.json({
			page,
			limit,
			total,
			items,
		});
	} catch (err) {
		next(err);
	}
};

export const getUserById = async (req, res, next) => {
	try {
		const { id } = req.params;

		if (!mongoose.isValidObjectId(id)) {
			return res.status(400).json({ message: "Invalid user id" });
		}

		const user = await User.findById(id).select("_id email role createdAt lastLogin deviceMetadata");
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json({ user });
	} catch (err) {
		next(err);
	}
};

export const getEvents = async (req, res, next) => {
	try {
		const { userId, sessionId, type, questionId, from, to } = req.query;

		const correct = toBool(req.query.correct);

		const page = Math.max(1, toInt(req.query.page, 1));
		const limit = Math.min(200, Math.max(1, toInt(req.query.limit, 50)));
		const skip = (page - 1) * limit;

		const filter = {};

		if (userId) {
			if (!mongoose.isValidObjectId(userId)) {
				return res.status(400).json({ message: "Invalid userId" });
			}
			filter.user = userId;
		}

		if (sessionId) filter.sessionId = sessionId;
		if (type) filter.type = type;
		if (questionId) filter["payload.questionId"] = questionId;

		if (correct !== undefined) {
			filter["payload.correct"] = correct;
		}

		if (from || to) {
			filter.createdAt = {};
			if (from) {
				const d = new Date(from);
				if (Number.isNaN(d.getTime())) return res.status(400).json({ message: "Invalid from date" });
				filter.createdAt.$gte = d;
			}
			if (to) {
				const d = new Date(to);
				if (Number.isNaN(d.getTime())) return res.status(400).json({ message: "Invalid to date" });
				filter.createdAt.$lte = d;
			}
		}

		const [items, total] = await Promise.all([Event.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).select("user sessionId type payload meta createdAt"), Event.countDocuments(filter)]);

		res.json({
			page,
			limit,
			total,
			items,
		});
	} catch (err) {
		next(err);
	}
};

/**
 * GET /api/admin/users/:id/sessions
 * Gives a list of unique sessionId's for that user (recent first)
 */
export const getUserSessions = async (req, res, next) => {
	try {
		const { id } = req.params;

		if (!mongoose.isValidObjectId(id)) {
			return res.status(400).json({ message: "Invalid user id" });
		}

		const sessions = await Event.aggregate([
			{ $match: { user: new mongoose.Types.ObjectId(id) } },
			{ $group: { _id: "$sessionId", lastEventAt: { $max: "$createdAt" } } },
			{ $sort: { lastEventAt: -1 } },
			{ $limit: 100 },
			{ $project: { _id: 0, sessionId: "$_id", lastEventAt: 1 } },
		]);

		res.json({ sessions });
	} catch (err) {
		next(err);
	}
};
