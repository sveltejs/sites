import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { ResponseType } from '../[page=numeric]/api/+server';

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
		.map(
			(item) => `
				<item>
					<title>${item.title}${item.type !== 'poll' ? ` (${new URL(item.url).hostname})` : ''}</title>
					<link>https://hn.svelte.dev/item/${item.id}</link>
					<description><![CDATA[${
						item.type !== 'poll' ? `<a href="${item.url}">link</a> / ` : ''
					}<a href="https://hn.svelte.dev/item/${item.id}">comments</a>
					]]></description>
					<pubDate>${new Date(item.time * 1000).toUTCString()}</pubDate>
				</item>
			`
		)
		.join('\n')}
</channel>
</rss>`;

export const GET = (async ({ params, fetch }) => {
	const res = await fetch(`/${params.list}/1/api`);
	if (!res.ok) error(res.status, res.statusText);
	const items: ResponseType = await res.json();
	const { list } = params;

	const feed = render(list, items);

	return new Response(feed, {
		headers: {
			'Cache-Control': `max-age=0, s-max-age=${600}`, // 10 minutes
			'Content-Type': 'application/rss+xml'
		}
	});
}) satisfies RequestHandler;
