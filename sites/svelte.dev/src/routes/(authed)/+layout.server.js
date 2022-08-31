import * as cookie from 'cookie';
import * as session from '$lib/db/session';

export async function load({ request }) {
	const cookies = cookie.parse(request.headers.get('cookie') || '');

	return {
		user: await session.read(cookies.sid)
	};
}
