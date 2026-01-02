import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
	const token = req.cookies?.token;

	if (!token) {
		return res.status(401).json({ message: "Not authenticated" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		req.user = {
			id: decoded.id,
			role: decoded.role,
		};

		next();
	} catch (err) {
		console.error("JWT verification failed:", err);
		return res.status(401).json({ message: "Invalid or expired token" });
	}
};
