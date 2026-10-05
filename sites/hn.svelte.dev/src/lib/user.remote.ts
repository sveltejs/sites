import { getRequestEvent, query } from '$app/server';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

const FIREBASE_BASE = 'https://hacker-news.firebaseio.com/v0/' as const;

export const getUser = query(v.pipe(v.string(), v.minLength(1)), async (name): Promise<HNUser> => {
	const { fetch } = getRequestEvent();

	const res = await fetch(`${FIREBASE_BASE}user/${encodeURIComponent(name)}.json`);
	if (!res.ok) error(res.status, `Upstream Responded with ${res.statusText}`);

	return await res.json();
});
