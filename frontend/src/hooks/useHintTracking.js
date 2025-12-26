import { useCallback } from "react";
import { eventService } from "../services/eventService";

export function useHintTracking({ sessionId, questionId }) {
	const trackHintUsed = useCallback(() => {
		eventService.sendEvent({
			type: "hint_used",
			sessionId,
			payload: {
				questionId,
			},
		});
	}, [sessionId, questionId]);

	return {
		trackHintUsed,
	};
}
