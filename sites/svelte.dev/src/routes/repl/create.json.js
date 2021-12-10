import { gists } from '$lib/db';

export async function post({ locals, body }) {
	const { user } = locals;
	if (!user) return; // response already sent

	try {
		const gist = await gists.create(user, body);

		// normalize id
		gist.id = gist.id.replace(/-/g, '');

		return {
			status: 201,
			body: gist
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
