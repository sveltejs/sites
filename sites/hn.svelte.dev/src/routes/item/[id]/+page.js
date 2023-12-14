export async function load({ params, fetch }) {
	return await fetch(`https://api.hnpwa.com/v0/item/${params.id}.json`).then((r) => r.json());
}
