import { getRequestEvent, query } from '$app/server';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

const FIREBASE_BASE = 'https://hacker-news.firebaseio.com/v0/' as const;
const FIREBASE_ITEM_TIMEOUT_MS = 2_000;

async function fetchFirebaseItem(
	fetch: typeof globalThis.fetch,
	id: string
): Promise<HNItem | null> {
	const controller = new AbortController();

	/*
	 * Firebase supplies optional comment and poll-option ordering.
	 * Give this lookup a two-second time budget so it cannot
	 * indefinitely delay an otherwise available Algolia result.
	 * Keep the deadline active through response-body parsing.
	 */
	const timeout = setTimeout(() => {
		controller.abort();
	}, FIREBASE_ITEM_TIMEOUT_MS);

	try {
		const res = await fetch(`${FIREBASE_BASE}item/${id}.json`, {
			signal: controller.signal
		});

		if (!res.ok) return null;

		return await res.json();
	} finally {
		clearTimeout(timeout);
	}
}

type ItemResult = {
	algoliaItem: AlgoliaItem;
	pollOptions: HNPollOption[];
};

const itemId = v.pipe(v.string(), v.regex(/^\d+$/));

export const getItem = query(itemId, async (id): Promise<ItemResult> => {
	const { fetch } = getRequestEvent();

	const [hnResult, algoliaRes] = await Promise.allSettled([
		fetchFirebaseItem(fetch, id),
		fetch(`https://hn.algolia.com/api/v1/items/${id}`)
	]);

	if (algoliaRes.status === 'rejected') error(500, 'Network failure');
	if (!algoliaRes.value.ok)
		error(algoliaRes.value.status, `Upstream Responded with ${algoliaRes.value.statusText}`);

	const algoliaItem: AlgoliaItem = await algoliaRes.value.json();

	/*
	 * Optional Firebase data may be unavailable because of
	 * - network failure,
	 * - timeout, or
	 * - invalid JSON.
	 *
	 * In those cases, retain Algolia's ordering.
	 */
	const hnItem = hnResult.status === 'fulfilled' ? hnResult.value : null;

	if (hnItem) {
		if ('kids' in hnItem && typeof hnItem.kids !== 'undefined') {
			const { kids } = hnItem;
			const rankById = new Map(kids.map((id, index) => [id, index]));
			const unmatchedRank = kids.length;

			/*
			 * Providers can return different sets of comments.
			 * Keep Algolia’s available children and use Firebase only to rank matching IDs.
			 * Place unmatched children after ranked children;
			 * stable sorting preserves their original Algolia order.
			 * Leave nested replies unchanged.
			 */
			algoliaItem.children.sort((a, b) => {
				const rankA = rankById.get(a.id) ?? unmatchedRank;
				const rankB = rankById.get(b.id) ?? unmatchedRank;

				return rankA - rankB;
			});
		}

		if ('parts' in hnItem) {
			algoliaItem.options = hnItem.parts;
		}
	}

	let pollOptions: HNPollOption[] = [];
	if (algoliaItem.type === 'poll') {
		const pollsResponses = await Promise.all(
			algoliaItem.options.map((id) => fetch(`${FIREBASE_BASE}item/${id}.json`))
		);
		pollOptions = await Promise.all(pollsResponses.map((poll) => poll.json()));
	}

	return { algoliaItem, pollOptions };
});
