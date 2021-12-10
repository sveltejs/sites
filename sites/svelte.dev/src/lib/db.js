import flru from 'flru';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env['SUPABASE_URL'];
const SUPABASE_KEY = process.env['SUPABASE_KEY'];
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { fetch });

/** @typedef {number} UserID */
/** @typedef {{ id: UserID; name: string; username: string; avatar: string }} User */
/** @typedef {{ uid: number; name: string; owner: UserID; files: Array<{ name: string, type: string, source: string }> }} Gist */

const session_cache = flru(1000);
const PAGE_SIZE = 100;

export const gists = {
	list: async (user, offset) => {
		const { data, error } = await supabase
			.from('gist')
			.select('id,name,created_at,updated_at')
			.eq('userid', user.userid)
			.order('updated_at', { ascending: false })
			.range(offset, offset + PAGE_SIZE + 1);

		if (error) throw new Error(error.message);

		// normalize IDs
		data.forEach(gist => {
			gist.id = gist.id.replace(/-/g, '');
		});

		return {
			gists: data.slice(0, PAGE_SIZE),
			next: data.length > PAGE_SIZE ? offset + PAGE_SIZE : null
		};
	},

	/**
	 * @param {User} user
	 * @param {Pick<Gist, 'name'|'files'>} gist
	 * @returns {Gist}
	 */
	create: async (user, gist) => {
		const { data, error } = await supabase.rpc('gist_create', {
			name: gist.name,
			files: gist.files,
			userid: user.userid
		});

		if (error) {
			throw new Error(error.message);
		}

		return data;
	},

	/**
	 * @param {string} id
	 * @returns {Gist}
	 */
	read: async id => {
		const { data, error } = await supabase
			.from('gist')
			.select('id,name,files,userid')
			.eq('id', id);

		if (error) throw new Error(error.message);
		return data[0];
	},

	/**
	 * @param {User} user
	 * @param {string} gistid
	 * @param {Pick<Gist, 'name'|'files'>} gist
	 * @returns {Gist}
	 */
	update: async (user, gistid, gist) => {
		const { data, error } = await supabase.rpc('gist_update', {
			gist_id: gistid,
			gist_name: gist.name,
			gist_files: gist.files,
			gist_userid: user.userid
		});

		if (error) {
			throw new Error(error.message);
		}

		return data;
	},

	/**
	 * @param {User} user
	 * @param {Gist} gist
	 * @returns {void}
	 */
	destroy: async (user, gist) => {
		const { error } = await supabase.rpc('gist_destroy', {
			gist_id,
			gist_userid
		});

		if (error) {
			throw new Error(error.message);
		}

		session_cache.set(sessionid, null);
	}
};

export const session = {
	/**
	 * @param {User} user
	 * @param {string} access_token
	 */
	create: async (user, access_token) => {
		const { data, error } = await supabase.rpc('login', {
			user_id: user.id,
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
	},

	/**
	 * @param {string} sessionid
	 * @returns {Promise<User>}
	 */
	read: async sessionid => {
		if (!sessionid) return null;

		if (!session_cache.get(sessionid)) {
			session_cache.set(
				sessionid,
				supabase
					.rpc('get_user', { sessionid })
					.then(({ data, error }) => {
						if (error) {
							throw new Error(error.message);
						}

						return data;
					})
					.catch(() => {
						session_cache.set(sessionid, null);
					})
			);
		}

		return await session_cache.get(sessionid);
	},

	/** @param {string} sessionid */
	destroy: async sessionid => {
		const { error } = await supabase.rpc('logout', { sessionid });

		if (error) {
			throw new Error(error.message);
		}

		session_cache.set(sessionid, null);
	}
};
