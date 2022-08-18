export const hydrate = false;

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
	const res = await fetch(`https://api.hnpwa.com/v0/user/${params.name}.json`);
	const user = await res.json();

	return {
		name: params.name,
		user
	};
}
