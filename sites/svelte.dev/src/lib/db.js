import flru from 'flru';
import { API_BASE } from '../_env';

/** @typedef {number} UserID */
/** @typedef {{ id: UserID; name: string; username: string; avatar: string }} User */
/** @typedef {{ uid: number; name: string; owner: UserID; files: Array<{ name: string, type: string, source: string }> }} Gist */

const session_cache = flru(1000);

async function api(method, endpoint, body) {
	const res = await fetch(`${API_BASE}/${endpoint}`, {
		method,
		headers: {
			authorization: `Basic ${process.env['SECRET']}`,
			'content-type': 'application/json'
		},
		body: body && JSON.stringify(body)
	});

	if (res.ok) {
		return res.status === 200 || res.status === 201 ? await res.json() : null;
	}

	const { message } = await res.json();
	const error = new Error(message);
	error.statusCode = res.status;

	return error;
}

export const gists = {
	/**
	 * @param {User} user
	 * @param {Pick<Gist, 'name'|'files'>} gist
	 * @returns {Gist}
	 */
	create: (user, gist) => api('POST', `gists?userid=${user.id}`, gist),

	/**
	 * @param {string} gistid
	 * @returns {Gist}
	 */
	read: gistid => api('GET', `gists/${gistid}`),

	/**
	 * @param {User} user
	 * @param {string} gistid
	 * @param {Pick<Gist, 'name'|'files'>} gist
	 * @returns {Gist}
	 */
	update: (user, gistid, gist) => api('PUT', `gists/${gistid}?userid=${user.id}`, gist),

	/**
	 * @param {User} user
	 * @param {Gist} gist
	 * @returns {void}
	 */
	destroy: (user, gist) => api('DELETE', `gists/${gist.uid}?userid=${user.id}`)
};

export const session = {
	/**
	 * @param {User} user
	 * @param {string} access_token
	 */
	create: async (user, access_token) => {
		const session = await api('POST', 'session', {
			...user,
			token: access_token
		});

		session_cache.set(session.sessionid, user);
		return session;
	},

	/**
	 * @param {string} sessionid
	 * @returns {Promise<User>}
	 */
	read: async sessionid => {
		if (!sessionid) return null;

		if (session_cache.get(sessionid)) {
			session_cache.set(
				sessionid,
				api('GET', `session/${sessionid}`)
					.then(({ user }) => user)
					.catch(() => {
						session_cache.set(sessionid, null);
					})
			);
		}

		return await session_cache.get(sessionid);
	},

	/** @param {string} sessionid */
	destroy: async sessionid => {
		await api('DELETE', `session/${sessionid}`);
		session_cache.set(sessionid, null);
	}
};
