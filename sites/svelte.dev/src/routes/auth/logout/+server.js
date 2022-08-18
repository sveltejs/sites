import * as cookie from 'cookie';
import * as session from '$lib/db/session';

export async function GET(request) {
	await session.destroy(request.locals.cookies.sid);

	return {
		headers: {
			'Set-Cookie': cookie.serialize('sid', '', {
				maxAge: -1,
				path: '/',
				httpOnly: true,
				secure: request.url.protocol === 'https'
			})
		}
	};
}
