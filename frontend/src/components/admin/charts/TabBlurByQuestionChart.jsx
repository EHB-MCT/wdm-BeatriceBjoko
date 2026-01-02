import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function TabBlurByQuestionChart({ data }) {
	if (!data || data.length === 0) {
		return <p>No tab blur data available.</p>;
	}

	const formatQuestionId = (id) => `Q${id}`;

	return (
		<>
			<h2>Tab Blur Count by Question</h2>
			<p className="card-description">Questions that cause the most user disengagement</p>

			<ResponsiveContainer width="100%" height={300}>
				<BarChart data={data.slice(0, 10)}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="questionId" tickFormatter={formatQuestionId} />
					<YAxis />
					<Tooltip labelFormatter={formatQuestionId} />
					<Legend />
					<Bar dataKey="tabBlurCount" fill="#ef4444" name="Tab Blurs" />
					<Bar dataKey="uniqueUserCount" fill="#3b82f6" name="Unique Users" />
				</BarChart>
			</ResponsiveContainer>
		</>
	);
}
