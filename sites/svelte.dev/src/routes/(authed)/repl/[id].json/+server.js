import { json } from '@sveltejs/kit';
import { dev } from '$app/environment';
import * as session from '$lib/db/session';
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

export async function GET({ params }) {
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
			return new Response(await res.json(), { status: res.status });
		}

		const example = await res.json();

		return json({
			id: params.id,
			name: example.name,
			owner: null,
			relaxed: example.relaxed, // TODO is this right?
			components: munge(example.files)
		});
	}

	if (dev && !client) {
		// in dev with no local Supabase configured, proxy to production
		// this lets us at least load saved REPLs
		return await fetch(`https://svelte.dev/repl/${params.id}.json`);
	}

	const app = await gist.read(params.id);

	if (!app) {
		return new Response('not found', { status: 404 });
	}

	return json({
		id: params.id,
		name: app.name,
		owner: app.userid,
		relaxed: false,
		components: munge(app.files)
	});
}

// TODO reimplement as an action
export async function PUT({ params, request }) {
	const user = await session.from_cookie(request.headers.get('cookie'));
	if (!user) return new Response('Unauthorized', { status: 401 });

	const body = await request.json();
	await gist.update(user, params.id, body);

	return new Response(undefined, { status: 204 });
}
