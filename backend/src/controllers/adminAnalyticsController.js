import { AnalyticsService } from "../services/analyticsService.js";

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

export async function getComprehensiveAnalytics(req, res, next) {
	try {
		const { userId } = req.query;
		const result = await AnalyticsService.getComprehensiveAnalyticsSummary(userId);
		res.json(result);
	} catch (err) {
		next(err);
	}
}
