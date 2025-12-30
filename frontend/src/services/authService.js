import { apiClient } from "./apiClient";
import { eventService } from "./eventService";

export const authService = {
	signup(email, password) {
		const deviceMetadata = eventService.getDefaultMeta();
		return apiClient.post("/auth/signup", { email, password, deviceMetadata });
	},

	login(email, password) {
		const deviceMetadata = eventService.getDefaultMeta();
		return apiClient.post("/auth/login", { email, password, deviceMetadata });
	},

	// uses the cookie (JWT) set by the backend
	getCurrentUser() {
		return apiClient.get("/auth/me");
	},

	logout() {
		return apiClient.post("/auth/logout", {});
	},
};
