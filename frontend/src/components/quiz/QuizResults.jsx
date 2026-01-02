export default function QuizResults({ score, totalQuestions }) {
	const percentage = Math.round((score / totalQuestions) * 100);

	return (
		<div className="card">
			<h2>Quiz Completed! 🎉</h2>
			<p>Your score: {score} out of {totalQuestions}</p>
			<p>Percentage: {percentage}%</p>
		</div>
	);
}