import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

export default function HoverIndecisionChart({ data }) {
	if (!data || data.length === 0) {
		return <p>No hover indecision data available.</p>;
	}

	const formatQuestionId = (id) => `Q${id}`;
	const formatRatio = (ratio) => `${(ratio * 100).toFixed(1)}%`;
	const formatCount = (count) => count.toString();

	const getColorByIndecision = (ratio) => {
		if (ratio >= 0.5) return "#ef4444";
		if (ratio >= 0.3) return "#f59e0b";
		return "#10b981";
	};

	const CustomTooltip = ({ active, payload }) => {
		if (active && payload && payload.length) {
			const data = payload[0].payload;
			return (
				<div className="custom-tooltip">
					<p className="tooltip-label">{`Question ${formatQuestionId(data.questionId)}`}</p>
					<p className="tooltip-item">Total Intents: {formatCount(data.totalIntents)}</p>
					<p className="tooltip-item">Total Switches: {formatCount(data.totalSwitches)}</p>
					<p className="tooltip-item">Unique Sessions: {formatCount(data.uniqueSessions)}</p>
					<p className="tooltip-item">Avg Switches/Session: {data.avgSwitchesPerSession}</p>
					<p className="tooltip-item" style={{ color: getColorByIndecision(data.indecisionRatio) }}>
						Indecision Ratio: {formatRatio(data.indecisionRatio)}
					</p>
				</div>
			);
		}
		return null;
	};

	const chartData = data.map((item) => ({
		...item,
		color: getColorByIndecision(item.indecisionRatio),
	}));

	return (
		<>
			<h2>Hover Indecision Analysis</h2>
			<p className="card-description">Relationship between hover activity and answer switching. Higher ratios indicate users frequently change their minds between options.</p>

			<ResponsiveContainer width="100%" height={300}>
				<ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="totalIntents" name="Total Hover Intents" label={{ value: "Total Hover Intents", position: "insideBottom", offset: -5 }} />
					<YAxis dataKey="indecisionRatio" name="Indecision Ratio" label={{ value: "Indecision Ratio", angle: -90, position: "insideLeft" }} tickFormatter={formatRatio} domain={[0, "dataMax + 0.1"]} />
					<Tooltip content={<CustomTooltip />} />
					<Legend />
					<Scatter name="Questions" data={chartData} fill="#8884d8">
						{chartData.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={entry.color} />
						))}
					</Scatter>
				</ScatterChart>
			</ResponsiveContainer>

			<div className="chart-insights">
				<h4>Key Insights:</h4>
				<ul>
					<li>
						<strong>Red dots:</strong> High indecision (≥50%) - users frequently switch between answers
					</li>
					<li>
						<strong>Orange dots:</strong> Medium indecision (30-50%) - moderate answer switching
					</li>
					<li>
						<strong>Green dots:</strong> Low indecision (&lt;30%) - users are more decisive
					</li>
					<li>
						<strong>X-axis position:</strong> Shows overall engagement (more hover intents = more engagement)
					</li>
					<li>
						<strong>Top-right area:</strong> High engagement + high indecision = potentially confusing questions
					</li>
				</ul>
			</div>
		</>
	);
}
