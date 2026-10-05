import { getRequestEvent, query } from '$app/server';
import * as v from 'valibot';
import { fetchList } from '#lib/server/list.js';

const listArgs = v.object({
	list: v.picklist(['top', 'new', 'best', 'show', 'ask', 'jobs']),
	page: v.pipe(v.string(), v.regex(/^\d+$/))
});

export const getList = query(listArgs, async ({ list, page }) => {
	const { fetch } = getRequestEvent();
	return await fetchList(fetch, list, page);
});
