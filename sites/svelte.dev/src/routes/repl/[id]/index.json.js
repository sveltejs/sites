import { API_BASE } from '../../../_env';

/** @type {Set<string>} */
let examples;

export async function get({ params }) {
	if (!examples) {
		const res = await fetch(`${API_BASE}/docs/svelte/examples`);
		examples = new Set(
			(await res.json())
				.map(category => category.examples)
				.flat()
				.map(example => example.slug)
		);
	}

	const res = examples.has(params.id)
		? await fetch(`${API_BASE}/docs/svelte/examples/${params.id}`)
		: await fetch(`${API_BASE}/gists/${params.id}`);

	if (!res.ok) {
		return {
			status: res.status,
			body: await res.json()
		};
	}

	const gist = await res.json();

	// TODO might be better if gists were stored
	// in this form in the first place
	const components = gist.files.map(file => {
		const dot = file.name.lastIndexOf('.');
		let name = file.name.slice(0, dot);
		let type = file.name.slice(dot + 1);

		if (type === 'html') type = 'svelte';
		return { name, type, source: file.source || file.content };
	});

	components.sort((a, b) => {
		if (a.name === 'App' && a.type === 'svelte') return -1;
		if (b.name === 'App' && b.type === 'svelte') return 1;

		if (a.type !== b.type) return a.type === 'svelte' ? -1 : 1;

		return a.name < b.name ? -1 : 1;
	});

	return {
		body: {
			id: params.id,
			name: gist.name,
			owner: gist.owner,
			relaxed: gist.relaxed,
			components
		}
	};
}
