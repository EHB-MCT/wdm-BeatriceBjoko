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

	getHoverHesitationByQuestion(userId = null) {
		const url = userId 
			? `/admin/analytics/hover-hesitation-by-question?userId=${userId}`
			: "/admin/analytics/hover-hesitation-by-question";
		return apiClient.get(url);
	},

	getHoverIndecisionByQuestion(userId = null) {
		const url = userId 
			? `/admin/analytics/hover-indecision-by-question?userId=${userId}`
			: "/admin/analytics/hover-indecision-by-question";
		return apiClient.get(url);
	},
};
