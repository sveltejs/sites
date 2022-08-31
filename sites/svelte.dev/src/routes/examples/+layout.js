import { API_BASE } from '$lib/env';

export async function load({ fetch }) {
	const examples = await fetch(`${API_BASE}/docs/svelte/examples`).then((r) => r.json());
	return { examples };
}
