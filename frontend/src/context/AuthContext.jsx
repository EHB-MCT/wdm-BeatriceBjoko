import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	{
		/* On first render: check if there is already a logged-in user (via cookie + /auth/me)*/
	}
	useEffect(() => {
		let isMounted = true;

		async function loadCurrentUser() {
			try {
				const data = await authService.getCurrentUser();
				if (isMounted) {
					setUser(data.user || null);
				}
			} catch (error) {
				if (error.message !== "Not authenticated" && error.message !== "Invalid or expired token") {
					console.error("Failed to load current user:", error);
				}
				if (isMounted) {
					setUser(null);
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		}

		loadCurrentUser();

		return () => {
			isMounted = false;
		};
	}, []);

	const login = useCallback(async (email, password) => {
		setLoading(true);
		try {
			const data = await authService.login(email, password);
			setUser(data.user);
			return data.user;
		} catch (error) {
			console.error("Login failed:", error);
			throw error;
		} finally {
			setLoading(false);
		}
	}, []);

	const signup = useCallback(async (email, password) => {
		try {
			const data = await authService.signup(email, password);
			setUser(data.user);
			return data.user;
		} catch (error) {
			console.error("Signup failed:", error);
			throw error;
		}
	}, []);

	{
		/* cookie is deleted by backend, we clean the state */
	}
	const logout = useCallback(async () => {
		setLoading(true);
		try {
			await authService.logout();
			setUser(null);
		} catch (error) {
			console.error("Logout failed:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	{
		/* Make value stable so that Context do not unnecessarily re-render */
	}
	const authValue = useMemo(
		() => ({
			user,
			loading,
			login,
			signup,
			logout,
			isAuthenticated: !!user,
		}),
		[user, loading, login, signup, logout]
	);

	return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
