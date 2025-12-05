import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
	const { login } = useAuth();
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

	return (
		<div className="login-page">
			<div className="login-image" />

			<div className="login-form-wrapper">
				<div className="login-card card">
					<h1 className="login-title">Login</h1>

					<form className="login-form" onSubmit={handleLogin}>
						<div className="input-group">
							<label>Email</label>
							<input className="input" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
						</div>

						<div className="input-group">
							<label>Password</label>
							<input className="input" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
						</div>

						{error && <p className="login-error">{error}</p>}

						<button type="submit" className="btn btn-primary">
							Login
						</button>

						<Link to="/signup" className="btn btn-secondary">
							Create new account
						</Link>
					</form>
				</div>
			</div>
		</div>
	);
}
