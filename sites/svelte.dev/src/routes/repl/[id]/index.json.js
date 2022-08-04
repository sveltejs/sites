import { dev } from '$app/env';
import { client } from '$lib/db/client';
import * as gist from '$lib/db/gist';
import { API_BASE } from '$lib/env';

/** @type {Set<string>} */
let examples;

function munge(files) {
	return files
		.map((file) => {
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
				.map((category) => category.examples)
				.flat()
				.map((example) => example.slug)
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
				id: params.id,
				name: example.name,
				owner: null,
				relaxed: example.relaxed, // TODO is this right?
				components: munge(example.files)
			}
		};
	}

	if (dev && !client) {
		// in dev with no local Supabase configured, proxy to production
		// this lets us at least load saved REPLs
		return fetch(`https://svelte.dev/repl/${params.id}.json`);
	}

	const app = await gist.read(params.id);

	if (!app) {
		return {
			status: 404,
			body: 'not found'
		};
	}

	return {
		body: {
			id: params.id,
			name: app.name,
			owner: app.userid,
			relaxed: false,
			components: munge(app.files)
		}
	};
}

export async function put({ locals, params, request }) {
	if (!locals.user) {
		return {
			status: 401,
			body: 'Unauthorized'
		};
	}

	const body = await request.json();
	await gist.update(locals.user, params.id, body);

	return {
		status: 204
	};
}
