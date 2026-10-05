import { fetchList } from '#lib/server/list.js';
import type { RequestHandler } from './$types';

function externalUrl(value: string | undefined): URL | undefined {
	if (!value) return undefined;

	try {
		const url = new URL(value);
		return url.protocol === 'http:' || url.protocol === 'https:' ? url : undefined;
	} catch {
		return undefined;
	}
}

function escapeXml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}

const render = (
	list: string,
	items: (HNStory | HNJob | HNPoll | { type: 'null'; id: number })[]
) => `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
	<title>Svelte HN (${list})</title>
	<link>https://hn.svelte.dev/${list}/1</link>
	<description>Links from the orange site</description>
	<image>
		<url>https://hn.svelte.dev/favicon.png</url>
		<title>Svelte HN (${list})</title>
		<link>https://hn.svelte.dev/${list}/1</link>
	</image>
	${items
		.filter((item) => item.type !== 'null')
		.map((item) => {
			const url = externalUrl(item.type === 'poll' ? undefined : item.url);
			const title = `${item.title}${url ? ` (${url.hostname})` : ''}`;

			return `
				<item>
					<title>${escapeXml(title)}</title>
					<link>https://hn.svelte.dev/item/${item.id}</link>
					<description><![CDATA[${
						url ? `<a href="${escapeXml(url.href)}">link</a> / ` : ''
					}<a href="https://hn.svelte.dev/item/${item.id}">comments</a>
					]]></description>
					<pubDate>${new Date(item.time * 1000).toUTCString()}</pubDate>
				</item>
			`;
		})
		.join('\n')}
</channel>
</rss>`;

export const GET = (async ({ params, fetch }) => {
	const { list } = params;
	const items = await fetchList(fetch, list, '1');

	const feed = render(list, items);

	return new Response(feed, {
		headers: {
			'Cache-Control': `max-age=0, s-max-age=${600}`, // 10 minutes
			'Content-Type': 'application/rss+xml'
		}
	});
}) satisfies RequestHandler;
