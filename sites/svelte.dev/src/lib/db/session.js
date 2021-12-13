import flru from 'flru';
import { client } from './client.js';

const session_cache = flru(1000);

/** @typedef {import('./types').User} User */

/**
 * @param {User} user
 * @param {string} access_token
 */
export async function create(user, access_token) {
	const { data, error } = await client.rpc('login', {
		user_githubid: user.githubid,
		user_name: user.name,
		user_username: user.username,
		user_avatar: user.avatar,
		user_token: access_token
	});

	if (error) {
		throw new Error(error.message);
	}

	session_cache.set(data.sessionid, user);

	return {
		sessionid: data.sessionid,
		expires: new Date(data.expires)
	};
}

/**
 * @param {string} sessionid
 * @returns {Promise<User>}
 */
export async function read(sessionid) {
	if (!sessionid) return null;

	if (!session_cache.get(sessionid)) {
		session_cache.set(
			sessionid,
			client
				.rpc('get_user', { sessionid })
				.then(({ data, error }) => {
					if (error) {
						throw new Error(error.message);
					}

					return data.githubid && data;
				})
				.catch(() => {
					session_cache.set(sessionid, null);
				})
		);
	}

	return await session_cache.get(sessionid);
}

/** @param {string} sessionid */
export async function destroy(sessionid) {
	const { error } = await client.rpc('logout', { sessionid });

	if (error) {
		throw new Error(error.message);
	}

	session_cache.set(sessionid, null);
}
