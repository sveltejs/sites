import * as gist from '$lib/db/gist';

export async function GET({ url, locals }) {
	const query = url.searchParams;
	if (locals.user) {
		const offset = query.get('offset') ? parseInt(query.get('offset')) : 0;
		const search = query.get('search');

		return new Response(await gist.list(locals.user, { offset, search }));
	} else {
		return new Response(undefined, { status: 401 });
	}
}
