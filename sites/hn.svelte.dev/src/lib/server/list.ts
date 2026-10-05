import { error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { FIREBASE_BASE, getFirebaseItem } from '#lib/server/firebase.js';

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
		relevantItemIds.map(async (id): Promise<ResponseType[number]> => {
			const result = await getFirebaseItem(id);

			if (!result.ok || result.data === null) {
				return { type: 'null', id };
			}

			return result.data as HNStory | HNJob | HNPoll;
		})
	);

	return items;
}
