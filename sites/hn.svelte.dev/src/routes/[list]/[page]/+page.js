import { error } from '@sveltejs/kit';

const valid_lists = new Set(['news', 'newest', 'show', 'ask', 'jobs']);

/** @type {import('@sveltejs/kit').PageLoad} */
export async function load({ params, fetch }) {
	const list = params.list === 'top' ? 'news' : params.list === 'new' ? 'newest' : params.list;

	if (!valid_lists.has(list)) {
		console.log(`invalid list parameter ${list}`);
		throw error(404, 'Not found');
	}

	const page = +params.page;

	const res = await fetch(`https://api.hnpwa.com/v0/${list}/${page}.json`);
	const items = await res.json();

	return {
		page,
		list,
		items
	};
}
