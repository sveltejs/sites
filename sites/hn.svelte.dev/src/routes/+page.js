import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';

export function load() {
	throw redirect(dev ? 302 : 301, '/top/1');
}
