import { AnalyticsService } from "../services/analyticsService.js";

/**
 * Admin Analytics Controller - Thin HTTP layer
 * Handles HTTP requests/responses only
 * All business logic and database operations are delegated to service and repository layers
 */

export const getTabBlurByQuestion = async (req, res, next) => {
	try {
		const { userId } = req.query;
		const result = await AnalyticsService.getTabBlurByQuestionAnalytics(userId);
		res.json(result);
	} catch (err) {
		next(err);
	}
};

export async function getTabBlurAfterHint(req, res, next) {
	try {
		const { userId, windowMs } = req.query;
		const result = await AnalyticsService.getTabBlurAfterHintAnalytics(Number(windowMs), userId);
		res.json(result);
	} catch (err) {
		next(err);
	}
}

export async function getTabBlurVsAnswerError(req, res, next) {
	try {
		const { userId, windowMs } = req.query;
		const result = await AnalyticsService.getTabBlurVsAnswerErrorAnalytics(Number(windowMs), userId);
		res.json(result);
	} catch (err) {
		next(err);
	}
}

export async function getHoverHesitationByQuestion(req, res, next) {
	try {
		const { userId } = req.query;
		const result = await AnalyticsService.getHoverHesitationByQuestionAnalytics(userId);
		res.json(result);
	} catch (err) {
		next(err);
	}
}

export async function getHoverIndecisionByQuestion(req, res, next) {
	try {
		const { userId } = req.query;
		const result = await AnalyticsService.getHoverIndecisionByQuestionAnalytics(userId);
		res.json(result);
	} catch (err) {
		next(err);
	}
}

/**
 * Get comprehensive analytics summary
 * Aggregates all analytics data in a single endpoint
 */
export async function getComprehensiveAnalytics(req, res, next) {
	try {
		const { userId } = req.query;
		const result = await AnalyticsService.getComprehensiveAnalyticsSummary(userId);
		res.json(result);
	} catch (err) {
		next(err);
	}
}