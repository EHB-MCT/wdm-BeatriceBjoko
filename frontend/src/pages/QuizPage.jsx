import { useAuth } from "../context/AuthContext";
import { apiClient } from "../services/apiClient";

async function sendTestEvent() {
	try {
		await apiClient.post("/events", {
			type: "view",
			metadata: { page: "quiz", time: Date.now() },
		});
		alert("Test event sent!");
	} catch (err) {
		console.error(err);
		alert("Failed to send event");
	}
}

export default function QuizPage() {
	const { user, logout } = useAuth();

	return (
		<div className="page-container">
			<h1 className="page-title">Quiz Page</h1>
			<p className="page-subtitle">Welkom, {user?.email}</p>

			<button className="btn btn-primary" onClick={sendTestEvent}>
				Send Test Tracking Event
			</button>

			<hr className="section-divider" />

			<button className="btn btn-secondary" onClick={logout}>
				Log out
			</button>
		</div>
	);
}
