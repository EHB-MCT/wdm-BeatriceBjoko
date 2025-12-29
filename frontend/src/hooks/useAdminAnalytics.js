import { useEffect, useState, useCallback } from "react";
import { analyticsService } from "../services/analyticsService";

export function useAdminAnalytics() {
	const [tabBlurData, setTabBlurData] = useState([]);
	const [hintBlurData, setHintBlurData] = useState([]);
	const [correlationData, setCorrelationData] = useState([]);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [selectedTimeWindow, setSelectedTimeWindow] = useState(30000);

	const fetchAnalytics = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const [tabBlurResponse, hintBlurResponse, correlationResponse] = await Promise.all([analyticsService.getTabBlurByQuestion(), analyticsService.getTabBlurAfterHint(selectedTimeWindow), analyticsService.getTabBlurVsAnswerError(15000)]);

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
		} catch (err) {
			console.error("Admin analytics fetch failed:", err);
			setError("Failed to fetch analytics data");
		} finally {
			setLoading(false);
		}
	}, [selectedTimeWindow]);

	useEffect(() => {
		fetchAnalytics();
	}, [fetchAnalytics]);

	return {
		tabBlurData,
		hintBlurData,
		correlationData,

		loading,
		error,

		selectedTimeWindow,
		setSelectedTimeWindow,
		refetch: fetchAnalytics,
	};
}
