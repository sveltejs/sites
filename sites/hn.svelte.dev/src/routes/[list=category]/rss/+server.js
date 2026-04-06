/**
 * @param {string} list
 * @param {(HNStory | HNJob | HNPoll | { type: 'null', id: number })[]} items
 */
const render = (list, items) => `<?xml version="1.0" encoding="UTF-8" ?>
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

const BASE = 'https://hacker-news.firebaseio.com/v0/';
const ITEMS_PER_PAGE = 30;

/** @satisfies {import('./$types').RequestHandler} */
export async function GET({ params, fetch }) {
	const list = params.list === 'jobs' ? 'job' : params.list;
	/**
	 * 500 top/new/best, or 200 ask/show/job
	 * @type {number[]}
	 **/
	const itemIds = await fetch(`${BASE}${list}stories.json`).then((r) => r.json());
	const relevantItemIds = itemIds.slice(0, ITEMS_PER_PAGE);
	/** @type {(HNStory | HNJob | HNPoll | { type: 'null', id: number })[]} */
	const items = await Promise.all(
		relevantItemIds.map((id) =>
			fetch(`${BASE}item/${id}.json`).then((res) => res.json() ?? { type: 'null', id })
		)
	);

	const feed = render(list, items);

	return new Response(feed, {
		headers: {
			'Cache-Control': `max-age=0, s-max-age=${600}`, // 10 minutes
			'Content-Type': 'application/rss+xml'
		}
	});
}
