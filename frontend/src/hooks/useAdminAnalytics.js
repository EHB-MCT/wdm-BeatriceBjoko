import { useEffect, useState, useCallback } from "react";
import { analyticsService } from "../services/analyticsService";

export function useAdminAnalytics() {
	const [selectedUserId, setSelectedUserId] = useState(null);
	const [tabBlurData, setTabBlurData] = useState([]);
	const [hintBlurData, setHintBlurData] = useState([]);
	const [correlationData, setCorrelationData] = useState([]);
	const [hoverHesitationData, setHoverHesitationData] = useState([]);
	const [hoverIndecisionData, setHoverIndecisionData] = useState([]);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [selectedTimeWindow, setSelectedTimeWindow] = useState(30000);

	const fetchAnalytics = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const [tabBlurResponse, hintBlurResponse, correlationResponse, hoverHesitationResponse, hoverIndecisionResponse] = await Promise.all([
				analyticsService.getTabBlurByQuestion(selectedUserId),
				analyticsService.getTabBlurAfterHint(selectedTimeWindow, selectedUserId),
				analyticsService.getTabBlurVsAnswerError(15000, selectedUserId),
				analyticsService.getHoverHesitationByQuestion(selectedUserId),
				analyticsService.getHoverIndecisionByQuestion(selectedUserId),
			]);

			setTabBlurData(Array.isArray(tabBlurResponse?.items) ? tabBlurResponse.items : []);

			setHintBlurData(Array.isArray(hintBlurResponse?.items) ? hintBlurResponse.items : []);

			if (correlationResponse?.withBlur && correlationResponse?.withoutBlur) {
				setCorrelationData([
					{
						category: "With Tab Blur",
						errorRate: correlationResponse.withBlur.errorRate * 100,
						totalAnswers: correlationResponse.withBlur.answers,
						errors: correlationResponse.withBlur.errors,
					},
					{
						category: "Without Tab Blur",
						errorRate: correlationResponse.withoutBlur.errorRate * 100,
						totalAnswers: correlationResponse.withoutBlur.answers,
						errors: correlationResponse.withoutBlur.errors,
					},
				]);
			} else {
				setCorrelationData([]);
			}

			setHoverHesitationData(Array.isArray(hoverHesitationResponse?.items) ? hoverHesitationResponse.items : []);

			setHoverIndecisionData(Array.isArray(hoverIndecisionResponse?.items) ? hoverIndecisionResponse.items : []);
		} catch (err) {
			console.error("Admin analytics fetch failed:", err);
			setError("Failed to fetch analytics data");
		} finally {
			setLoading(false);
		}
	}, [selectedUserId, selectedTimeWindow]);

	useEffect(() => {
		fetchAnalytics();
	}, [fetchAnalytics]);

	const handleUserSelect = useCallback((userId) => {
		setSelectedUserId(userId);
	}, []);

	const handleTimeWindowChange = useCallback((windowMs) => {
		setSelectedTimeWindow(windowMs);
	}, []);

	// Computed values for decision insights
	const getAnalyticsSummary = useCallback(() => {
		if (tabBlurData.length === 0) {
			return {
				totalTabBlurs: 0,
				mostDisengagingQuestion: null,
				averageBlurRate: 0,
				hintEffectivenessRate: 0,
				cognitiveOverloadIndicators: [],
				engagementPattern: "no_data",
			};
		}

		const totalTabBlurs = tabBlurData.reduce((sum, item) => sum + item.tabBlurCount, 0);
		const mostDisengagingQuestion = tabBlurData.reduce((max, item) => (item.tabBlurCount > max.tabBlurCount ? item : max), tabBlurData[0]);

		const averageBlurRate = totalTabBlurs / tabBlurData.length;

		const hintEffectivenessRate = hintBlurData.length > 0 ? hintBlurData.filter((item) => item.blurAfterHintRatio < 0.5).length / hintBlurData.length : 0;

		// Cognitive overload indicators
		const cognitiveOverloadIndicators = [];

		// High tab blur + high error rate
		if (correlationData.length === 2) {
			const withBlurErrorRate = correlationData[0].errorRate;
			const withoutBlurErrorRate = correlationData[1].errorRate;

			if (withBlurErrorRate > 70 && withBlurErrorRate > withoutBlurErrorRate * 1.5) {
				cognitiveOverloadIndicators.push("high_error_with_disengagement");
			}
		}

		// High blur after hint usage
		const highBlurAfterHint = hintBlurData.filter((item) => item.blurAfterHintRatio > 0.7);
		if (highBlurAfterHint.length > 0) {
			cognitiveOverloadIndicators.push("hint_ineffectiveness");
		}

		// Consistently high tab blur across questions
		const highBlurQuestions = tabBlurData.filter((item) => item.tabBlurCount > 5);
		if (highBlurQuestions.length > tabBlurData.length * 0.5) {
			cognitiveOverloadIndicators.push("persistent_disengagement");
		}

		// Engagement pattern classification
		let engagementPattern = "normal";
		if (averageBlurRate > 7) {
			engagementPattern = "high_disengagement";
		} else if (averageBlurRate < 2 && hintEffectivenessRate > 0.8) {
			engagementPattern = "high_engagement";
		} else if (cognitiveOverloadIndicators.length > 0) {
			engagementPattern = "cognitive_overload";
		}

		return {
			totalTabBlurs,
			mostDisengagingQuestion,
			averageBlurRate,
			hintEffectivenessRate,
			cognitiveOverloadIndicators,
			engagementPattern,
		};
	}, [tabBlurData, hintBlurData, correlationData]);

	return {
		selectedUserId,
		tabBlurData,
		hintBlurData,
		correlationData,
		hoverHesitationData,
		hoverIndecisionData,
		loading,
		error,
		selectedTimeWindow,

		handleUserSelect,
		handleTimeWindowChange,
		setSelectedTimeWindow,
		refetch: fetchAnalytics,

		analyticsSummary: getAnalyticsSummary(),
		isUserSpecific: !!selectedUserId,
	};
}
