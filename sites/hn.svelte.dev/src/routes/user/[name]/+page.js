export const csr = false;

export async function load({ params, fetch }) {
	return fetch(`https://api.hnpwa.com/v0/user/${params.name}.json`).then((r) => r.json());
}
