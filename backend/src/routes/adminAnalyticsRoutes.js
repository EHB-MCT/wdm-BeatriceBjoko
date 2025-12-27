import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { getTabBlurByQuestion, getTabBlurAfterHint } from "../controllers/adminAnalyticsController.js";

const router = express.Router();

router.get("/tab-blur-by-question", protect, requireAdmin, getTabBlurByQuestion);

router.get("/tab-blur-after-hint", protect, requireAdmin, getTabBlurAfterHint);

export default router;
