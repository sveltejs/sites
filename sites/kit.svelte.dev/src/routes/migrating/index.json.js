import { dev } from '$app/env';
import generate_docs from '$lib/generate_docs.js';

let body;

export function get() {
	if (!body || dev) {
		body = JSON.stringify(generate_docs('migrating')); // TODO it errors if I send the non-stringified value
	}

	return {
		body
	};
}
