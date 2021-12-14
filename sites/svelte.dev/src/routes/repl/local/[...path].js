import { readFileSync } from 'fs';

export function get({ params: { path } }) {
	if (import.meta.env.PROD || ('/' + path).includes('/.')) {
		return { status: 403 };
	}
	return {
		headers: { 'Content-Type': 'text/javascript' },
		body: readFileSync('../' + path)
	};
}
