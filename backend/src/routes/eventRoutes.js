import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { saveEvent, getMyEvents } from "../controllers/eventController.js";

const router = express.Router();

router.post("/", protect, saveEvent);
router.get("/me", protect, getMyEvents);

export default router;
