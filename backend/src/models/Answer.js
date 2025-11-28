import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
	questionId: { type: String, required: true },
	isCorrect: { type: Boolean, required: true },
	responseTime: { type: Number, required: true },
	createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Answer", answerSchema);
