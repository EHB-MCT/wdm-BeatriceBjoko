import { useEffect } from "react";
import { eventService } from "../../services/eventService";

export default function QuestionCard({ question, sessionId, onAnswer }) {
	useEffect(() => {
		eventService.sendEvent({
			type: "question_view",
			sessionId,
			payload: {
				questionId: question.id,
			},
		});
	}, [question.id, sessionId]);

	return (
		<div>
			<h2>Vraag</h2>
			<p>{question.text}</p>

			{question.answers.map((answer) => (
				<button key={answer.id} className="btn btn-primary" type="button" onClick={() => onAnswer(answer)}>
					{answer.text}
				</button>
			))}
		</div>
	);
}
