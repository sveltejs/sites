import flru from 'flru';
import { API_BASE } from '../_env';

const headers = {
	authorization: `Basic ${process.env['SECRET']}`,
	'content-type': 'application/json'
};

const session_cache = flru(1000);

export const create_session = async (user, access_token) => {
	const res = await fetch(`${API_BASE}/session`, {
		method: 'POST',
		headers,
		body: JSON.stringify({
			...user,
			token: access_token
		})
	});

	if (res.ok) {
		const session = await res.json();

		session_cache.set(session.sessionid, user);
		return session;
	}

	throw new Error('Error creating session');
};

export const delete_session = async sessionid => {
	const res = await fetch(`${API_BASE}/session/${sessionid}`, {
		method: 'DELETE',
		headers
	});

	if (res.ok) {
		session_cache.set(sessionid, null);
		return true;
	}

	throw new Error('Error deleting session');
};

export const get_user = async sessionid => {
	if (!sessionid) return null;

	if (session_cache.get(sessionid)) {
		session_cache.set(
			sessionid,
			fetch(`${API_BASE}/session/${sessionid}`, { headers })
				.then(r => r.json())
				.then(({ user }) => user)
				.catch(() => {
					session_cache.set(sessionid, null);
				})
		);
	}

	return await session_cache.get(sessionid);
};
