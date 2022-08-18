import * as gist from '$lib/db/gist';

export async function POST({ locals, request }) {
	if (!locals.user) return new Response(undefined, { status: 401 });

	const body = await request.json();
	await gist.destroy(locals.user.id, body.ids);

	return new Response(undefined, { status: 204 });
}
