import { dev } from '$app/env';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (() => {
	throw redirect(dev ? 302 : 301, '/top/1');
}) satisfies PageLoad;
