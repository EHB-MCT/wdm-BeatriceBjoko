import express from "express";
import { signup, login } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/me", protect, (req, res) => {
	return res.json({
		message: "Authenticated user",
		user: req.user,
	});
});

router.post("/logout", (req, res) => {
	res.clearCookie("token", {
		httpOnly: true,
		secure: false,
		sameSite: "lax",
	});
	return res.json({ message: "Logged out successfully" });
});

export default router;
