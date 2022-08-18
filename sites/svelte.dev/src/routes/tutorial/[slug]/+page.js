import { json, redirect } from '@sveltejs/kit';
import { API_BASE } from '$lib/env';

export async function load({ params }) {
	const tutorial = await fetch(`${API_BASE}/docs/svelte/tutorial/${params.slug}`);

	if (!tutorial.ok) {
		throw redirect(301, '/tutorial/basics');
	}

	return json({ tutorial: await tutorial.json(), slug: params.slug }, {
		cache: {
			maxage: 60
		}
	});
}
