import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';

export function GET() {
	throw redirect(dev ? 301 : 302, '/top/rss');
}
