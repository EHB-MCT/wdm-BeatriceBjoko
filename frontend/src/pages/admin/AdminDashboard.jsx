import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminNav from "../../components/admin/AdminNav";
import "./AdminDashboard.css";

export default function AdminDashboard() {
	const { user } = useAuth();

	return (
		<div className="admin-page">
			<AdminNav />

			<div className="admin-header">
				<h1 className="admin-title">Admin Dashboard</h1>
				<p className="admin-subtitle">Welcome back, {user?.email}</p>
			</div>

			<div className="admin-content">
				<div className="admin-cards">
					<div className="admin-card">
						<h3>Analytics</h3>
						<p>View user statistics and quiz performance</p>
						<Link to="/admin/analytics" className="btn btn-primary">
							View Analytics
						</Link>
					</div>

					<div className="admin-card">
						<h3>User Management</h3>
						<p>Manage user accounts and permissions</p>
						<button className="btn btn-secondary" disabled>
							Coming Soon
						</button>
					</div>

					<div className="admin-card">
						<h3>Quiz Settings</h3>
						<p>Configure quiz questions and settings</p>
						<button className="btn btn-secondary" disabled>
							Coming Soon
						</button>
					</div>
				</div>

				<div className="admin-info">
					<div className="info-card">
						<h4>Admin Information</h4>
						<p>
							<strong>User ID:</strong> {user?.id}
						</p>
						<p>
							<strong>Email:</strong> {user?.email}
						</p>
						<p>
							<strong>Role:</strong> {user?.role}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
