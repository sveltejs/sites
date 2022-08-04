import { readFileSync } from 'fs';
import { join } from 'path';

const local_svelte_path = process.env.LOCAL_SVELTE_PATH || '../../../svelte';

export function get({ params: { path } }) {
	if (import.meta.env.PROD || ('/' + path).includes('/.')) {
		return { status: 403 };
	}
	return {
		headers: { 'Content-Type': 'text/javascript' },
		body: readFileSync(join(local_svelte_path, path))
	};
}
