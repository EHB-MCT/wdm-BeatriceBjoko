import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function HoverHesitationChart({ data }) {
	if (!data || data.length === 0) {
		return <p>No hover hesitation data available.</p>;
	}

	const formatQuestionId = (id) => `Q${id}`;
	const formatTime = (ms) => `${(ms / 1000).toFixed(2)}s`;
	const formatCount = (count) => count.toString();

	const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			return (
				<div className="custom-tooltip">
					<p className="tooltip-label">{`Question ${formatQuestionId(label)}`}</p>
					{payload.map((entry, index) => {
						const value = entry.value;
						let formattedValue;
						
						if (entry.dataKey === 'totalHoverIntents') {
							formattedValue = formatCount(value);
						} else {
							formattedValue = formatTime(value);
						}

						return (
							<p key={index} className="tooltip-item" style={{ color: entry.color }}>
								{`${entry.name}: ${formattedValue}`}
							</p>
						);
					})}
				</div>
			);
		}
		return null;
	};

	return (
		<>
			<h2>Hover Hesitation Analysis</h2>
			<p className="card-description">
				Time users take before committing to hover over an answer. Higher values indicate more hesitation or uncertainty.
			</p>

			<ResponsiveContainer width="100%" height={300}>
				<BarChart data={data.slice(0, 10)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="questionId" tickFormatter={formatQuestionId} />
					<YAxis tickFormatter={formatTime} />
					<Tooltip content={<CustomTooltip />} />
					<Legend />
					<Bar 
						dataKey="avgIntentDelayMs" 
						fill="#f59e0b" 
						name="Avg Hesitation Time"
						radius={[4, 4, 0, 0]}
					/>
					<Bar 
						dataKey="medianIntentDelayMs" 
						fill="#10b981" 
						name="Median Hesitation Time"
						radius={[4, 4, 0, 0]}
					/>
				</BarChart>
			</ResponsiveContainer>

			<div className="chart-insights">
				<h4>Key Insights:</h4>
				<ul>
					<li><strong>Average vs Median:</strong> Large differences suggest outliers with extreme hesitation</li>
					<li><strong>Higher values:</strong> May indicate confusing questions or unclear answer options</li>
					<li><strong>Lower values:</strong> Suggest confident decision-making or potentially rushed choices</li>
				</ul>
			</div>
		</>
	);
}