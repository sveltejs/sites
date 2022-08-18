/** @type {import('@sveltejs/kit').PageLoad} */
export async function load({ params, fetch }) {
	const res = await fetch(`https://api.hnpwa.com/v0/item/${params.id}.json`);
	const item = await res.json();

	return { item };
}
