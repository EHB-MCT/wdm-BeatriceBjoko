export default function QuizProgress({ currentQuestion, totalQuestions }) {
	return (
		<div className="card">
			<div className="progress-bar">
				<span>Question {currentQuestion} of {totalQuestions}</span>
			</div>
		</div>
	);
}