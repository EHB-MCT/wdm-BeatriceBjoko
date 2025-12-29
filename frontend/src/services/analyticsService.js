import { apiClient } from "./apiClient";

export const analyticsService = {
	getTabBlurByQuestion() {
		return apiClient.get("/admin/analytics/tab-blur-by-question");
	},

	getTabBlurAfterHint(windowMs = 30000) {
		return apiClient.get(`/admin/analytics/tab-blur-after-hint?windowMs=${windowMs}`);
	},

	getTabBlurVsAnswerError(windowMs = 15000) {
		return apiClient.get(`/admin/analytics/tab-blur-vs-answer-error?windowMs=${windowMs}`);
	},
};
