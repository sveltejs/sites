<script context="module">
	import { API_BASE } from '$lib/env';

	export async function load({ fetch, params }) {
		const res = await fetch(`${API_BASE}/docs/svelte/blog/${params.slug}`);

		if (!res.ok) return { status: 404, error: 'That post could not be found' };

		const data = await res.json();
		if (!data.draft) return { props: { post: data } };
		return { status: 404, error: 'That post could not be found' };
	}
</script>

<script>
	import '@sveltejs/site-kit/code.css';

	export let post;
</script>

<svelte:head>
	<title>{post.title}</title>

	<meta name="twitter:title" content={post.title} />
	<meta name="twitter:description" content={post.description} />
	<meta name="Description" content={post.description} />
</svelte:head>

<article class="post listify">
	<h1>{post.title}</h1>
	<p class="standfirst">{post.description}</p>

	<p class="byline">
		<a href={post.author.url}>{post.author.name}</a>
		<time datetime={post.date.numeric}>{post.date.pretty}</time>
	</p>

	{@html post.content}
</article>

<style>
	.post {
		padding-inline: var(--side-nav);
		padding-block: var(--top-offset) 6rem;
		max-inline-size: var(--main-width);
		margin-inline: auto;
		margin-block: 0;
	}

	h1 {
		font-size: 4rem;
		font-weight: 400;
	}

	.standfirst {
		font-size: var(--h4);
		color: var(--second);
		margin: 0;
		margin-block-end: 1em;
	}

	.byline {
		margin: 0;
		margin-block-end: 6rem;
		padding-block-start: 1.6rem;
		border-block-start: var(--border-w) solid #6767785b;
		font-size: var(--h6);
		text-transform: uppercase;
	}

	.post h1 {
		color: var(--second);
		max-inline-size: 20em;
		margin: 0;
		margin-block-end: 0.8rem;
	}

	.post :global(h2) {
		margin-block: 2em 0.5em;
		/* color: var(--second); */
		color: var(--text);
		font-size: var(--h3);
		font-weight: 300;
	}

	.post :global(figure) {
		margin-block: 1.6rem 3.2rem;
	}

	.post :global(figure) :global(img) {
		max-inline-size: 100%;
	}

	.post :global(figcaption) {
		color: var(--second);
		text-align: left;
	}

	.post :global(video) {
		inline-size: 100%;
	}

	.post :global(blockquote) {
		max-inline-size: none;
		border-inline-start: 4px solid #eee;
		background: #f9f9f9;
		border-radius: 0 var(--border-r) var(--border-r) 0;
	}

	.post :global(code) {
		padding: 0.3rem 0.8rem 0.3rem;
		margin-inline: 0.2rem;
		margin-block: 0;
		inset-block-start: -0.1rem;
		background: var(--back-api);
	}

	.post :global(pre) :global(code) {
		padding: 0;
		margin: 0;
		inset-block-start: 0;
		background: transparent;
	}

	.post :global(aside) {
		float: right;
		margin-inline: 1em 0;
		margin-block: 0 1em;
		inline-size: 16rem;
		color: var(--second);
		z-index: 2;
	}

	.post :global(.max) {
		inline-size: 100%;
	}

	.post :global(iframe) {
		inline-size: 100%;
		block-size: 420px;
		margin-block: 2em;
		border-radius: var(--border-r);
		border: 0.8rem solid var(--second);
	}

	.post :global(.anchor) {
		inset-block-start: calc((var(--h3) - 24px) / 2);
	}

	.post :global(a) {
		padding: 0;
		transition: none;
	}

	.post :global(a):not(:hover) {
		border: none;
	}

	@media (max-width: 768px) {
		.post :global(.anchor) {
			transform: scale(0.6);
			opacity: 1;
			inset-inline-start: -1em;
		}
	}

	@media (min-width: 910px) {
		.post :global(.max) {
			inline-size: calc(100vw - 2 * var(--side-nav));
			margin-inline: calc(var(--main-width) / 2 - 50vw);
			text-align: center;
		}

		.post :global(.max) > :global(*) {
			inline-size: 100%;
			max-inline-size: 1200px;
		}

		.post :global(iframe) {
			inline-size: 100%;
			max-inline-size: 1100px;
			margin-inline: auto;
			margin-block: 2em;
		}
	}
</style>
