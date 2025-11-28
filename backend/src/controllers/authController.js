import bcrypt from "bcrypt";
import User from "../models/User.js";

export const signup = async (req, res, next) => {
	try {
		const { email, password, role } = req.body;

		if (!email || !password) {
			return res.status(400).json({ message: "Email and password are required" });
		}

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return res.status(409).json({ message: "User already exists" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await User.create({
			email,
			password: hashedPassword,
			role: role || "user",
		});

		const safeUser = {
			id: newUser._id,
			email: newUser.email,
			role: newUser.role,
			createdAt: newUser.createdAt,
		};

		res.status(201).json({
			message: "User created successfully",
			user: safeUser,
		});
	} catch (err) {
		next(err);
	}
};
