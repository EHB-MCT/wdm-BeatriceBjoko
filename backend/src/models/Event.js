import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		sessionId: {
			type: String,
			required: true,
			index: true,
		},
		type: {
			type: String,
			required: true,
			enum: ["session_start", "session_end", "question_view", "question_answer", "answer_hover_intent", "answer_hover_switch", "answer_hover_end", "hint_used", "question_skip", "tab_blur", "rage_click"],
		},
		payload: {
			questionId: String,
			answerId: String,
			correct: Boolean,
			responseTimeMs: Number,
			intentDelayMs: Number,
			timeSinceLastHoverIntentMs: Number,
			lastHoverAnswerId: String,
			fromAnswerId: String,
			toAnswerId: String,
			timestamp: Number,
			durationMs: Number,
			completed: Boolean,
			reason: String,
			hintUsed: Boolean,
			retries: Number,
			selectedAnswer: String,
		},
		meta: {
			device: String,
			language: String,
			screenWidth: Number,
			timezone: String,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("Event", eventSchema);
