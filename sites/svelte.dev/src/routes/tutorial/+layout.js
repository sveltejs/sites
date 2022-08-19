import { json } from '@sveltejs/kit';
import { API_BASE } from '$lib/env';

export async function load() {
	const tutorials = await fetch(`${API_BASE}/docs/svelte/tutorial`).then(r => r.json());

	setHeaders({
		'cache-control': 'public, max-age=60'
	});

	return { tutorials };
}
