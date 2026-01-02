import mongoose from "mongoose";

export async function connectDB() {
	const uri = "mongodb://mongo:27017/quizapp";

	try {
		await mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		console.log("Connected to MongoDB");
	} catch (err) {
		console.error("MongoDB connection error:", err);
		process.exit(1);
	}
}
