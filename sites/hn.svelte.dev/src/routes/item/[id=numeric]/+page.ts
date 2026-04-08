import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { ResponseType } from './api/+server';

export const load = (async ({ params, fetch }) => {
	const res = await fetch(`/item/${params.id}/api`);
	if (!res.ok) error(res.status, res.statusText);
	const { algoliaItem, pollOptions }: ResponseType = await res.json();

	const now = Date.now() / 1000;
	return { algoliaItem, pollOptions, now };
}) satisfies PageLoad;
