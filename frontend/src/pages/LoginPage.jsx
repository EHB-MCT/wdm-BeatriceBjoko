import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./LoginPage.css";

export default function LoginPage() {
	const { login, signup } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	async function handleLogin(e) {
		e.preventDefault();
		setError("");
		try {
			await login(email, password);
		} catch (err) {
			setError(err.message || "Login failed");
		}
	}

	async function handleSignup(e) {
		e.preventDefault();
		setError("");
		try {
			await signup(email, password);
		} catch (err) {
			setError(err.message || "Signup failed");
		}
	}

	return (
		<div className="login-page">
			<div className="login-image" />
			<div className="login-form-wrapper">
				<div className="login-card">
					<h1 className="login-title">Login</h1>

					<form className="login-form">
						<div className="input-group">
							<label>Email</label>
							<input type="email" value={email} placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
						</div>

						<div className="input-group">
							<label>Password</label>
							<input type="password" value={password} placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
						</div>

						{error && <p className="login-error">{error}</p>}

						<button onClick={handleLogin} className="btn-primary">
							Login
						</button>

						<button type="button" onClick={handleSignup} className="btn-secondary">
							Create new account
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
