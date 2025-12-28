import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import { SessionInfluenceProvider } from "./context/SessionInfluenceContext";

export default function App() {
	return (
		<AuthProvider>
			<SessionInfluenceProvider>
				<AppRoutes />
			</SessionInfluenceProvider>
		</AuthProvider>
	);
}
