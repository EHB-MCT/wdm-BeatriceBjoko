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

	const lastHoverIntentAtRef = useRef(null);

	const lastEnterAtRef = useRef(null);

	useEffect(() => {
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

			hoverTimerRef.current = setTimeout(() => {
				trackHoverIntent({ answerId, enterAt });
			}, HOVER_INTENT_DELAY_MS);
		},
		[clearHoverTimer, trackHoverIntent]
	);

	const onMouseLeave = useCallback(
		(answerId) => {
			clearHoverTimer();

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
			timeSinceLastHoverIntentMs: lastHoverIntentAt ? Math.round(now - lastHoverIntentAt) : null,
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
