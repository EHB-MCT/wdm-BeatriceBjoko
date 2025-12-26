import { useEffect, useRef } from "react";
import { eventService } from "../../services/eventService";
import { useAnswerHoverTracking } from "../../hooks/useAnswerHoverTracking";

export default function QuestionCard({ question, sessionId, onAnswer }) {
	const questionStartTimeRef = useRef(null);

	const { getAnswerHoverHandlers, getClickMeta } = useAnswerHoverTracking({
		sessionId,
		questionId: question.id,
	});

	useEffect(() => {
		questionStartTimeRef.current = performance.now();

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

	return (
		<div className="card">
			<h2>Question</h2>
			<p>{question.text}</p>

			{question.answers.map((answer) => (
				<button key={answer.id} type="button" className="btn btn-primary" {...getAnswerHoverHandlers(answer.id)} onClick={() => handleAnswerClick(answer)}>
					{answer.text}
				</button>
			))}
		</div>
	);
}
