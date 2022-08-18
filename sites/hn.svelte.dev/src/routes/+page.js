import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load({ url }) {
	throw redirect(url.hostname === 'localhost' || url.hostname === '127.0.0.1' ? 302 : 301, '/top/1');
}
