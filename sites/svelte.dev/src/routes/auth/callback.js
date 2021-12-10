import devalue from 'devalue';
import * as cookie from 'cookie';
import { stringify } from 'querystring';
import { session } from '$lib/db';
import { oauth, client_id, client_secret } from './_config.js';

export async function get({ host, query }) {
	try {
		// Trade "code" for "access_token"
		const r1 = await fetch(
			`${oauth}/access_token?` +
				stringify({
					code: query.get('code'),
					client_id,
					client_secret
				})
		);
		const access_token = new URLSearchParams(await r1.text()).get('access_token');

		// Now fetch User details
		const r2 = await fetch('https://api.github.com/user', {
			headers: {
				'User-Agent': 'svelte.dev',
				Authorization: `token ${access_token}`
			}
		});

		const profile = await r2.json();

		// Create or update user in database, and create a session

		const user = {
			id: String(profile.id), // stringifying makes life easier when we use it as a URL parameter
			name: profile.name,
			username: profile.login,
			avatar: profile.avatar_url
		};

		const { sessionid, expires } = await session.create(user, access_token);

		return {
			headers: {
				'Set-Cookie': cookie.serialize('sid', sessionid, {
					expires: new Date(expires),
					path: '/',
					httpOnly: true,
					secure: !host.startsWith('localhost:')
				}),
				'Content-Type': 'text/html; charset=utf-8'
			},
			body: `
			<script>
				window.opener.postMessage({
					user: ${devalue(user)}
				}, window.location.origin);
			</script>
			`
		};
	} catch (err) {
		console.error('GET /auth/callback', err);
		return {
			status: 500,
			body: err.data
		};
	}
}
