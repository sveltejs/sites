import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { ResponseType } from './api/+server';

export const load = (async ({ params, fetch }) => {
	const list = params.list === 'jobs' ? 'job' : params.list;
	const page = +params.page;

	const res = await fetch(`/${params.list}/${params.page}/api`);
	if (!res.ok) error(res.status, res.statusText);

	const items: ResponseType = await res.json();
	const now = Date.now() / 1000;
	return { list, page, items, now };
}) satisfies PageLoad;
