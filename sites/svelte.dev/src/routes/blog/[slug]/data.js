import { error } from '@sveltejs/kit';
import { PUBLIC_API_BASE } from '$env/static/public';

/** @param {string} slug */
export async function get_post(slug) {
	const res = await fetch(`${PUBLIC_API_BASE}/docs/svelte/blog/${slug}`);

	if (!res.ok) throw error(404, 'That post could not be found');

	const data = await res.json();
	if (!data.draft) return data;
	throw error(404, 'That post could not be found');
}
