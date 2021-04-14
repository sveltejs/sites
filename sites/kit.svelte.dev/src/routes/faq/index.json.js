import { dev } from '$app/env';
import generate_docs from '$lib/generate_docs.js';

let body;

export function get() {
	if (dev || !body) {
		body = JSON.stringify(generate_docs('faq'));
	}

	return { body };
}
