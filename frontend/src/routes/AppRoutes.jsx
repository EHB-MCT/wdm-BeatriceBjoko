import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginPage from "../pages/LoginPage";
import QuizPage from "../pages/QuizPage";
import SignupPage from "../pages/SignupPage";

export default function AppRoutes() {
	const { isAuthenticated, loading } = useAuth();

	// Wachten tot AuthContext /auth/me heeft gecheckt*/}
	if (loading) {
		return <p>Loading...</p>;
	}

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={isAuthenticated ? <Navigate to="/quiz" /> : <Navigate to="/login" />} />

				<Route path="/login" element={isAuthenticated ? <Navigate to="/quiz" /> : <LoginPage />} />

				<Route path="/quiz" element={isAuthenticated ? <QuizPage /> : <Navigate to="/login" />} />

				<Route path="/signup" element={isAuthenticated ? <Navigate to="/quiz" /> : <SignupPage />} />

				{/* Fallback */}
				<Route path="*" element={<h2>404 Page not found</h2>} />
			</Routes>
		</BrowserRouter>
	);
}
