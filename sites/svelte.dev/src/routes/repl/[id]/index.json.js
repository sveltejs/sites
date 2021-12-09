import { gists } from '$lib/db';
import { API_BASE } from '../../../_env';

/** @type {Set<string>} */
let examples;

function munge(files) {
	return files
		.map(file => {
			const dot = file.name.lastIndexOf('.');
			let name = file.name.slice(0, dot);
			let type = file.name.slice(dot + 1);

			if (type === 'html') type = 'svelte';
			return { name, type, source: file.source || file.content };
		})
		.sort((a, b) => {
			if (a.name === 'App' && a.type === 'svelte') return -1;
			if (b.name === 'App' && b.type === 'svelte') return 1;

			if (a.type !== b.type) return a.type === 'svelte' ? -1 : 1;

			return a.name < b.name ? -1 : 1;
		});
}

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

	if (examples.has(params.id)) {
		const res = await fetch(`${API_BASE}/docs/svelte/examples/${params.id}`);

		if (!res.ok) {
			return {
				status: res.status,
				body: await res.json()
			};
		}

		const example = await res.json();

		return {
			body: {
				uid: params.id,
				name: example.name,
				owner: null,
				relaxed: example.relaxed, // TODO is this right?
				components: munge(example.files)
			}
		};
	}

	const gist = await gists.read(params.id);

	return {
		body: {
			uid: params.id,
			name: gist.name,
			owner: gist.owner,
			relaxed: false,
			components: munge(gist.files)
		}
	};
}

export async function put({ locals, params, body }) {
	if (!locals.user) {
		return {
			status: 401,
			body: 'Unauthorized'
		};
	}

	await gists.update(locals.user, params.id, body);

	return {
		status: 204
	};
}
