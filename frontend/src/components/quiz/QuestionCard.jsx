import { useEffect, useRef, useState } from "react";
import { eventService } from "../../services/eventService";
import { useAnswerHoverTracking } from "../../hooks/useAnswerHoverTracking";
import { useHintTracking } from "../../hooks/useHintTracking";

export default function QuestionCard({ question, sessionId, onAnswer }) {
	const questionStartTimeRef = useRef(null);
	const [isHintVisible, setIsHintVisible] = useState(false);

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
	}, [question.id, sessionId]);

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

			{question.answers.map((answer) => (
				<button key={answer.id} type="button" className="btn btn-primary" {...getAnswerHoverHandlers(answer.id)} onClick={() => handleAnswerClick(answer)}>
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
