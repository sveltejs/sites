import { getRequestEvent, query } from '$app/server';
import * as v from 'valibot';
import { FIREBASE, readUpstreamJson, UpstreamError } from '#lib/server/upstream.js';

const FIREBASE_ITEM_TIMEOUT_MS = 5_000;

export class FirebaseItemTimeoutError extends UpstreamError {
	constructor(options?: ErrorOptions) {
		super(FIREBASE.name, { stage: 'timeout', timeoutMs: FIREBASE_ITEM_TIMEOUT_MS }, options);
		this.name = 'FirebaseItemTimeoutError';
	}
}

type FirebaseItemResult = { ok: true; data: unknown } | { ok: false; status: number };

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
			const res = await fetch(`${FIREBASE.base}item/${id}.json`, {
				signal: controller.signal
			});

			if (!res.ok) return { ok: false, status: res.status };

			const data = await readUpstreamJson(res, FIREBASE.name);
			return { ok: true, data };
		} catch (cause) {
			if (controller.signal.aborted) {
				throw new FirebaseItemTimeoutError({ cause });
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
