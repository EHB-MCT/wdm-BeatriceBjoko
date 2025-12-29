import { useState, useEffect } from "react";
import { apiClient } from "../../services/apiClient";
import "./UserSelector.css";

const UserSelector = ({ selectedUserId, onUserSelect, disabled = false }) => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await apiClient.get("/admin/users");
			setUsers(response.items || []);
		} catch (err) {
			setError("Failed to fetch users");
			console.error("User fetch error:", err);
		} finally {
			setLoading(false);
		}
	};

	const formatDate = (dateString) => {
		if (!dateString) return "Never";
		return new Date(dateString).toLocaleDateString();
	};

	const getRoleBadgeColor = (role) => {
		return role === "admin" ? "admin-badge" : "user-badge";
	};

	if (loading) {
		return (
			<div className="user-selector loading">
				<div className="loading-spinner">Loading users...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="user-selector error">
				<div className="error-message">{error}</div>
				<button onClick={fetchUsers} className="retry-button">
					Retry
				</button>
			</div>
		);
	}

	return (
		<div className="user-selector">
			<label htmlFor="user-select" className="selector-label">
				Select User:
			</label>
			<select id="user-select" value={selectedUserId || ""} onChange={(e) => onUserSelect(e.target.value || null)} disabled={disabled} className="user-select-dropdown">
				<option value="">All Users (Global Analytics)</option>
				{users.map((user) => (
					<option key={user._id} value={user._id}>
						{user.email} - {user.role}
					</option>
				))}
			</select>

			{selectedUserId && (
				<div className="selected-user-info">
					{(() => {
						const selectedUser = users.find((u) => u._id === selectedUserId);
						if (!selectedUser) return null;

						return (
							<div className="user-details">
								<div className="user-header">
									<span className="user-email">{selectedUser.email}</span>
									<span className={`role-badge ${getRoleBadgeColor(selectedUser.role)}`}>{selectedUser.role}</span>
								</div>
								<div className="user-meta">
									<span className="user-date">Created: {formatDate(selectedUser.createdAt)}</span>
									{selectedUser.lastLogin && <span className="user-date">Last Login: {formatDate(selectedUser.lastLogin)}</span>}
								</div>
							</div>
						);
					})()}
				</div>
			)}
		</div>
	);
};

export default UserSelector;
