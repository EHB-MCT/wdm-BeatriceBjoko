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
		<div className="login-container">
			<div className="login-form-wrapper">
				<div className="login-card">
					<h1 className="login-title">Login</h1>

					<form className="login-form">
						<input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

						<input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

						{error && <p className="login-error">{error}</p>}

						<button onClick={handleLogin}>Login</button>

						<button type="button" onClick={handleSignup}>
							Create new account
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
