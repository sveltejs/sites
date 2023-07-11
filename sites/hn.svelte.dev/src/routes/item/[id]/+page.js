export async function load({ params, fetch }) {
	const res = await fetch(`https://api.hnpwa.com/v0/item/${params.id}.json`);
	return res.json();
}
