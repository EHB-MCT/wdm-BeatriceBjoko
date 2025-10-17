import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(express.json());

// Connectie met MongoDB

mongoose
	.connect("mongodb://mongo:27017/quizapp", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("✅ Connected to MongoDB"))
	.catch((err) => console.error("❌ MongoDB connection error:", err));

// Test route
app.get("/", (req, res) => {
	res.send(" Backend is running and connected to MongoDB");
});

import Answer from "./models/Answer.js";

// Route om een antwoord op te slaan
app.post("/api/answer", async (req, res) => {
	try {
		const { questionId, isCorrect, responseTime } = req.body;

		// Basis validatie
		if (!questionId || responseTime === undefined) return res.status(400).json({ message: "Missing fields" });

		// Nieuw antwoord aanmaken
		const newAnswer = new Answer({ questionId, isCorrect, responseTime });
		await newAnswer.save();

		res.status(201).json({ message: "Answer saved!", data: newAnswer });
	} catch (err) {
		console.error(" Error saving answer:", err);
		res.status(500).json({ message: "Server error" });
	}
});

app.listen(5000, "0.0.0.0", () => console.log(" Server running on port 5000"));
