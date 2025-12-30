/**
 * Analytics thresholds and configuration constants
 * Centralized configuration for analytics calculations and limits
 */

// Time windows for analytics calculations (in milliseconds)
export const TIME_WINDOWS = {
	DEFAULT_HINT_WINDOW: 30_000,
	MAX_HINT_WINDOW: 5 * 60_000,
	DEFAULT_TAB_BLUR_WINDOW: 15_000,
	MAX_TAB_BLUR_WINDOW: 60_000,
};

// Pagination limits
export const PAGINATION = {
	DEFAULT_PAGE: 1,
	DEFAULT_LIMIT: 25,
	MAX_LIMIT: 100,
	MIN_LIMIT: 1,
	DEFAULT_ANALYTICS_LIMIT: 50,
	MAX_ANALYTICS_LIMIT: 200,
};

// Data quality and validation thresholds
export const DATA_THRESHOLDS = {
	MIN_EVENT_DELAY_MS: 0,
	MAX_REASONABLE_HESITATION_MS: 30_000,
	MAX_REASONABLE_SWITCH_COUNT: 50,
};

// Analytics interpretation thresholds
export const ANALYTICS_THRESHOLDS = {
	HIGH_ERROR_RATE: 70,
	ERROR_RATE_MULTIPLIER: 1.5,
	HIGH_BLUR_RATE: 7,
	LOW_BLUR_RATE: 2,
	HIGH_BLUR_AFTER_HINT: 0.7,
	HINT_EFFECTIVENESS_THRESHOLD: 0.8,
	HIGH_ENGAGEMENT_BLUR_QUESTIONS: 5,
	HIGH_ENGAGEMENT_BLUR_PERCENTAGE: 0.5,

	// Hover hesitation thresholds
	HIGH_HESITATION_MS: 2000,
	MEDIUM_HESITATION_MS: 1000,

	// Hover indecision thresholds
	HIGH_INDECISION_RATIO: 0.5,
	MEDIUM_INDECISION_RATIO: 0.3,
	LOW_INDECISION_RATIO: 0.3,
};

// Event types used in analytics
export const EVENT_TYPES = {
	TAB_BLUR: "tab_blur",
	HINT_USED: "hint_used",
	QUESTION_ANSWER: "question_answer",
	ANSWER_HOVER_INTENT: "answer_hover_intent",
	ANSWER_HOVER_SWITCH: "answer_hover_switch",
	ANSWER_HOVER_END: "answer_hover_end",
};

// Data aggregation configurations
export const AGGREGATION_CONFIG = {
	DEFAULT_SORT: { createdAt: -1 },
	QUESTION_SORT: { questionId: 1 },
	RATE_SORT: { rate: -1 },
	COUNT_SORT: { count: -1 },
	MAX_CHART_ITEMS: 10,
	MAX_ANALYSIS_ITEMS: 100,
};

// Export default configuration for convenience
export default {
	TIME_WINDOWS,
	PAGINATION,
	DATA_THRESHOLDS,
	ANALYTICS_THRESHOLDS,
	EVENT_TYPES,
	AGGREGATION_CONFIG,
};
