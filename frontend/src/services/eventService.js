import { apiClient } from "./apiClient";

export const eventService = {
	/**
	 * Sends a tracking event to the backend.
	 * @param {Object} params
	 * @param {string} params.type
	 * @param {string} params.sessionId
	 * @param {Object} [params.payload] - Event-specific data (questionId, answer, ...)
	 * @param {Object} [params.meta]
	 */
	sendEvent({ type, sessionId, payload = {}, meta = {} }) {
		return apiClient.post("/events", {
			type,
			sessionId,
			payload,
			meta,
		});
	},

	getDefaultMeta() {
		return {
			device: navigator.userAgent,
			language: navigator.language,
			screenWidth: window.innerWidth,
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		};
	},
};
