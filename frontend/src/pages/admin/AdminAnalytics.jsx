import { useAdminAnalytics } from "../../hooks/useAdminAnalytics";

import TabBlurByQuestionChart from "../../components/admin/charts/TabBlurByQuestionChart";
import HintEffectivenessChart from "../../components/admin/charts/HintEffectivenessChart";
import CorrelationChart from "../../components/admin/charts/CorrelationChart";
import EngagementScatterChart from "../../components/admin/charts/EngagementScatterChart";
import HoverHesitationChart from "../../components/admin/charts/HoverHesitationChart";
import HoverIndecisionChart from "../../components/admin/charts/HoverIndecisionChart";
import UserSelector from "../../components/admin/UserSelector";
import DecisionInsights from "../../components/admin/DecisionInsights";

import "./AdminAnalytics.css";

export default function AdminAnalytics() {
	const { 
		tabBlurData, 
		hintBlurData, 
		correlationData, 
		hoverHesitationData,
		hoverIndecisionData,
		loading, 
		error, 
		selectedTimeWindow, 
		handleTimeWindowChange,
		selectedUserId,
		handleUserSelect,
		analyticsSummary,
		isUserSpecific
	} = useAdminAnalytics();

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
				<div className="header-subtitle">
					{isUserSpecific ? "User-Specific Analytics" : "Global Analytics"}
				</div>
			</div>

			{/* User Selection and Controls */}
			<div className="analytics-controls">
				<UserSelector 
					selectedUserId={selectedUserId}
					onUserSelect={handleUserSelect}
					disabled={loading}
				/>

				<div className="time-window-selector">
					<label htmlFor="timeWindow">Hint Analysis Time Window:</label>
					<select 
						id="timeWindow" 
						value={selectedTimeWindow} 
						onChange={(e) => handleTimeWindowChange(Number(e.target.value))}
						disabled={loading}
					>
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

				<div className="analytics-card">
					<HoverHesitationChart data={hoverHesitationData} />
				</div>

				<div className="analytics-card">
					<HoverIndecisionChart data={hoverIndecisionData} />
				</div>
			</div>

			{/* DECISION INSIGHTS */}
			<DecisionInsights 
				analyticsSummary={analyticsSummary}
				isUserSpecific={isUserSpecific}
				selectedUserId={selectedUserId}
			/>
		</div>
	);
}
