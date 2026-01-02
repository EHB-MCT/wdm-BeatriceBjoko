import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { getUsers, getUserById, getEvents, getUserSessions } from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, requireAdmin);

router.get("/users", getUsers);
router.get("/users/:id", getUserById);

router.get("/events", getEvents);

router.get("/users/:id/sessions", getUserSessions);

export default router;
