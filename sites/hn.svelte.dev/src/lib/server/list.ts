import { error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

const FIREBASE_BASE = 'https://hacker-news.firebaseio.com/v0/' as const;
const ITEMS_PER_PAGE = 30 as const;

type ListCategory = 'top' | 'new' | 'best' | 'show' | 'ask' | 'jobs';

export type ResponseType = (HNStory | HNJob | HNPoll | { type: 'null'; id: number })[];

export async function fetchList(
	fetch: RequestEvent['fetch'],
	category: ListCategory,
	pageParam: string
): Promise<ResponseType> {
	const list = category === 'jobs' ? 'job' : category;
	const page = +pageParam;

	const offset = (page - 1) * ITEMS_PER_PAGE;
	const storyResponse = await fetch(`${FIREBASE_BASE}${list}stories.json`);
	if (!storyResponse.ok)
		error(storyResponse.status, `Upstream Responded with ${storyResponse.statusText}`);

	const itemIds: number[] = await storyResponse.json();
	const relevantItemIds = itemIds.slice(offset, offset + ITEMS_PER_PAGE);

	if (relevantItemIds.length === 0) {
		error(404, 'Page not found');
	}

	const items: ResponseType = await Promise.all(
		relevantItemIds.map((id) =>
			fetch(`${FIREBASE_BASE}item/${id}.json`).then((res) =>
				res.ok ? res.json() : { type: 'null', id }
			)
		)
	);

	return items;
}
