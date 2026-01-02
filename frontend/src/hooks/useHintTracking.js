import { useCallback } from "react";
import { eventService } from "../services/eventService";
import { useSessionInfluence } from "../context/SessionInfluenceContext";

export function useHintTracking({ sessionId, questionId }) {
	const { addStress } = useSessionInfluence();

	const trackHintUsed = useCallback(() => {
		eventService.sendEvent({
			type: "hint_used",
			sessionId,
			payload: {
				questionId,
			},
		});

		/**Influence: using a hint increases stress */
		addStress(1);
	}, [sessionId, questionId, addStress]);

	return {
		trackHintUsed,
	};
}
