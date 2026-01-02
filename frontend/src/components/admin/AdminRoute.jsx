import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminRoute({ children }) {
	const { user, loading, isAuthenticated } = useAuth();

	if (loading) {
		return <div className="loading-page">Loading...</div>;
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	if (user?.role !== "admin") {
		return <Navigate to="/quiz" replace />;
	}

	return children;
}
