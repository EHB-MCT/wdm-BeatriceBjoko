import { apiClient } from "./apiClient";

export const authService = {
	signup(email, password) {
		return apiClient.post("/auth/signup", { email, password });
	},

	login(email, password) {
		return apiClient.post("/auth/login", { email, password });
	},

	// uses the cookie (JWT) set by the backend
	getCurrentUser() {
		return apiClient.get("/auth/me");
	},

	logout() {
		return apiClient.post("/auth/logout", {});
	},
};
