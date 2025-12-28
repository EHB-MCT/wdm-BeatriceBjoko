import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { eventService } from "../services/eventService";
import { quizQuestions } from "../data/quizQuestions";
import QuestionCard from "../components/quiz/QuestionCard";
import QuizProgress from "../components/quiz/QuizProgress";
import QuizResults from "../components/quiz/QuizResults";
import { useTabBlurTracking } from "../hooks/useTabBlurTracking";
import { useSessionInfluence } from "../context/SessionInfluenceContext";

export default function QuizPage() {
	const { user, logout } = useAuth();
	const { addStress } = useSessionInfluence();

	// Stable session id for this quiz run
	const sessionIdRef = useRef(crypto.randomUUID());
	const sessionStartTimeRef = useRef(null);

	// Quiz state
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [score, setScore] = useState(0);
	const [answers, setAnswers] = useState([]);

	const currentQuestion = quizQuestions[currentQuestionIndex];
	const isQuizCompleted = currentQuestionIndex >= quizQuestions.length;

	useTabBlurTracking({
		sessionId: sessionIdRef.current,
		getCurrentQuestionId: () => quizQuestions[currentQuestionIndex]?.id,
	});

	/**
	 * SESSION START
	 */
	useEffect(() => {
		if (sessionStartTimeRef.current === null) {
			sessionStartTimeRef.current = performance.now();

			eventService.sendEvent({
				type: "session_start",
				sessionId: sessionIdRef.current,
				meta: eventService.getDefaultMeta(),
			});
		}
	}, []);

	/**
	 * SESSION END quiz completed
	 */
	useEffect(() => {
		if (isQuizCompleted && sessionStartTimeRef.current !== null) {
			const durationMs = Math.round(performance.now() - sessionStartTimeRef.current);

			eventService.sendEvent({
				type: "session_end",
				sessionId: sessionIdRef.current,
				payload: {
					durationMs,
					completed: true,
					score,
					totalQuestions: quizQuestions.length,
					correctAnswers: answers.filter((a) => a.correct).length,
				},
			});
		}
	}, [isQuizCompleted, score, answers]);

	/**
	 * LOGOUT → quitting quiz
	 */
	function handleLogout() {
		if (!isQuizCompleted && sessionStartTimeRef.current !== null) {
			const durationMs = Math.round(performance.now() - sessionStartTimeRef.current);

			eventService.sendEvent({
				type: "session_end",
				sessionId: sessionIdRef.current,
				payload: {
					durationMs,
					completed: false,
					reason: "logout",
					score,
					questionsAnswered: currentQuestionIndex,
				},
			});
		}

		logout();
	}

	function handleAnswer(answer) {
		setAnswers((prev) => [
			...prev,
			{
				questionId: currentQuestion.id,
				answerId: answer.id,
				correct: answer.correct,
			},
		]);

		if (answer.correct) {
			setScore((prev) => prev + 1);
		} else {
			// Influence: wrong answer increases stress
			addStress(0.5);
		}

		setCurrentQuestionIndex((prev) => prev + 1);
	}

	return (
		<div className="page-container">
			<h1 className="page-title">Quiz</h1>
			<p className="page-subtitle">Welkom, {user?.email}</p>

			{!isQuizCompleted && <QuizProgress currentQuestion={currentQuestionIndex + 1} totalQuestions={quizQuestions.length} />}

			{currentQuestion ? <QuestionCard question={currentQuestion} sessionId={sessionIdRef.current} onAnswer={handleAnswer} /> : <QuizResults score={score} totalQuestions={quizQuestions.length} />}

			<hr className="section-divider" />

			<button className="btn btn-secondary" onClick={handleLogout} type="button">
				Log out
			</button>
		</div>
	);
}
