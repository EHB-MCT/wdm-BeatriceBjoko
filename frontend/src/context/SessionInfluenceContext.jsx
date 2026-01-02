import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { INFLUENCE_STRESS_THRESHOLD } from "../config/tracking";

const SessionInfluenceContext = createContext(null);

export function SessionInfluenceProvider({ children }) {
	const [stressScore, setStressScore] = useState(0);

	const addStress = useCallback((amount) => {
		setStressScore((prev) => prev + amount);
	}, []);

	const value = useMemo(
		() => ({
			stressScore,
			addStress,
			isInfluenced: stressScore >= INFLUENCE_STRESS_THRESHOLD,
		}),
		[stressScore, addStress]
	);

	return <SessionInfluenceContext.Provider value={value}>{children}</SessionInfluenceContext.Provider>;
}

export function useSessionInfluence() {
	const ctx = useContext(SessionInfluenceContext);
	if (!ctx) {
		throw new Error("useSessionInfluence must be used inside SessionInfluenceProvider");
	}
	return ctx;
}
