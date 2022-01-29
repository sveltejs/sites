<script context="module">
	import { API_BASE } from '$lib/env';

	export async function load({ fetch }) {
		const res = await fetch(`${API_BASE}/docs/svelte/blog`);

		if (res.ok) {
			return { props: { posts: await res.json() } };
		}
	}
</script>

<script>
	export let posts;
</script>

<svelte:head>
	<title>Blog • Svelte</title>
	<link
		rel="alternate"
		type="application/rss+xml"
		title="Svelte blog"
		href="https://svelte.dev/blog/rss.xml"
	/>

	<meta name="twitter:title" content="Svelte blog" />
	<meta name="twitter:description" content="Articles about Svelte and UI development" />
	<meta name="Description" content="Articles about Svelte and UI development" />
</svelte:head>

<h1 class="visually-hidden">Blog</h1>
<div class="posts stretch">
	{#each posts as post}
		{#if !post.draft}
			<article class="post" data-pubdate={post.date.numeric}>
				<a
					class="no-underline"
					sveltekit:prefetch
					href="/blog/{post.slug}"
					title="Read the article »"
				>
					<h2>{post.title}</h2>
					<p>{post.description}</p>
				</a>
			</article>
		{/if}
	{/each}
</div>

<style>
	.posts {
		grid-template-columns: 1fr 1fr;
		grid-gap: 1em;
		min-block-size: calc(100vh - var(--nav-h));
		padding-inline: var(--side-nav);
		padding-block: var(--top-offset) 6rem;
		max-inline-size: var(--main-width);
		margin-inline: auto;
		margin-block: 0;
	}

	h2 {
		display: inline-block;
		margin-block: 3.2rem 0.4rem;
		color: var(--text);
		max-inline-size: 18em;
		font-size: var(--h3);
		font-weight: 400;
	}

	.post:first-child {
		margin-block-end: 2rem;
		padding-block-end: 4rem;
		border-block-end: var(--border-w) solid #6767785b; /* based on --second */
	}

	.post:first-child h2 {
		font-size: 4rem;
		font-weight: 400;
		color: var(--second);
	}

	.post:first-child::before,
	.post:nth-child(2)::before {
		content: 'Latest post • ' attr(data-pubdate);
		color: var(--flash);
		font-size: var(--h6);
		font-weight: 400;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.post:nth-child(2)::before {
		content: 'Older posts';
	}

	.post p {
		font-size: var(--h5);
		max-inline-size: 30em;
		color: var(--second);
	}

	.post > a {
		display: block;
	}

	.posts a:hover,
	.posts a:hover > h2 {
		color: var(--flash);
	}
</style>
