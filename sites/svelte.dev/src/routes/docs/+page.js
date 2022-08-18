import { API_BASE } from '$lib/env';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, setHeaders }) {
	const sections = await (await fetch(`${API_BASE}/docs/svelte/docs?content`)).json();

	setHeaders({
		'cache-control': 'public, max-age=60'
	});

	return { sections };
}
