import { useEffect, useRef } from "react";
import { eventService } from "../services/eventService";
import { BLUR_DEBOUNCE_MS } from "../config/tracking";
import { useSessionInfluence } from "../context/SessionInfluenceContext";

/**
 * Tracks when the user leaves the browser tab (loss of focus)
 * Interpreted later as distraction, fatigue or disengagement
 */
export function useTabBlurTracking({ sessionId, getCurrentQuestionId }) {
	const lastBlurAtRef = useRef(0);
	const { addStress } = useSessionInfluence();

	useEffect(() => {
		function handleBlur() {
			const now = Date.now();

			// basic debounce to avoid spam (alt-tab spam, etc.)
			if (now - lastBlurAtRef.current < BLUR_DEBOUNCE_MS) return;
			lastBlurAtRef.current = now;

			eventService.sendEvent({
				type: "tab_blur",
				sessionId,
				payload: {
					questionId: getCurrentQuestionId?.() || null,
				},
			});

			// Influence: tab blur increases stress
			addStress(1);
		}

		window.addEventListener("blur", handleBlur);

		return () => {
			window.removeEventListener("blur", handleBlur);
		};
	}, [sessionId, getCurrentQuestionId, addStress]);
}
