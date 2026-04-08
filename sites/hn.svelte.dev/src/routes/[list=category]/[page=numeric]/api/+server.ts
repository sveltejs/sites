import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const FIRESTORE_BASE = 'https://hacker-news.firebaseio.com/v0/' as const;
const ITEMS_PER_PAGE = 30 as const;

export type ResponseType = (HNStory | HNJob | HNPoll | { type: 'null'; id: number })[];
export const GET = (async ({ params, fetch }) => {
	const list = params.list === 'jobs' ? 'job' : params.list;
	const page = +params.page;

	const offset = (page - 1) * ITEMS_PER_PAGE;
	const storyResponse = await fetch(`${FIRESTORE_BASE}${list}stories.json`);
	if (!storyResponse.ok)
		error(storyResponse.status, `Upstream Responded with ${storyResponse.statusText}`);

	const itemIds: number[] = await storyResponse.json();
	const relevantItemIds = itemIds.slice(offset, offset + ITEMS_PER_PAGE);

	if (relevantItemIds.length === 0) {
		error(404, 'Page not found');
	}

	const items: ResponseType = await Promise.all(
		relevantItemIds.map((id) =>
			fetch(`${FIRESTORE_BASE}item/${id}.json`).then(
				// allow partial failure in fetch
				(res) => (res.ok ? res.json() : { type: 'null', id })
			)
		)
	);

	return json(items, {
		headers: {
			'Cache-Control': 'public, max-age=60, s-maxage=60'
		}
	});
}) satisfies RequestHandler;
