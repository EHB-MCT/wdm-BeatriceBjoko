import { apiClient } from "./apiClient";

export const authService = {
	signup(email, password) {
		return apiClient.post("/auth/signup", { email, password });
	},

	login(email, password) {
		return apiClient.post("/auth/login", { email, password });
	},

	me() {
		// uses the cookie (JWT) set by the backend
		return apiClient.get("/auth/me");
	},
};
