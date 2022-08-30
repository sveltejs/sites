import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').RequestHandler} */
export function GET() {
	throw redirect(dev ? 301 : 302, '/top/rss');
}
