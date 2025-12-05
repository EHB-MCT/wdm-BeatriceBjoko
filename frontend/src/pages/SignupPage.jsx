import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "./SignupPage.css";

export default function SignupPage() {
	const { signup } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [error, setError] = useState("");

	async function handleSignup(e) {
		e.preventDefault();
		setError("");

		if (password !== confirm) {
			setError("Passwords do not match");
			return;
		}

		try {
			await signup(email, password);
		} catch (err) {
			setError(err.message || "Signup failed");
		}
	}

	return (
		<div className="signup-page">
			<div className="signup-form-wrapper">
				<div className="signup-card card">
					<h1 className="signup-title">Create Account</h1>

					<form className="signup-form" onSubmit={handleSignup}>
						<div className="input-group">
							<label>Email</label>
							<input className="input" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
						</div>

						<div className="input-group">
							<label>Password</label>
							<input className="input" type="password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} required />
						</div>

						<div className="input-group">
							<label>Confirm Password</label>
							<input className="input" type="password" placeholder="Repeat password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
						</div>

						{error && <p className="signup-error">{error}</p>}

						<button type="submit" className="btn btn-primary">
							Create Account
						</button>

						<Link to="/login" className="btn btn-secondary">
							Already have an account
						</Link>
					</form>
				</div>
			</div>
		</div>
	);
}
