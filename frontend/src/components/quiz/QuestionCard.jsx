import { useEffect, useRef, useState } from "react";
import { eventService } from "../../services/eventService";
import { useAnswerHoverTracking } from "../../hooks/useAnswerHoverTracking";
import { useHintTracking } from "../../hooks/useHintTracking";
import { useSessionInfluence } from "../../context/SessionInfluenceContext";
import { INFLUENCE_BUTTON_DELAY_MS } from "../../config/tracking";

export default function QuestionCard({ question, sessionId, onAnswer }) {
	const questionStartTimeRef = useRef(null);
	const [isHintVisible, setIsHintVisible] = useState(false);
	const [buttonsEnabled, setButtonsEnabled] = useState(true);

	const { isInfluenced } = useSessionInfluence();

	const { getAnswerHoverHandlers, getClickMeta } = useAnswerHoverTracking({
		sessionId,
		questionId: question.id,
	});

	const { trackHintUsed } = useHintTracking({
		sessionId,
		questionId: question.id,
	});

	useEffect(() => {
		questionStartTimeRef.current = performance.now();
		setIsHintVisible(false);

		eventService.sendEvent({
			type: "question_view",
			sessionId,
			payload: {
				questionId: question.id,
			},
		});

		// If the session is influenced, disable buttons for 2 seconds
		if (isInfluenced) {
			setButtonsEnabled(false);
			const timer = setTimeout(() => {
				setButtonsEnabled(true);
			}, INFLUENCE_BUTTON_DELAY_MS);

			return () => clearTimeout(timer);
		}

		setButtonsEnabled(true);
	}, [question.id, sessionId, isInfluenced]);

	function handleAnswerClick(answer) {
		const responseTimeMs = Math.round(performance.now() - questionStartTimeRef.current);
		const hoverMeta = getClickMeta();

		eventService.sendEvent({
			type: "question_answer",
			sessionId,
			payload: {
				questionId: question.id,
				answerId: answer.id,
				correct: answer.correct,
				responseTimeMs,
				...hoverMeta,
			},
		});

		onAnswer(answer);
	}

	function handleHintClick() {
		trackHintUsed();
		setIsHintVisible(true);
	}

	return (
		<div className="card">
			<h2>Question</h2>
			<p>{question.text}</p>

			{isInfluenced && <p className="influence-text">Don't worry take a moment. Many people find this question challenging.</p>}

			{question.answers.map((answer) => (
				<button key={answer.id} type="button" className={`btn btn-primary ${!buttonsEnabled ? "btn-disabled" : ""}`} disabled={!buttonsEnabled} {...getAnswerHoverHandlers(answer.id)} onClick={() => handleAnswerClick(answer)}>
					{answer.text}
				</button>
			))}

			<hr />

			<button type="button" className="btn btn-secondary" onClick={handleHintClick} disabled={isHintVisible}>
				Need a hint?
			</button>

			{isHintVisible && <p className="hint-text">Take a moment. One option is often eliminated by logic alone.</p>}
		</div>
	);
}
