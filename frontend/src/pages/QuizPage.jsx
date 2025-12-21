import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { eventService } from "../services/eventService";
import { sessionTracker } from "../services/sessionTracker";
import { quizQuestions } from "../data/quizQuestions";
import QuestionCard from "../components/quiz/QuestionCard";

const SESSION_PING_INTERVAL_MS = 10_000;

export default function QuizPage() {
	const { user, logout } = useAuth();

	const sessionIdRef = useRef(crypto.randomUUID());
	const sessionStartTimeRef = useRef(null);

	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

	const currentQuestion = quizQuestions[currentQuestionIndex];

	// SESSION START
	useEffect(() => {
		sessionStartTimeRef.current = performance.now();

		// Recover any abandoned sessions from previous visit
		sessionTracker.recoverAbandonedSessions();

		eventService.sendEvent({
			type: "session_start",
			sessionId: sessionIdRef.current,
			meta: eventService.getDefaultMeta(),
		});
	}, []);

	// SESSION HEARTBEAT
	useEffect(() => {
		const interval = setInterval(() => {
			eventService.sendEvent({
				type: "session_ping",
				sessionId: sessionIdRef.current,
			});
		}, SESSION_PING_INTERVAL_MS);

		return () => clearInterval(interval);
	}, []);

	// SESSION END (QUIZ COMPLETED)
	useEffect(() => {
		if (!currentQuestion) {
			const durationMs = Math.round(performance.now() - sessionStartTimeRef.current);

			eventService.sendEvent({
				type: "session_end",
				sessionId: sessionIdRef.current,
				payload: {
					durationMs,
					completed: true,
				},
			});
		}
	}, [currentQuestion]);

	// UNLOAD HANDLING
	useEffect(() => {
		const handleUnload = () => {
			const durationMs = Math.round(performance.now() - sessionStartTimeRef.current);
			
			// Store abandoned session as backup
			sessionTracker.storeAbandonedSession(sessionIdRef.current, durationMs);

			// Try sendBeacon as best effort
			if (navigator.sendBeacon) {
				const event = sessionTracker.storeAbandonedSession(sessionIdRef.current, durationMs);
				const blob = new Blob([JSON.stringify(event)], { type: "application/json" });
				navigator.sendBeacon("/api/events", blob);
			}
		};

		const handleVisibilityChange = () => {
			if (document.visibilityState === "hidden") {
				eventService.sendEvent({
					type: "tab_blur",
					sessionId: sessionIdRef.current,
					payload: { timestamp: Date.now() },
				});
			}
		};

		window.addEventListener("beforeunload", handleUnload);
		window.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			window.removeEventListener("beforeunload", handleUnload);
			window.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, []);

	function handleAnswer() {
		setCurrentQuestionIndex((prev) => prev + 1);
	}

	return (
		<div className="page-container">
			<h1 className="page-title">Quiz</h1>
			<p className="page-subtitle">Welkom, {user?.email}</p>

			{currentQuestion ? <QuestionCard question={currentQuestion} sessionId={sessionIdRef.current} onAnswer={handleAnswer} /> : <p>Quiz voltooid 🎉</p>}

			<hr className="section-divider" />

			<button className="btn btn-secondary" onClick={logout} type="button">
				Log out
			</button>
		</div>
	);
}