import { getRequestEvent, query } from '$app/server';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';
import { FIREBASE, readUpstreamJson, upstreamHttpMessage } from '#lib/server/upstream.js';

export const getUser = query(v.pipe(v.string(), v.minLength(1)), async (name): Promise<HNUser> => {
	const { fetch } = getRequestEvent();

	const res = await fetch(`${FIREBASE.base}user/${encodeURIComponent(name)}.json`);

	if (!res.ok) {
		error(res.status, upstreamHttpMessage(FIREBASE.name, res.status));
	}

	return (await readUpstreamJson(res, FIREBASE.name)) as HNUser;
});
