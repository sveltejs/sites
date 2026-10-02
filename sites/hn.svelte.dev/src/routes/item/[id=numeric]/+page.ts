import { getItem } from '#lib/item.remote.js';
import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
	const { algoliaItem, pollOptions } = await getItem(params.id);

	const now = Date.now() / 1000;
	return { algoliaItem, pollOptions, now };
}) satisfies PageLoad;
