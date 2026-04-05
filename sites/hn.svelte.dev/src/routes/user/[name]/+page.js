import { browser } from '$app/environment';
export const csr = browser;

/**
 * @satisfies {import('./$types').PageLoad}
 */
export async function load({ params, fetch }) {
	/**
	 * @type {HNUser}
	 */
	const user = await fetch(`https://hacker-news.firebaseio.com/v0/user/${params.name}.json`).then(
		(r) => r.json()
	);

	return user;
}
