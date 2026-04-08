import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const FIRESTORE_BASE = 'https://hacker-news.firebaseio.com/v0/' as const;

export type ResponseType = HNUser;
export const GET = (async ({ params, fetch }) => {
	const res = await fetch(`${FIRESTORE_BASE}user/${params.name}.json`);
	if (!res.ok) error(res.status, `Upstream Responded with ${res.statusText}`);
	const user: HNUser = await res.json();
	return json(user satisfies ResponseType, {
		headers: {
			'Cache-Control': 'public, max-age=60, s-maxage=60'
		}
	});
}) satisfies RequestHandler;
