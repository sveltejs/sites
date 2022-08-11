import {dev} from '$app/env';
/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export function GET() {
	return {
		headers: { Location: '/top/rss' },
		status: dev ? 302 : 301
	};
}
