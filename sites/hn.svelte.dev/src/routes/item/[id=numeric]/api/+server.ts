import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const FIRESTORE_BASE = 'https://hacker-news.firebaseio.com/v0/' as const;

export type ResponseType = { algoliaItem: AlgoliaItem; pollOptions: HNPollOption[] };
export const GET = (async ({ params, fetch }) => {
	// HN fetch is allowed to fail
	const [hnRes, algoliaRes] = await Promise.allSettled([
		fetch(`${FIRESTORE_BASE}item/${params.id}.json`),
		fetch(`https://hn.algolia.com/api/v1/items/${params.id}`)
	]);
	if (algoliaRes.status === 'rejected') error(500, 'Network failure');
	if (!algoliaRes.value.ok)
		error(algoliaRes.value.status, `Upstream Responded with ${algoliaRes.value.statusText}`);

	const algoliaItem: AlgoliaItem = await algoliaRes.value.json();
	const hnItem: HNItem | null =
		hnRes.status === 'fulfilled' && hnRes.value.ok ? await hnRes.value.json() : null;

	// if hn available, use their top-level sort
	if (hnItem) {
		// comment sort
		if ('kids' in hnItem && typeof hnItem.kids !== 'undefined') {
			const { kids } = hnItem;
			algoliaItem.children.sort((a, b) => {
				const indexA = kids.indexOf(a.id);
				const indexB = kids.indexOf(b.id);
				return indexA - indexB;
			});
		}
		// poll item sort
		if ('parts' in hnItem) {
			algoliaItem.options = hnItem.parts;
		}
	}

	let pollOptions: HNPollOption[] = [];
	if (algoliaItem.type === 'poll') {
		const pollsResponses = await Promise.all(
			algoliaItem.options.map((id) => fetch(`${FIRESTORE_BASE}item/${id}.json`))
		);
		pollOptions = await Promise.all(pollsResponses.map((poll) => poll.json()));
	}

	return json(
		{
			algoliaItem,
			pollOptions
		} satisfies ResponseType,
		{
			headers: {
				'Cache-Control': 'public, max-age=60, s-maxage=60'
			}
		}
	);
}) satisfies RequestHandler;
