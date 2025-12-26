import { useCallback, useEffect, useRef } from "react";
import { eventService } from "../services/eventService";
import { HOVER_INTENT_DELAY_MS } from "../config/tracking";

/**
 * Tracks answer hover behavior to detect hesitation:
 * - hover intent (after delay)
 * - hover switch (A -> B)
 * - time between last hover and click
 */
export function useAnswerHoverTracking({ sessionId, questionId }) {
	const hoverTimerRef = useRef(null);

	const activeHoverAnswerIdRef = useRef(null);

	// Timestamp of the last hover intent (after delay)
	const lastHoverIntentAtRef = useRef(null);

	// Timestamp of the last raw mouse enter (immediate)
	const lastEnterAtRef = useRef(null);

	useEffect(() => {
		// Cleanup timer on unmount OR when question changes
		return () => {
			if (hoverTimerRef.current) {
				clearTimeout(hoverTimerRef.current);
				hoverTimerRef.current = null;
			}
			activeHoverAnswerIdRef.current = null;
			lastHoverIntentAtRef.current = null;
			lastEnterAtRef.current = null;
		};
	}, [questionId]);

	const clearHoverTimer = useCallback(() => {
		if (hoverTimerRef.current) {
			clearTimeout(hoverTimerRef.current);
			hoverTimerRef.current = null;
		}
	}, []);

	const trackHoverIntent = useCallback(
		({ answerId, enterAt }) => {
			// if we already have an active hover on another answer → switch
			const prev = activeHoverAnswerIdRef.current;

			activeHoverAnswerIdRef.current = answerId;
			lastHoverIntentAtRef.current = performance.now();

			eventService.sendEvent({
				type: "answer_hover_intent",
				sessionId,
				payload: {
					questionId,
					answerId,
					intentDelayMs: Math.round(performance.now() - enterAt),
				},
			});

			if (prev && prev !== answerId) {
				eventService.sendEvent({
					type: "answer_hover_switch",
					sessionId,
					payload: {
						questionId,
						fromAnswerId: prev,
						toAnswerId: answerId,
					},
				});
			}
		},
		[questionId, sessionId]
	);

	const onMouseEnter = useCallback(
		(answerId) => {
			clearHoverTimer();

			const enterAt = performance.now();
			lastEnterAtRef.current = enterAt;

			// After delay, confirm "intent" hover (not accidental pass)
			hoverTimerRef.current = setTimeout(() => {
				trackHoverIntent({ answerId, enterAt });
			}, HOVER_INTENT_DELAY_MS);
		},
		[clearHoverTimer, trackHoverIntent]
	);

	const onMouseLeave = useCallback(
		(answerId) => {
			clearHoverTimer();

			// Optional: track hover end only if this answer was the active hovered one
			if (activeHoverAnswerIdRef.current === answerId) {
				eventService.sendEvent({
					type: "answer_hover_end",
					sessionId,
					payload: {
						questionId,
						answerId,
					},
				});
			}
		},
		[clearHoverTimer, questionId, sessionId]
	);

	const getClickMeta = useCallback(() => {
		const now = performance.now();

		const lastHoverIntentAt = lastHoverIntentAtRef.current;
		const activeHoverAnswerId = activeHoverAnswerIdRef.current;

		return {
			// how long since the last confirmed hover intent → click
			timeSinceLastHoverIntentMs: lastHoverIntentAt ? Math.round(now - lastHoverIntentAt) : null,
			// what answer the user last "hover-intended" before clicking
			lastHoverAnswerId: activeHoverAnswerId || null,
		};
	}, []);

	const getAnswerHoverHandlers = useCallback(
		(answerId) => ({
			onMouseEnter: () => onMouseEnter(answerId),
			onMouseLeave: () => onMouseLeave(answerId),
		}),
		[onMouseEnter, onMouseLeave]
	);

	return {
		getAnswerHoverHandlers,
		getClickMeta,
	};
}
