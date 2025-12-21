import { useEffect, useMemo, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { eventService } from "../services/eventService";
import "./QuizPage.css";

/**
 * Generates a unique session identifier.
 * Uses the browser crypto API when available, with a safe fallback.
 */
function createSessionId() {
	if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
		return crypto.randomUUID();
	}
	return `session_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default function QuizPage() {
	const { user, logout } = useAuth();

	const sessionId = useMemo(() => createSessionId(), []);

	const questionStartRef = useRef(null);

	useEffect(() => {
		async function startSession() {
			try {
				await eventService.trackEvent("session_start", {
					sessionId,
				});
				console.log("session_start event sent");
			} catch (error) {
				console.error("Failed to send session_start event:", error);
			}
		}

		startSession();
	}, [sessionId]);

	return (
		<div className="page-container">
			<h1 className="page-title">Quiz Page</h1>

			<p className="page-subtitle">Welkom, {user?.email}</p>

			<hr className="section-divider" />

			<button className="btn btn-secondary" onClick={logout}>
				Log out
			</button>
		</div>
	);
}
