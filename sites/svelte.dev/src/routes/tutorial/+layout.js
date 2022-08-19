import { API_BASE } from '$lib/env';

export async function load({ fetch }) {
	const tutorials = await fetch(`${API_BASE}/docs/svelte/tutorial`).then(r => r.json());
	return { tutorials };
}
