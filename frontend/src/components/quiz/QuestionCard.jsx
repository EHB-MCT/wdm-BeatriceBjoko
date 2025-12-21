import { useEffect, useRef } from "react";
import { eventService } from "../../services/eventService";

export default function QuestionCard({ question, sessionId, onAnswer }) {
	const questionStartTimeRef = useRef(null);

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

		eventService.sendEvent({
			type: "question_answer",
			sessionId,
			payload: {
				questionId: question.id,
				answerId: answer.id,
				correct: answer.correct,
				responseTimeMs,
			},
		});

		onAnswer(answer);
	}

	return (
		<div className="card">
			<h2>Vraag</h2>
			<p>{question.text}</p>

			{question.answers.map((answer) => (
				<button key={answer.id} className="btn btn-primary" type="button" onClick={() => handleAnswerClick(answer)}>
					{answer.text}
				</button>
			))}
		</div>
	);
}
