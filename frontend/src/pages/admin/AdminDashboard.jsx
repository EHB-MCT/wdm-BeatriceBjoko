import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminNav from "../../components/admin/AdminNav";
import Button from "../../components/ui/Button/Button";
import Card from "../../components/ui/Card/Card";
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
					<Card variant="admin" hoverable>
						<h3>Analytics</h3>
						<p>View user statistics and quiz performance</p>
						<Link to="/admin/analytics" className="ui-btn ui-btn--primary">
							View Analytics
						</Link>
					</Card>

					<Card variant="admin" hoverable>
						<h3>User Management</h3>
						<p>Manage user accounts and permissions</p>
						<Button variant="secondary" disabled>
							Coming Soon
						</Button>
					</Card>

					<Card variant="admin" hoverable>
						<h3>Quiz Settings</h3>
						<p>Configure quiz questions and settings</p>
						<Button variant="secondary" disabled>
							Coming Soon
						</Button>
					</Card>
				</div>

				<div className="admin-info">
					<Card variant="info">
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
					</Card>
				</div>
			</div>
		</div>
	);
}
