import { dev } from '$app/env';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (() => {
	redirect(dev ? 301 : 302, '/top/rss');
}) satisfies RequestHandler;
