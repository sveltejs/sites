import { API_BASE } from '../../../_env';

export async function get({ params }) {
	const example = await fetch(`https://api.svelte.dev/docs/svelte/examples/${params.id}`);
	if (example.ok) {
		return {
			body: await example.json()
		};
	}

	const gist = await (await fetch(`${API_BASE}/gists/${params.id}`)).json();
	return {
		body: gist
	};
}
