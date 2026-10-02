import { getRequestEvent, query } from '$app/server';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';
import type { ResponseType } from '#routes/user/[name]/api/+server.js';

export const getUser = query(
	v.pipe(v.string(), v.minLength(1)),
	async (name): Promise<ResponseType> => {
		const { fetch } = getRequestEvent();

		const res = await fetch(`/user/${encodeURIComponent(name)}/api`);
		if (!res.ok) error(res.status, res.statusText);

		return await res.json();
	}
);
