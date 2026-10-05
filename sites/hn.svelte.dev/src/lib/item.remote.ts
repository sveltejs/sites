import { getRequestEvent, query } from '$app/server';
import { error, isHttpError } from '@sveltejs/kit';
import * as v from 'valibot';
import { FirebaseItemTimeoutError, getFirebaseItem } from '#lib/server/firebase.js';

const FIREBASE_ORDERING_TIMEOUT_MS = 2_000;

async function fetchFirebaseItem(id: string): Promise<HNItem | null> {
	let timeout: ReturnType<typeof setTimeout> | undefined;

	try {
		/*
		 * Firebase supplies optional comment and poll-option ordering.
		 * Stop waiting after two seconds so this lookup cannot indefinitely
		 * delay an otherwise available Algolia result.
		 * Do not abort the shared fetch: other callers may still need it.
		 */
		return await Promise.race([
			getFirebaseItem(id).then((result) => (result.ok ? (result.data as HNItem | null) : null)),
			new Promise<null>((resolve) => {
				timeout = setTimeout(() => resolve(null), FIREBASE_ORDERING_TIMEOUT_MS);
			})
		]);
	} finally {
		clearTimeout(timeout);
	}
}

const pollOptionSchema = v.object({
	id: v.pipe(v.number(), v.integer(), v.minValue(1)),
	type: v.literal('pollopt'),
	poll: v.pipe(v.number(), v.integer(), v.minValue(1)),
	by: v.string(),
	time: v.pipe(v.number(), v.finite()),
	text: v.string(),
	score: v.pipe(v.number(), v.finite()),
	deleted: v.optional(v.literal(true))
});

async function fetchPollOption(id: number, pollId: number): Promise<HNPollOption> {
	/*
	 * Poll options are required, unlike Firebase's optional ordering.
	 * Reject unavailable or invalid options rather than presenting a partial poll.
	 */
	try {
		const response = await getFirebaseItem(id);

		if (!response.ok) {
			error(502, 'Unable to load poll options');
		}

		const result = v.safeParse(pollOptionSchema, response.data);

		if (!result.success) {
			error(502, 'Invalid poll option response');
		}

		const option = result.output;

		if (option.id !== id || option.poll !== pollId || option.deleted === true) {
			error(502, 'Invalid poll option response');
		}

		return option;
	} catch (cause) {
		if (cause instanceof FirebaseItemTimeoutError) {
			error(504, 'Timed out loading poll options');
		}

		if (isHttpError(cause)) throw cause;

		error(502, 'Unable to load poll options');
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
		fetchFirebaseItem(id),
		fetch(`https://hn.algolia.com/api/v1/items/${id}`)
	]);

	if (algoliaRes.status === 'rejected') error(500, 'Network failure');
	if (!algoliaRes.value.ok)
		error(algoliaRes.value.status, `Upstream Responded with ${algoliaRes.value.statusText}`);

	const algoliaItem: AlgoliaItem = await algoliaRes.value.json();

	/*
	 * If the optional Firebase lookup fails or returns no item,
	 * retain Algolia's comment and poll-option ordering.
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
		pollOptions = await Promise.all(
			algoliaItem.options.map((id) => fetchPollOption(id, algoliaItem.id))
		);
	}

	return { algoliaItem, pollOptions };
});
