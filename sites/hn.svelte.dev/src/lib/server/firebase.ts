import { getRequestEvent, query } from '$app/server';
import * as v from 'valibot';

export const FIREBASE_BASE = 'https://hacker-news.firebaseio.com/v0/' as const;

const FIREBASE_ITEM_TIMEOUT_MS = 5_000;

export class FirebaseItemTimeoutError extends Error {}

type FirebaseItemResult = { ok: true; data: unknown } | { ok: false };

const firebaseItem = query(
	v.pipe(v.string(), v.regex(/^\d+$/)),
	async (id): Promise<FirebaseItemResult> => {
		const { fetch } = getRequestEvent();
		const controller = new AbortController();
		/*
		 * Bound the shared Firebase operation to five seconds, including
		 * response-body parsing. Individual callers may stop waiting sooner
		 * without cancelling this operation.
		 */
		const timeout = setTimeout(() => {
			controller.abort(new FirebaseItemTimeoutError());
		}, FIREBASE_ITEM_TIMEOUT_MS);

		try {
			const res = await fetch(`${FIREBASE_BASE}item/${id}.json`, {
				signal: controller.signal
			});

			if (!res.ok) return { ok: false };

			const data: unknown = await res.json();
			return { ok: true, data };
		} catch (cause) {
			if (controller.signal.aborted) {
				throw controller.signal.reason;
			}

			throw cause;
		} finally {
			clearTimeout(timeout);
		}
	}
);

export function getFirebaseItem(id: string | number) {
	// apparently https://news.ycombinator.com/item?id=000000000000049959869 works
	// so normalize before actually querying
	const normalizedId = String(id).replace(/^0+(?=\d)/, '');
	return firebaseItem(normalizedId);
}
