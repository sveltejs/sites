export const csr = false;

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
	const res = await fetch(`https://api.hnpwa.com/v0/user/${params.name}.json`);
	return res.json();
}
