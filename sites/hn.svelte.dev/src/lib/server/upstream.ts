export const FIREBASE = {
	name: 'Firebase',
	base: 'https://hacker-news.firebaseio.com/v0/'
} as const;

export const ALGOLIA = {
	name: 'Algolia',
	base: 'https://hn.algolia.com/api/v1/'
} as const;

export type UpstreamService = typeof FIREBASE.name | typeof ALGOLIA.name;

const services = [FIREBASE, ALGOLIA];

const serviceByOrigin = new Map<string, UpstreamService>(
	services.map((service) => [new URL(service.base).origin, service.name])
);

export function getUpstreamService(url: string): UpstreamService | undefined {
	return serviceByOrigin.get(new URL(url).origin);
}

type UpstreamFailure =
	{ stage: 'fetch' | 'body' | 'json' } | { stage: 'timeout'; timeoutMs: number };

type ConnectionFailureCode = 'ECONNRESET' | 'UND_ERR_CONNECT_TIMEOUT';

function getConnectionFailureCode(cause: unknown): ConnectionFailureCode | undefined {
	const seen = new Set<object>();

	while (typeof cause === 'object' && cause !== null && !seen.has(cause)) {
		seen.add(cause);

		if ('code' in cause) {
			switch (cause.code) {
				case 'ECONNRESET':
				case 'UND_ERR_CONNECT_TIMEOUT':
					return cause.code;
			}
		}

		cause = 'cause' in cause ? cause.cause : undefined;
	}

	return undefined;
}

function connectionFailureDetail(cause: unknown): string | undefined {
	switch (getConnectionFailureCode(cause)) {
		case 'ECONNRESET':
			return 'connection reset (ECONNRESET)';

		case 'UND_ERR_CONNECT_TIMEOUT':
			return 'connection timed out (UND_ERR_CONNECT_TIMEOUT)';

		default:
			return undefined;
	}
}

function formatFailure(service: UpstreamService, failure: UpstreamFailure, cause: unknown): string {
	switch (failure.stage) {
		case 'fetch':
		case 'body': {
			const message =
				failure.stage === 'fetch'
					? `Unable to fetch data from ${service}`
					: `Unable to read the response body from ${service}`;

			const detail = connectionFailureDetail(cause);

			return detail === undefined ? `${message}.` : `${message}: ${detail}.`;
		}

		case 'json':
			return `${service} returned invalid JSON.`;

		case 'timeout':
			return `Loading data from ${service} exceeded the ${failure.timeoutMs / 1_000}-second timeout.`;
	}
}

export class UpstreamError extends Error {
	constructor(
		readonly service: UpstreamService,
		readonly failure: UpstreamFailure,
		options?: ErrorOptions
	) {
		super(formatFailure(service, failure, options?.cause), options);
		this.name = 'UpstreamError';
	}
}

export function upstreamMessage(cause: unknown): string | undefined {
	return cause instanceof UpstreamError ? cause.message : undefined;
}

export function upstreamHttpMessage(service: UpstreamService, status: number): string {
	return `${service} returned HTTP ${status}.`;
}

export async function readUpstreamJson(
	response: Response,
	service: UpstreamService
): Promise<unknown> {
	try {
		return await response.json();
	} catch (cause) {
		throw new UpstreamError(
			service,
			{ stage: cause instanceof SyntaxError ? 'json' : 'body' },
			{ cause }
		);
	}
}
