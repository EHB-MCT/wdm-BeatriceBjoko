import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { eventService } from "../services/eventService";
import { quizQuestions } from "../data/quizQuestions";
import QuestionCard from "../components/quiz/QuestionCard";

export default function QuizPage() {
	const { user, logout } = useAuth();

	const sessionIdRef = useRef(crypto.randomUUID());
	const sessionStartTimeRef = useRef(null);

	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

	const currentQuestion = quizQuestions[currentQuestionIndex];

	// SESSION START
	useEffect(() => {
		sessionStartTimeRef.current = performance.now();

		eventService.sendEvent({
			type: "session_start",
			sessionId: sessionIdRef.current,
			meta: eventService.getDefaultMeta(),
		});
	}, []);

	// SESSION END (quiz completed)
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

	// SESSION END (tab close / refresh)
	useEffect(() => {
		function handleBeforeUnload() {
			const durationMs = Math.round(performance.now() - sessionStartTimeRef.current);

			navigator.sendBeacon(
				"http://localhost:5000/api/events",
				JSON.stringify({
					type: "session_end",
					sessionId: sessionIdRef.current,
					payload: {
						durationMs,
						completed: false,
					},
				})
			);
		}

		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
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
