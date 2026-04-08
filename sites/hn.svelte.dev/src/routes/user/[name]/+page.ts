import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types.js';
import type { ResponseType } from './api/+server.js';

export const csr = false;
export const load = (async ({ params, fetch }) => {
	const res = await fetch(`/user/${params.name}/api`);
	if (!res.ok) error(res.status, res.statusText);
	const user: ResponseType = await res.json();
	const now = Date.now() / 1000;
	return { user, now };
}) satisfies PageLoad;
