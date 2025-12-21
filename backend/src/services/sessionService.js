import Event from "../models/Event.js";

const SESSION_TIMEOUT_MS = 30_000; // 30 seconds without ping = abandoned

class SessionService {
	async detectAbandonedSessions() {
		try {
			const activeSessions = await this.getActiveSessions();
			const abandonedSessions = [];

			for (const session of activeSessions) {
				if (await this.isSessionAbandoned(session)) {
					const abandonedEvent = await this.createAbandonedSessionEvent(session);
					if (abandonedEvent) {
						abandonedSessions.push(abandonedEvent);
					}
				}
			}

			return abandonedSessions;
		} catch (err) {
			console.error("Error detecting abandoned sessions:", err);
			return [];
		}
	}

	async getActiveSessions() {
		return await Event.aggregate([
			{ $match: { type: "session_start" } },
			{
				$lookup: {
					from: "events",
					localField: "sessionId",
					foreignField: "sessionId",
					as: "sessionEvents",
				},
			},
			{
				$match: {
					"sessionEvents.type": { $not: { $elemMatch: { $eq: "session_end" } } },
				},
			},
			{
				$addFields: {
					lastPing: {
						$filter: {
							input: "$sessionEvents",
							as: "event",
							cond: { $eq: ["$$event.type", "session_ping"] },
						},
					},
				},
			},
			{
				$addFields: {
					lastPingTime: { $max: "$lastPing.createdAt" },
				},
			},
		]);
	}

	async isSessionAbandoned(session) {
		const lastPingTime = session.lastPingTime || session.createdAt;
		const timeSinceLastActivity = Date.now() - lastPingTime;

		if (timeSinceLastActivity <= SESSION_TIMEOUT_MS) {
			return false;
		}

		const existingAbandonedEvent = await Event.findOne({
			sessionId: session.sessionId,
			type: "session_end",
			"payload.abandoned": true,
		});

		return !existingAbandonedEvent;
	}

	async createAbandonedSessionEvent(session) {
		const lastPingTime = session.lastPingTime || session.createdAt;
		const durationMs = Math.round(lastPingTime - session.createdAt);

		return await Event.create({
			user: session.user,
			type: "session_end",
			sessionId: session.sessionId,
			payload: {
				durationMs,
				completed: false,
				abandoned: true,
				reason: "timeout",
			},
			meta: {
				detectedAt: new Date(),
				detectionMethod: "server_timeout",
			},
		});
	}
}

export const sessionService = new SessionService();