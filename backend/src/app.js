import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import answerRoutes from "./routes/answerRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: "http://localhost:8080",
		credentials: true,
	})
);

app.get("/", (req, res) => {
	res.send("Backend is running and connected to MongoDB (if server started ok).");
});

app.use("/api/auth", authRoutes);

app.use("/api/answers", answerRoutes);

app.use((req, res, next) => {
	res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

export default app;
