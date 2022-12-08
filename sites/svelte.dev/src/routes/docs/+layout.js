import { API_BASE } from '$lib/env';

export const ssr = false;

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, setHeaders }) {
	let sections = await (await fetch(`${API_BASE}/docs/svelte/docs?content`)).json();

	// TODO hard coded for now, we need to adjust the API for this, which would break any unofficial sites using it
	// sections = [
	// 	{ title: 'Introduction', pages: sections.slice(0, 2) },
	// 	{ title: 'Core Concepts', pages: sections.slice(2, 5) },
	// 	{ title: 'Advanced', pages: sections.slice(5) }
	// ];

	setHeaders({
		'cache-control': 'public, max-age=60'
	});

	return { sections };
}
