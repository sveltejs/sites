import { redirect } from '@sveltejs/kit';

export function load() {
	throw redirect(301, 'examples/hello-world');
}
