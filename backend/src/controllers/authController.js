import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const signup = async (req, res, next) => {
	try {
		const { email, password, deviceMetadata } = req.body;

		if (!email || !password) {
			return res.status(400).json({ message: "Email and password are required" });
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(409).json({ message: "User already exists" });
		}

		const newUser = await User.create({
			email,
			password,
			role: "user",
			deviceMetadata,
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

export const login = async (req, res, next) => {
	try {
		const { email, password, deviceMetadata } = req.body;

		if (!email || !password) {
			return res.status(400).json({ message: "Email and password are required" });
		}

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const isMatch = await user.matchPassword(password);

		if (!isMatch) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		// JWT payload
		const tokenPayload = {
			id: user._id,
			role: user.role,
		};

		// create JWT
		const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRES_IN,
		});

		// set up httpOnly cookie
		res.cookie("token", token, {
			httpOnly: true,
			secure: false,
			sameSite: "lax",
			maxAge: 3600000,
		});

		user.lastLogin = new Date();
		if (deviceMetadata) {
			user.deviceMetadata = deviceMetadata;
		}
		await user.save();

		res.status(200).json({
			message: "Login successful",
			user: {
				id: user._id,
				email: user.email,
				role: user.role,
			},
		});
	} catch (err) {
		next(err);
	}
};
