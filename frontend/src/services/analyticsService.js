import { apiClient } from "./apiClient";

export const analyticsService = {
	getTabBlurByQuestion(userId = null) {
		const url = userId 
			? `/admin/analytics/tab-blur-by-question?userId=${userId}`
			: "/admin/analytics/tab-blur-by-question";
		return apiClient.get(url);
	},

	getTabBlurAfterHint(windowMs = 30000, userId = null) {
		const params = new URLSearchParams({ windowMs: windowMs.toString() });
		if (userId) params.append("userId", userId);
		
		return apiClient.get(`/admin/analytics/tab-blur-after-hint?${params}`);
	},

	getTabBlurVsAnswerError(windowMs = 15000, userId = null) {
		const params = new URLSearchParams({ windowMs: windowMs.toString() });
		if (userId) params.append("userId", userId);
		
		return apiClient.get(`/admin/analytics/tab-blur-vs-answer-error?${params}`);
	},
};
