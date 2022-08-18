import {dev} from '$app/env';
/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export function GET() {
	return new Response(undefined, { status: dev ? 302 : 301, headers: { Location: '/top/rss' } });
}
