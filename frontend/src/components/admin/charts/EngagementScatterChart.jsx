import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function EngagementScatterChart({ data }) {
	if (!data || data.length === 0) {
		return <p>No engagement data available.</p>;
	}

	return (
		<>
			<h2>Question Engagement Analysis</h2>
			<p className="card-description">Hint usage vs tab blur behavior</p>

			<ResponsiveContainer width="100%" height={300}>
				<ScatterChart>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="hintCount" name="Hints Used" />
					<YAxis dataKey="tabBlurAfterHintCount" name="Tab Blurs After Hint" />
					<Tooltip />
					<Scatter data={data} fill="#3b82f6" />
				</ScatterChart>
			</ResponsiveContainer>
		</>
	);
}
