import { error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { getFirebaseItem } from '#lib/server/firebase.js';
import { FIREBASE, readUpstreamJson, upstreamHttpMessage } from '#lib/server/upstream.js';

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
	const storyResponse = await fetch(`${FIREBASE.base}${list}stories.json`);

	if (!storyResponse.ok) {
		error(storyResponse.status, upstreamHttpMessage(FIREBASE.name, storyResponse.status));
	}

	const itemIds = (await readUpstreamJson(storyResponse, FIREBASE.name)) as number[];
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
