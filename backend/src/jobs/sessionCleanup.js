import cron from "node-cron";
import { sessionService } from "../services/sessionService.js";

// Run every 30 seconds to check for abandoned sessions
cron.schedule("*/30 * * * * *", async () => {
	try {
		const abandonedSessions = await sessionService.detectAbandonedSessions();
		if (abandonedSessions.length > 0) {
			console.log(`Detected ${abandonedSessions.length} abandoned sessions`);
		}
	} catch (err) {
		console.error("Error in abandoned session cleanup job:", err);
	}
});

export default cron;