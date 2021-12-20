import * as gist from '$lib/db/gist';

export async function post({ locals, body }) {
	if (!locals.user) return { status: 401 };

	await gist.destroy(locals.user.id, body.ids);

	return {
		status: 204
	};
}