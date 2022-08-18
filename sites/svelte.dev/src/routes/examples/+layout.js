import { json } from '@sveltejs/kit';
import { API_BASE } from '$lib/env';

export async function load() {
	const examples = await fetch(`${API_BASE}/docs/svelte/examples`).then((r) => r.json());

	return json(examples, {
		cache: {
			maxage: 60
		}
	});
}
