import * as cookie from 'cookie';
import { session } from '$lib/db';

export async function get(request) {
	await session.destroy(request.locals.cookies.sid);

	return {
		headers: {
			'Set-Cookie': cookie.serialize('sid', '', {
				maxAge: -1,
				path: '/',
				httpOnly: true,
				secure: !request.host.startsWith('localhost:')
			})
		}
	};
}
