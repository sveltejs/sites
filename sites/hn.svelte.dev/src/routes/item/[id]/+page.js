const BASE = 'https://hacker-news.firebaseio.com/v0/';

/**
 * @satisfies {import('./$types').PageLoad}
 */
export async function load({ params, fetch }) {
	/** @type {Item} */
	const item = await fetch(`${BASE}item/${params.id}.json`).then((r) => r.json());

	return item;
}
