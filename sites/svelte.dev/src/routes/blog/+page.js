import { PUBLIC_API_BASE } from '$env/static/public';

export async function load({ fetch }) {
	const res = await fetch(`${PUBLIC_API_BASE}/docs/svelte/blog`);

	if (res.ok) {
		return { posts: await res.json() };
	}
}
