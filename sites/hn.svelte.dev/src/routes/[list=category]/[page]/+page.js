/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
	const list = params.list === 'top' ? 'news' : params.list === 'new' ? 'newest' : params.list;

	const page = +params.page;

	const res = await fetch(`https://api.hnpwa.com/v0/${list}/${page}.json`);
	const items = await res.json();

	return {
		page,
		list,
		items
	};
}
