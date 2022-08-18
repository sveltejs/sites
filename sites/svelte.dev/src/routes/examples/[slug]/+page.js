import { json } from '@sveltejs/kit';
import { API_BASE } from '$lib/env';

export async function load({ params }) {
	const example = await fetch(`${API_BASE}/docs/svelte/examples/${params.slug}`, {
		credentials: 'omit'
	});

	return json({
			example: await example.json(),
			slug: params.slug
		}, {
			cache: {
				maxage: 60
			}
		}
	);
}
