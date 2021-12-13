import * as gist from '$lib/db/gist';

export async function get({ query, locals }) {
	if (locals.user) {
		const offset = query.get('offset') ? parseInt(query.get('offset')) : 0;

		return {
			body: await gist.list(locals.user, offset)
		};
	} else {
		return { status: 401 };
	}
}
