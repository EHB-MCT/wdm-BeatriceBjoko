import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { getTabBlurByQuestion, getTabBlurAfterHint, getTabBlurVsAnswerError, getHoverHesitationByQuestion, getHoverIndecisionByQuestion, getComprehensiveAnalytics } from "../controllers/adminAnalyticsController.js";

const router = express.Router();

router.get("/tab-blur-by-question", protect, requireAdmin, getTabBlurByQuestion);

router.get("/tab-blur-after-hint", protect, requireAdmin, getTabBlurAfterHint);

router.get("/tab-blur-vs-answer-error", protect, requireAdmin, getTabBlurVsAnswerError);

router.get("/hover-hesitation-by-question", protect, requireAdmin, getHoverHesitationByQuestion);

router.get("/hover-indecision-by-question", protect, requireAdmin, getHoverIndecisionByQuestion);

router.get("/comprehensive", protect, requireAdmin, getComprehensiveAnalytics);

export default router;
