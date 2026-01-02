import "./DecisionInsights.css";

const DecisionInsights = ({ analyticsSummary, isUserSpecific, selectedUserId }) => {
	const getEngagementPatternColor = (pattern) => {
		switch (pattern) {
			case "high_engagement":
				return "#10b981";
			case "high_disengagement":
				return "#ef4444";
			case "cognitive_overload":
				return "#f59e0b";
			case "no_data":
				return "#9ca3af";
			default:
				return "#3b82f6";
		}
	};

	const getEngagementPatternLabel = (pattern) => {
		switch (pattern) {
			case "high_engagement":
				return "High Engagement";
			case "high_disengagement":
				return "High Disengagement";
			case "cognitive_overload":
				return "Cognitive Overload";
			case "no_data":
				return "No Data Available";
			default:
				return "Normal Engagement";
		}
	};

	const getInsightMessages = () => {
		const messages = [];
		const { cognitiveOverloadIndicators, mostDisengagingQuestion, hintEffectivenessRate } = analyticsSummary;

		if (cognitiveOverloadIndicators.includes("high_error_with_disengagement")) {
			messages.push({
				type: "warning",
				title: "Cognitive Overload Detected",
				description: "This user shows repeated disengagement combined with high error rates, which may indicate cognitive overload or difficulty with the material.",
			});
		}

		if (cognitiveOverloadIndicators.includes("hint_ineffectiveness")) {
			messages.push({
				type: "warning",
				title: "Hint Ineffectiveness",
				description: "User continues to disengage even after using hints, suggesting the hints may not be helpful or the user needs different support.",
			});
		}

		if (cognitiveOverloadIndicators.includes("persistent_disengagement")) {
			messages.push({
				type: "alert",
				title: "Persistent Disengagement",
				description: "User shows consistent disengagement across multiple questions, indicating possible motivation issues or content difficulty.",
			});
		}

		if (mostDisengagingQuestion && mostDisengagingQuestion.tabBlurCount > 5) {
			messages.push({
				type: "info",
				title: "Problematic Question Identified",
				description: `Question ${mostDisengagingQuestion.questionId} causes the most disengagement (${mostDisengagingQuestion.tabBlurCount} tab blurs). Consider reviewing this question's content or difficulty.`,
			});
		}

		if (hintEffectivenessRate < 0.5 && hintEffectivenessRate > 0) {
			messages.push({
				type: "suggestion",
				title: "Improve Hint System",
				description: `Hints are only ${(hintEffectivenessRate * 100).toFixed(0)}% effective. Consider improving hint quality or providing alternative support mechanisms.`,
			});
		}

		if (analyticsSummary.engagementPattern === "high_engagement") {
			messages.push({
				type: "success",
				title: "Excellent Engagement",
				description: "User shows strong engagement with low disengagement rates and effective hint usage. This indicates good content comprehension and motivation.",
			});
		}

		return messages;
	};

	const getInsightTypeColor = (type) => {
		switch (type) {
			case "success":
				return "#10b981";
			case "warning":
				return "#f59e0b";
			case "alert":
				return "#ef4444";
			case "suggestion":
				return "#3b82f6";
			case "info":
				return "#6366f1";
			default:
				return "#6b7280";
		}
	};

	const getInsightTypeIcon = (type) => {
		switch (type) {
			case "success":
				return "✓";
			case "warning":
				return "⚠";
			case "alert":
				return "⚡";
			case "suggestion":
				return "💡";
			case "info":
				return "ℹ";
			default:
				return "•";
		}
	};

	const insightMessages = getInsightMessages();

	if (analyticsSummary.engagementPattern === "no_data") {
		return (
			<div className="decision-insights">
				<h2>Decision Insights</h2>
				<div className="insights-placeholder">
					<p>No analytics data available for interpretation.</p>
					<p>Select a user or ensure there's sufficient activity data.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="decision-insights">
			<h2>Decision Insights</h2>

			<div className="engagement-pattern-summary">
				<div className="pattern-header">
					<h3>Overall Pattern</h3>
					<span className="pattern-badge" style={{ backgroundColor: getEngagementPatternColor(analyticsSummary.engagementPattern) }}>
						{getEngagementPatternLabel(analyticsSummary.engagementPattern)}
					</span>
				</div>

				<div className="pattern-metrics">
					<div className="metric">
						<span className="metric-label">Avg Tab Blur Rate:</span>
						<span className="metric-value">{analyticsSummary.averageBlurRate.toFixed(1)}</span>
					</div>
					<div className="metric">
						<span className="metric-label">Hint Effectiveness:</span>
						<span className="metric-value">{(analyticsSummary.hintEffectivenessRate * 100).toFixed(0)}%</span>
					</div>
					<div className="metric">
						<span className="metric-label">Total Tab Blurs:</span>
						<span className="metric-value">{analyticsSummary.totalTabBlurs}</span>
					</div>
				</div>
			</div>

			<div className="actionable-insights">
				<h3>Interpretation & Recommendations</h3>
				{insightMessages.length > 0 ? (
					<div className="insights-list">
						{insightMessages.map((insight, index) => (
							<div key={index} className="insight-item" style={{ borderLeftColor: getInsightTypeColor(insight.type) }}>
								<div className="insight-header">
									<span className="insight-icon" style={{ color: getInsightTypeColor(insight.type) }}>
										{getInsightTypeIcon(insight.type)}
									</span>
									<h4 className="insight-title">{insight.title}</h4>
								</div>
								<p className="insight-description">{insight.description}</p>
							</div>
						))}
					</div>
				) : (
					<div className="no-insights">
						<p>No specific insights available. User behavior appears within normal ranges.</p>
					</div>
				)}
			</div>

			<div className="decision-support">
				<h3>Decision Support</h3>
				<div className="decision-grid">
					<div className="decision-item">
						<h4>Content Review</h4>
						<p>
							{analyticsSummary.mostDisengagingQuestion && analyticsSummary.mostDisengagingQuestion.tabBlurCount > 3
								? `Prioritize reviewing Question ${analyticsSummary.mostDisengagingQuestion.questionId} for potential improvements.`
								: "No immediate content review required based on current data."}
						</p>
					</div>

					<div className="decision-item">
						<h4>User Support</h4>
						<p>
							{analyticsSummary.engagementPattern === "cognitive_overload"
								? "Consider providing additional learning resources or breaking down complex concepts."
								: analyticsSummary.engagementPattern === "high_disengagement"
								? "User may need motivation support or content that better matches their interests."
								: "Current support approach appears effective."}
						</p>
					</div>

					<div className="decision-item">
						<h4>Hint Optimization</h4>
						<p>{analyticsSummary.hintEffectivenessRate < 0.6 ? "Review and improve hint quality to increase effectiveness." : "Hint system is performing well."}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DecisionInsights;
