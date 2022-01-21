// need to do this first before importing database, etc.
import dotenv from 'dotenv';
dotenv.config();

import * as cookie from 'cookie';
import * as session from '$lib/db/session';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	event.locals.cookies = cookie.parse(event.request.headers.get('cookie') || '');
	event.locals.user = await session.read(event.locals.cookies.sid);

	return await resolve(event);
}

/** @type {import('@sveltejs/kit').GetSession} */
export function getSession(event) {
	return {
		user: event.locals.user
	};
}
