export async function load({ params, fetch }) {
	const list = params.list === 'top' ? 'news' : params.list === 'new' ? 'newest' : params.list;

	return {
		list: params.list,
		page: +params.page,
		items: fetch(`https://api.hnpwa.com/v0/${list}/${params.page}.json`).then((r) => r.json())
	};
}
