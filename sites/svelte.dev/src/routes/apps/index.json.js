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

export async function del({ locals, body }) {
	const { user } = locals;
	if (!user) return;

	try {
		await gist.destroy(user, body);

		return {
			status: 202
		};
	} catch (err) {
		return {
			status: 500,
			body: {
				error: err.message
			}
		};
	}
}
