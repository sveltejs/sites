export function fetch_page_list(fetch, offset) {
	let url = 'apps.json';
	if (offset) {
		url += `?offset=${encodeURIComponent(offset)}`;
	}
	return fetch(url, {
		credentials: 'include'
	});
}

export async function page_list(fetch, offset) {
	let out = {
		gists: [],
		next: null,
		current: null,
		prev: null
	};
	const r = await fetch_page_list(fetch, offset);
	if (!r.ok) {
		return out;
	}
	return r.json();
}
