import { getRequestEvent, query } from '$app/server';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

const FIREBASE_BASE = 'https://hacker-news.firebaseio.com/v0/' as const;

type ItemResult = {
	algoliaItem: AlgoliaItem;
	pollOptions: HNPollOption[];
};

const itemId = v.pipe(v.string(), v.regex(/^\d+$/));

export const getItem = query(itemId, async (id): Promise<ItemResult> => {
	const { fetch } = getRequestEvent();

	const [hnRes, algoliaRes] = await Promise.allSettled([
		fetch(`${FIREBASE_BASE}item/${id}.json`),
		fetch(`https://hn.algolia.com/api/v1/items/${id}`)
	]);

	if (algoliaRes.status === 'rejected') error(500, 'Network failure');
	if (!algoliaRes.value.ok)
		error(algoliaRes.value.status, `Upstream Responded with ${algoliaRes.value.statusText}`);

	const algoliaItem: AlgoliaItem = await algoliaRes.value.json();
	const hnItem: HNItem | null =
		hnRes.status === 'fulfilled' && hnRes.value.ok ? await hnRes.value.json() : null;

	if (hnItem) {
		if ('kids' in hnItem && typeof hnItem.kids !== 'undefined') {
			const { kids } = hnItem;
			algoliaItem.children.sort((a, b) => {
				const indexA = kids.indexOf(a.id);
				const indexB = kids.indexOf(b.id);
				return indexA - indexB;
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
