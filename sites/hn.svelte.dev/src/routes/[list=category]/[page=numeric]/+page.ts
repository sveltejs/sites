import { getList } from '#lib/list.remote.js';
import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
	const list = params.list === 'jobs' ? 'job' : params.list;
	const page = +params.page;

	const items = await getList({
		list: params.list,
		page: params.page
	});

	const now = Date.now() / 1000;
	return { list, page, items, now };
}) satisfies PageLoad;
