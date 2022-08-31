import { redirect } from '@sveltejs/kit';
import { API_BASE } from '$lib/env';

export async function load({ fetch, params, setHeaders }) {
	const tutorial = await fetch(`${API_BASE}/docs/svelte/tutorial/${params.slug}`);

	if (!tutorial.ok) {
		throw redirect(301, '/tutorial/basics');
	}

	setHeaders({
		'cache-control': 'public, max-age=60'
	});

	return { tutorial: await tutorial.json(), slug: params.slug };
}
