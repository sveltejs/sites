import { fetchList } from '#lib/server/list.js';
import type { RequestHandler } from './$types';

export type { ResponseType } from '#lib/server/list.js';

export const GET = (async ({ params, fetch }) => {
	const items = await fetchList(fetch, params.list, params.page);

	return Response.json(items, {
		headers: {
			'Cache-Control': 'public, max-age=60, s-maxage=60'
		}
	});
}) satisfies RequestHandler;
