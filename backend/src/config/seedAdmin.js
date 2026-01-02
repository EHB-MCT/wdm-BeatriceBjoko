import User from "../models/User.js";

export async function seedAdmin() {
	const adminEmail = process.env.ADMIN_EMAIL;
	const adminPassword = process.env.ADMIN_PASSWORD;

	if (!adminEmail || !adminPassword) {
		console.warn("seedAdmin skipped: ADMIN_EMAIL / ADMIN_PASSWORD not set");
		return;
	}

	const existing = await User.findOne({ email: adminEmail });

	if (existing) {
		if (existing.role !== "admin") {
			existing.role = "admin";
			await existing.save();
			console.log(`Admin role updated for ${adminEmail}`);
		}
		return;
	}

	await User.create({
		email: adminEmail,
		password: adminPassword,
		role: "admin",
	});

	console.log(`Admin seeded: ${adminEmail}`);
}
