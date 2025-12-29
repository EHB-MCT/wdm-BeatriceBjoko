import { useAdminAnalytics } from "../../hooks/useAdminAnalytics";

import TabBlurByQuestionChart from "../../components/admin/charts/TabBlurByQuestionChart";
import HintEffectivenessChart from "../../components/admin/charts/HintEffectivenessChart";
import CorrelationChart from "../../components/admin/charts/CorrelationChart";
import EngagementScatterChart from "../../components/admin/charts/EngagementScatterChart";

import "./AdminAnalytics.css";

export default function AdminAnalytics() {
	const { tabBlurData, hintBlurData, correlationData, loading, error, selectedTimeWindow, setSelectedTimeWindow } = useAdminAnalytics();

	if (loading) {
		return <div className="analytics-loading">Loading analytics data...</div>;
	}

	if (error) {
		return <div className="analytics-error">{error}</div>;
	}

	return (
		<div className="admin-analytics">
			<div className="analytics-header">
				<h1>Quiz Analytics Dashboard</h1>

				<div className="time-window-selector">
					<label htmlFor="timeWindow">Hint Analysis Time Window:</label>
					<select id="timeWindow" value={selectedTimeWindow} onChange={(e) => setSelectedTimeWindow(Number(e.target.value))}>
						<option value={15000}>15 seconds</option>
						<option value={30000}>30 seconds</option>
						<option value={60000}>1 minute</option>
						<option value={300000}>5 minutes</option>
					</select>
				</div>
			</div>

			{/* CHARTS */}
			<div className="analytics-grid">
				<div className="analytics-card">
					<TabBlurByQuestionChart data={tabBlurData} />
				</div>

				<div className="analytics-card">
					<HintEffectivenessChart data={hintBlurData} />
				</div>

				<div className="analytics-card">
					<CorrelationChart data={correlationData} />
				</div>

				<div className="analytics-card">
					<EngagementScatterChart data={hintBlurData} />
				</div>
			</div>

			{/* INSIGHTS */}
			<div className="analytics-insights">
				<h2>Key Insights</h2>

				<div className="insights-grid">
					<div className="insight-card">
						<h3>Most Disengaging Question</h3>
						<p>{tabBlurData.length > 0 ? `Question ${tabBlurData[0].questionId} with ${tabBlurData[0].tabBlurCount} tab blurs` : "No data available"}</p>
					</div>

					<div className="insight-card">
						<h3>Hint Ineffectiveness</h3>
						<p>
							{hintBlurData.length > 0 && hintBlurData[0].blurAfterHintRatio > 0.5
								? `Question ${hintBlurData[0].questionId}: ${(hintBlurData[0].blurAfterHintRatio * 100).toFixed(1)}% still disengage after hints`
								: "Hints appear to be generally effective"}
						</p>
					</div>

					<div className="insight-card">
						<h3>Tab Blur Impact</h3>
						<p>
							{correlationData.length === 2 && correlationData[0].errorRate > correlationData[1].errorRate
								? `Users who blur tabs have ${((correlationData[0].errorRate / correlationData[1].errorRate - 1) * 100).toFixed(1)}% higher error rates`
								: "Tab blur doesn't significantly impact accuracy"}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
