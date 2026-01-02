import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function CorrelationChart({ data }) {
	if (!data || data.length === 0) {
		return <p>No correlation data available.</p>;
	}

	return (
		<>
			<h2>Tab Blur vs Answer Accuracy</h2>
			<p className="card-description">Correlation between tab blur behavior and answer correctness</p>

			<ResponsiveContainer width="100%" height={300}>
				<BarChart data={data}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="category" />
					<YAxis />
					<Tooltip />
					<Legend />
					<Bar dataKey="errorRate" fill="#8b5cf6" name="Error Rate (%)" />
				</BarChart>
			</ResponsiveContainer>
		</>
	);
}
