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
			enum: ["session_start", "session_end", "session_ping", "question_view", "question_answer", "hint_used", "question_skip", "tab_blur", "rage_click"],
		},
		payload: {
			questionId: String,
			answerId: String,
			correct: Boolean,
			responseTimeMs: Number,
			durationMs: Number,
			completed: Boolean,
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
