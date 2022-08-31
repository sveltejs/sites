import { error } from '@sveltejs/kit';
import { API_BASE } from '$lib/env';

export async function load({ fetch, params }) {
	const res = await fetch(`${API_BASE}/docs/svelte/blog/${params.slug}`);

	if (!res.ok) throw error(404, 'That post could not be found');

	const data = await res.json();
	if (!data.draft) return { post: data };
	throw error(404, 'That post could not be found');
}
