import * as gist from '$lib/db/gist';

export async function post({ locals, body }) {
	const { user } = locals;
	if (!user) return; // response already sent

	try {
		const result = await gist.create(user, body);

		// normalize id
		result.id = result.id.replace(/-/g, '');

		return {
			status: 201,
			body: result
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
