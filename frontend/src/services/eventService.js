import { apiClient } from "./apiClient";

/**
 * Collects contextual metadata about the user environment.
 */
function collectMeta() {
	return {
		device: navigator.userAgent,
		language: navigator.language,
		screenWidth: window.innerWidth,
		timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
	};
}

/**
 * Sends a tracking event to the backend.
 * @param {string} type
 * @param {object} options
 * @param {string} options.sessionId
 * @param {object} options.payload - Event-specific data
 */
async function trackEvent(type, { sessionId, payload = {} }) {
	if (!type || !sessionId) {
		throw new Error("trackEvent requires type and sessionId");
	}

	return apiClient.post("/events", {
		type,
		sessionId,
		payload,
		meta: collectMeta(),
	});
}

export const eventService = {
	trackEvent,
};
