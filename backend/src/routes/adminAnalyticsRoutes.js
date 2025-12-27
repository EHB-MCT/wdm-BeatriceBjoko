import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { getTabBlurByQuestion } from "../controllers/adminAnalyticsController.js";

const router = express.Router();

router.get("/tab-blur-by-question", protect, requireAdmin, getTabBlurByQuestion);

export default router;
