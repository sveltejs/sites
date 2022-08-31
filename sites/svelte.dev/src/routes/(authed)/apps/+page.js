import { json } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, url, parent }) {
	let gists = [];
	let next = null;

	const search = url.searchParams.get('search');

	const { user } = await parent();

	if (user) {
		const r = await fetch(`/apps.json?${url.searchParams}`, {
			credentials: 'include'
		});

		if (!r.ok) {
			return json(await r.text(), { status: r.status });
		}

		({ gists, next } = await r.json());
	}

	return { user, gists, next, search };
}
