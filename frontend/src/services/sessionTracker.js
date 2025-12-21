import { eventService } from "./eventService";

export const sessionTracker = {
	// Check for abandoned sessions from previous visits
	checkForAbandonedSessions() {
		const abandonedSessions = [];
		
		for (let i = 0; i < sessionStorage.length; i++) {
			const key = sessionStorage.key(i);
			if (key?.startsWith("abandoned_session_")) {
				try {
					const event = JSON.parse(sessionStorage.getItem(key));
					abandonedSessions.push(event);
					sessionStorage.removeItem(key); // Clean up
				} catch (err) {
					console.warn("Failed to parse abandoned session:", err);
					sessionStorage.removeItem(key);
				}
			}
		}
		
		return abandonedSessions;
	},

	// Store abandoned session event as backup
	storeAbandonedSession(sessionId, durationMs, reason = "page_unload") {
		const event = {
			type: "session_end",
			sessionId,
			payload: {
				durationMs,
				completed: false,
				abandoned: true,
				reason,
			},
			meta: eventService.getDefaultMeta(),
		};

		sessionStorage.setItem(`abandoned_session_${sessionId}`, JSON.stringify(event));
		return event;
	},

	// Send abandoned session events from previous visit
	async recoverAbandonedSessions() {
		const abandonedSessions = this.checkForAbandonedSessions();
		
		if (abandonedSessions.length > 0) {
			console.log("Recovering abandoned sessions:", abandonedSessions.length);
			
			// Send each abandoned session event
			await Promise.allSettled(
				abandonedSessions.map(event => eventService.sendEvent(event))
			);
		}
		
		return abandonedSessions;
	},
};