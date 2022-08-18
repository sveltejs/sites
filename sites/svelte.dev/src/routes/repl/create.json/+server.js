import { json } from '@sveltejs/kit';
import * as gist from '$lib/db/gist';

export async function POST({ locals, request }) {
	const { user } = locals;
	if (!user) return; // response already sent

	try {
		const body = await request.json();
		const result = await gist.create(user, body);

		// normalize id
		result.id = result.id.replace(/-/g, '');

		return json(result, {
			status: 201
		});
	} catch (err) {
		return json({
			error: err.message
		}, {
			status: 500
		});
	}
}
