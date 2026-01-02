import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function HintEffectivenessChart({ data }) {
	if (!data || data.length === 0) {
		return <p>No hint usage data available.</p>;
	}

	const formatQuestionId = (id) => `Q${id}`;
	const formatPercentage = (v) => `${(v * 100).toFixed(1)}%`;

	return (
		<>
			<h2>Tab Blur After Hint Usage</h2>
			<p className="card-description">Questions where users still disengage after using hints</p>

			<ResponsiveContainer width="100%" height={300}>
				<LineChart data={data.slice(0, 10)}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="questionId" tickFormatter={formatQuestionId} />
					<YAxis />
					<Tooltip labelFormatter={formatQuestionId} formatter={(value, name) => (name === "blurAfterHintRatio" ? formatPercentage(value) : value)} />
					<Legend />
					<Line type="monotone" dataKey="blurAfterHintRatio" stroke="#f59e0b" name="Blur After Hint Rate" />
					<Line type="monotone" dataKey="hintCount" stroke="#10b981" name="Hints Used" />
					<Line type="monotone" dataKey="tabBlurAfterHintCount" stroke="#ef4444" name="Tab Blurs" />
				</LineChart>
			</ResponsiveContainer>
		</>
	);
}
