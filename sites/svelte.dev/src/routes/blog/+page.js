import { API_BASE } from '$lib/env';

export async function load({ fetch }) {
	const res = await fetch(`${API_BASE}/docs/svelte/blog`);

	if (res.ok) {
		return { posts: await res.json() };
	}
}
