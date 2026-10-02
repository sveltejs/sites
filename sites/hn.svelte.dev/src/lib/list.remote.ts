import { getRequestEvent, query } from '$app/server';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';
import type { ResponseType } from '#routes/[list=category]/[page=numeric]/api/+server.js';

const listArgs = v.object({
	list: v.picklist(['top', 'new', 'best', 'show', 'ask', 'jobs']),
	page: v.pipe(v.string(), v.regex(/^\d+$/))
});

export const getList = query(listArgs, async ({ list, page }): Promise<ResponseType> => {
	const { fetch } = getRequestEvent();

	const res = await fetch(`/${list}/${page}/api`);
	if (!res.ok) error(res.status, res.statusText);

	return await res.json();
});
