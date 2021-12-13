import { client } from './client.js';

/** @typedef {import('./types').UserID} UserID */
/** @typedef {import('./types').Gist} Gist */

const PAGE_SIZE = 100;

export async function list(user, offset) {
	const { data, error } = await client
		.from('gist')
		.select('id,name,created_at,updated_at')
		.eq('githubid', user.githubid)
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
}

/**
 * @param {User} user
 * @param {Pick<Gist, 'name'|'files'>} gist
 * @returns {Gist}
 */
export async function create(user, gist) {
	console.log(user, gist);

	const { data, error } = await client.rpc('gist_create', {
		name: gist.name,
		files: gist.files,
		githubid: user.githubid
	});

	if (error) {
		throw new Error(error.message);
	}

	return data;
}

/**
 * @param {string} id
 * @returns {Gist}
 */
export async function read(id) {
	const { data, error } = await client
		.from('gist')
		.select('id,name,files,githubid')
		.eq('id', id);

	if (error) throw new Error(error.message);
	return data[0];
}

/**
 * @param {User} user
 * @param {string} gistid
 * @param {Pick<Gist, 'name'|'files'>} gist
 * @returns {Gist}
 */
export async function update(user, gistid, gist) {
	const { data, error } = await client.rpc('gist_update', {
		gist_id: gistid,
		gist_name: gist.name,
		gist_files: gist.files,
		gist_userid: user.githubid
	});

	if (error) {
		throw new Error(error.message);
	}

	return data;
}

/**
 * @param {User} user
 * @param {Gist} gist
 * @returns {void}
 */
export async function destroy(user, gist) {
	const { error } = await client.rpc('gist_destroy', {
		gist_id: gist.id,
		gist_userid: user.githubid
	});

	if (error) {
		throw new Error(error.message);
	}
}
