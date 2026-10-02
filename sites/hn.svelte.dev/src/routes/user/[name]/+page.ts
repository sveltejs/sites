import { getUser } from '#lib/user.remote.js';
import type { PageLoad } from './$types.js';

export const csr = false;

export const load = (async ({ params }) => {
	const user = await getUser(params.name);
	const now = Date.now() / 1000;
	return { user, now };
}) satisfies PageLoad;
