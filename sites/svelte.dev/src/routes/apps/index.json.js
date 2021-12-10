import { gists } from '$lib/db';

export async function get({ query, locals }) {
	if (locals.user) {
		const offset = query.get('offset') ? parseInt(query.get('offset')) : 0;

		return {
			body: await gists.list(locals.user, offset)
		};
	} else {
		return { status: 401 };
	}
}
