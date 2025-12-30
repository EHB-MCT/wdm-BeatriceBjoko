import { AnalyticsRepository } from "../repositories/analyticsRepository.js";
import { TIME_WINDOWS, DATA_THRESHOLDS } from "../config/analyticsThresholds.js";

/**
 * Analytics Service - Handles business logic for analytics calculations
 * Transforms raw data into meaningful insights without database operations
 */
export class AnalyticsService {
	/**
	 * Get tab blur analytics by question
	 * @param {string|null} userId - Optional user ID to filter by
	 * @returns {Promise<Object>} Tab blur analytics data
	 */
	static async getTabBlurByQuestionAnalytics(userId = null) {
		try {
			const items = await AnalyticsRepository.getTabBlurByQuestion(userId);

			return {
				totalQuestions: items.length,
				items: this._validateAndCleanTabBlurData(items),
			};
		} catch (error) {
			throw new Error(`Failed to get tab blur analytics: ${error.message}`);
		}
	}

	/**
	 * Get hint effectiveness analytics
	 * @param {number} windowMs - Time window in milliseconds
	 * @param {string|null} userId - Optional user ID to filter by
	 * @returns {Promise<Object>} Hint effectiveness analytics data
	 */
	static async getTabBlurAfterHintAnalytics(windowMs = null, userId = null) {
		try {
			const validatedWindowMs = this._validateTimeWindow(windowMs, TIME_WINDOWS.DEFAULT_HINT_WINDOW, TIME_WINDOWS.MAX_HINT_WINDOW);

			const items = await AnalyticsRepository.getTabBlurAfterHint(validatedWindowMs, userId);

			return {
				windowMs: validatedWindowMs,
				totalQuestions: items.length,
				items: this._validateAndCleanHintData(items),
			};
		} catch (error) {
			throw new Error(`Failed to get hint effectiveness analytics: ${error.message}`);
		}
	}

	/**
	 * Get correlation between tab blur and answer errors
	 * @param {number} windowMs - Time window in milliseconds
	 * @param {string|null} userId - Optional user ID to filter by
	 * @returns {Promise<Object>} Correlation analytics data
	 */
	static async getTabBlurVsAnswerErrorAnalytics(windowMs = null, userId = null) {
		try {
			const validatedWindowMs = this._validateTimeWindow(windowMs, TIME_WINDOWS.DEFAULT_TAB_BLUR_WINDOW, TIME_WINDOWS.MAX_TAB_BLUR_WINDOW);

			const results = await AnalyticsRepository.getTabBlurVsAnswerError(validatedWindowMs, userId);
			const processedResults = this._processCorrelationData(results);

			return {
				windowMs: validatedWindowMs,
				...processedResults,
			};
		} catch (error) {
			throw new Error(`Failed to get tab blur vs answer error analytics: ${error.message}`);
		}
	}

	/**
	 * Get hover hesitation analytics by question
	 * @param {string|null} userId - Optional user ID to filter by
	 * @returns {Promise<Object>} Hover hesitation analytics data
	 */
	static async getHoverHesitationByQuestionAnalytics(userId = null) {
		try {
			const items = await AnalyticsRepository.getHoverHesitationByQuestion(userId);

			return {
				totalQuestions: items.length,
				items: this._validateAndCleanHoverHesitationData(items),
			};
		} catch (error) {
			throw new Error(`Failed to get hover hesitation analytics: ${error.message}`);
		}
	}

	/**
	 * Get hover indecision analytics by question
	 * @param {string|null} userId - Optional user ID to filter by
	 * @returns {Promise<Object>} Hover indecision analytics data
	 */
	static async getHoverIndecisionByQuestionAnalytics(userId = null) {
		try {
			const items = await AnalyticsRepository.getHoverIndecisionByQuestion(userId);

			return {
				totalQuestions: items.length,
				items: this._validateAndCleanHoverIndecisionData(items),
			};
		} catch (error) {
			throw new Error(`Failed to get hover indecision analytics: ${error.message}`);
		}
	}

	/**
	 * Get comprehensive analytics summary
	 * @param {string|null} userId - Optional user ID to filter by
	 * @returns {Promise<Object>} Comprehensive analytics summary
	 */
	static async getComprehensiveAnalyticsSummary(userId = null) {
		try {
			const [tabBlurData, hintBlurData, correlationData, hoverHesitationData, hoverIndecisionData] = await Promise.all([
				this.getTabBlurByQuestionAnalytics(userId),
				this.getTabBlurAfterHintAnalytics(TIME_WINDOWS.DEFAULT_HINT_WINDOW, userId),
				this.getTabBlurVsAnswerErrorAnalytics(TIME_WINDOWS.DEFAULT_TAB_BLUR_WINDOW, userId),
				this.getHoverHesitationByQuestionAnalytics(userId),
				this.getHoverIndecisionByQuestionAnalytics(userId),
			]);

			return {
				tabBlur: tabBlurData,
				hintEffectiveness: hintBlurData,
				correlation: correlationData,
				hoverHesitation: hoverHesitationData,
				hoverIndecision: hoverIndecisionData,
				generatedAt: new Date().toISOString(),
			};
		} catch (error) {
			throw new Error(`Failed to get comprehensive analytics: ${error.message}`);
		}
	}

	/**
	 * Private: Validate time window parameter
	 */
	static _validateTimeWindow(windowMs, defaultWindow, maxWindow) {
		if (!Number.isFinite(windowMs) || windowMs <= 0) {
			return defaultWindow;
		}
		return Math.min(Math.floor(windowMs), maxWindow);
	}

	/**
	 * Private: Validate and clean tab blur data
	 */
	static _validateAndCleanTabBlurData(items) {
		return items
			.filter((item) => item.questionId !== undefined && item.tabBlurCount >= 0 && item.uniqueUserCount >= 0)
			.map((item) => ({
				questionId: item.questionId,
				tabBlurCount: Math.max(0, item.tabBlurCount),
				uniqueUserCount: Math.max(0, item.uniqueUserCount),
			}));
	}

	/**
	 * Private: Validate and clean hint data
	 */
	static _validateAndCleanHintData(items) {
		return items
			.filter(
				(item) => item.questionId !== undefined && item.hintCount >= 0 && item.tabBlurAfterHintCount >= 0 && item.hintCount > 0 // Only include questions with hints
			)
			.map((item) => ({
				questionId: item.questionId,
				hintCount: Math.max(0, item.hintCount),
				tabBlurAfterHintCount: Math.max(0, item.tabBlurAfterHintCount),
				uniqueUserCount: Math.max(0, item.uniqueUserCount),
				blurAfterHintRatio: Math.max(0, Math.min(1, item.blurAfterHintRatio)),
			}));
	}

	/**
	 * Private: Process correlation data into with/without blur format
	 */
	static _processCorrelationData(results) {
		const withBlur = results.find((r) => r._id === true) || {
			totalAnswers: 0,
			errors: 0,
		};
		const withoutBlur = results.find((r) => r._id === false) || {
			totalAnswers: 0,
			errors: 0,
		};

		return {
			withBlur: {
				answers: Math.max(0, withBlur.totalAnswers),
				errors: Math.max(0, withBlur.errors),
				errorRate: withBlur.totalAnswers > 0 ? withBlur.errors / withBlur.totalAnswers : 0,
			},
			withoutBlur: {
				answers: Math.max(0, withoutBlur.totalAnswers),
				errors: Math.max(0, withoutBlur.errors),
				errorRate: withoutBlur.totalAnswers > 0 ? withoutBlur.errors / withoutBlur.totalAnswers : 0,
			},
		};
	}

	/**
	 * Private: Validate and clean hover hesitation data
	 */
	static _validateAndCleanHoverHesitationData(items) {
		return items
			.filter((item) => item.questionId !== undefined && item.totalHoverIntents >= 0 && item.avgIntentDelayMs >= DATA_THRESHOLDS.MIN_EVENT_DELAY_MS && item.avgIntentDelayMs <= DATA_THRESHOLDS.MAX_REASONABLE_HESITATION_MS)
			.map((item) => ({
				questionId: item.questionId,
				totalHoverIntents: Math.max(0, item.totalHoverIntents),
				avgIntentDelayMs: Math.round(Math.max(0, item.avgIntentDelayMs) * 100) / 100,
				medianIntentDelayMs: Math.round(Math.max(0, item.medianIntentDelayMs) * 100) / 100,
				maxIntentDelayMs: Math.max(0, item.maxIntentDelayMs),
				minIntentDelayMs: Math.max(0, item.minIntentDelayMs),
				uniqueUserCount: Math.max(0, item.uniqueUserCount),
			}))
			.sort((a, b) => b.avgIntentDelayMs - a.avgIntentDelayMs);
	}

	/**
	 * Private: Validate and clean hover indecision data
	 */
	static _validateAndCleanHoverIndecisionData(items) {
		return items
			.filter((item) => item.questionId !== undefined && item.totalSwitches >= 0 && item.totalIntents >= 0 && item.avgSwitchesPerSession <= DATA_THRESHOLDS.MAX_REASONABLE_SWITCH_COUNT)
			.map((item) => ({
				questionId: item.questionId,
				totalSwitches: Math.max(0, item.totalSwitches),
				totalIntents: Math.max(0, item.totalIntents),
				uniqueSessions: Math.max(0, item.uniqueSessions),
				avgSwitchesPerSession: Math.round(Math.max(0, item.avgSwitchesPerSession) * 100) / 100,
				indecisionRatio: Math.round(Math.max(0, Math.min(1, item.indecisionRatio)) * 100) / 100,
			}))
			.sort((a, b) => b.indecisionRatio - a.indecisionRatio);
	}
}

export default AnalyticsService;
