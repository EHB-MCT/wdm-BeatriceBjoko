import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createEvent } from "../controllers/eventController.js";

const router = express.Router();

router.post("/", protect, createEvent);

export default router;
