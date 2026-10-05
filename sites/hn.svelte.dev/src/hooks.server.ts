import type { HandleFetch, HandleServerError } from '@sveltejs/kit/hooks';
import { getUpstreamService, UpstreamError, upstreamMessage } from '#lib/server/upstream.js';

export const handleFetch: HandleFetch = async ({ request, fetch }) => {
	const service = getUpstreamService(request.url);

	if (!service) return fetch(request);

	try {
		return await fetch(request);
	} catch (cause) {
		if (request.signal.aborted) {
			throw request.signal.reason;
		}

		if (cause instanceof UpstreamError) throw cause;

		throw new UpstreamError(service, { stage: 'fetch' }, { cause });
	}
};

export const handleError: HandleServerError = ({ kind, error }) => {
	if (kind !== 'unknown') return;

	console.error(error);

	const message = upstreamMessage(error);
	if (message !== undefined) {
		return { message };
	}
};
