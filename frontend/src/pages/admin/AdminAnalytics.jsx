import { useAdminAnalytics } from "../../hooks/useAdminAnalytics";
import TabBlurByQuestionChart from "../../components/admin/charts/TabBlurByQuestionChart";
import HintEffectivenessChart from "../../components/admin/charts/HintEffectivenessChart";
import CorrelationChart from "../../components/admin/charts/CorrelationChart";
import EngagementScatterChart from "../../components/admin/charts/EngagementScatterChart";
import HoverHesitationChart from "../../components/admin/charts/HoverHesitationChart";
import HoverIndecisionChart from "../../components/admin/charts/HoverIndecisionChart";
import UserSelector from "../../components/admin/UserSelector";
import DecisionInsights from "../../components/admin/DecisionInsights";
import Card from "../../components/ui/Card/Card";
import "./AdminAnalytics.css";

export default function AdminAnalytics() {
	const { tabBlurData, hintBlurData, correlationData, hoverHesitationData, hoverIndecisionData, loading, error, selectedTimeWindow, handleTimeWindowChange, selectedUserId, handleUserSelect, analyticsSummary, isUserSpecific } = useAdminAnalytics();

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
				<div className="header-subtitle">{isUserSpecific ? "User-Specific Analytics" : "Global Analytics"}</div>
			</div>

			<div className="analytics-controls">
				<UserSelector selectedUserId={selectedUserId} onUserSelect={handleUserSelect} disabled={loading} />

				<div className="time-window-selector">
					<label htmlFor="timeWindow">Hint Analysis Time Window:</label>
					<select id="timeWindow" value={selectedTimeWindow} onChange={(e) => handleTimeWindowChange(Number(e.target.value))} disabled={loading}>
						<option value={15000}>15 seconds</option>
						<option value={30000}>30 seconds</option>
						<option value={60000}>1 minute</option>
						<option value={300000}>5 minutes</option>
					</select>
				</div>
			</div>

			<div className="analytics-grid">
				<Card variant="analytics">
					<TabBlurByQuestionChart data={tabBlurData} />
				</Card>

				<Card variant="analytics">
					<HintEffectivenessChart data={hintBlurData} />
				</Card>

				<Card variant="analytics">
					<CorrelationChart data={correlationData} />
				</Card>

				<Card variant="analytics">
					<EngagementScatterChart data={hintBlurData} />
				</Card>

				<Card variant="analytics">
					<HoverHesitationChart data={hoverHesitationData} />
				</Card>

				<Card variant="analytics">
					<HoverIndecisionChart data={hoverIndecisionData} />
				</Card>
			</div>

			<DecisionInsights analyticsSummary={analyticsSummary} isUserSpecific={isUserSpecific} selectedUserId={selectedUserId} />
		</div>
	);
}
