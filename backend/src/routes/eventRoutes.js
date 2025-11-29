import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { saveEvent } from "../controllers/eventController.js";

const router = express.Router();

router.post("/", protect, saveEvent);

export default router;
