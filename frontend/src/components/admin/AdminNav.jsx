import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminNav() {
	const { user, logout } = useAuth();
	const location = useLocation();

	const isActive = (path) => location.pathname === path;

	return (
		<nav className="admin-nav">
			<div className="admin-nav-container">
				<div className="admin-nav-brand">
					<Link to="/admin">Admin Panel</Link>
				</div>

				<div className="admin-nav-menu">
					<Link to="/admin" className={`admin-nav-link ${isActive("/admin") || isActive("/admin/dashboard") ? "active" : ""}`}>
						Dashboard
					</Link>
				</div>

				<div className="admin-nav-user">
					<span className="admin-user-email">{user?.email}</span>
					<button onClick={logout} className="btn btn-secondary admin-logout-btn">
						Logout
					</button>
				</div>
			</div>
		</nav>
	);
}
