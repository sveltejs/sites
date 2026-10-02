import { getRequestEvent, query } from '$app/server';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';
import type { ResponseType } from '#routes/item/[id=numeric]/api/+server.js';

const itemId = v.pipe(v.string(), v.regex(/^\d+$/));

export const getItem = query(itemId, async (id): Promise<ResponseType> => {
	const { fetch } = getRequestEvent();

	const res = await fetch(`/item/${id}/api`);
	if (!res.ok) error(res.status, res.statusText);

	return await res.json();
});
