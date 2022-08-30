import { dev } from '$app/env';
import { redirect } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').RequestHandler} */
export function GET() {
	throw redirect(dev ? 301 : 301, '/top/rss');
}
