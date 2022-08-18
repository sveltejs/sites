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
		padding: var(--top-offset) var(--side-nav) 6rem var(--side-nav);
		max-width: var(--main-width);
		margin: 0 auto;
	}

	h1 {
		font-size: 4rem;
		font-weight: 400;
	}

	.standfirst {
		font-size: var(--h4);
		color: var(--second);
		margin: 0 0 1em 0;
	}

	.byline {
		margin: 0 0 6rem 0;
		padding: 1.6rem 0 0 0;
		border-top: var(--border-w) solid #6767785b;
		font-size: var(--h6);
		text-transform: uppercase;
	}

	.post h1 {
		color: var(--second);
		max-width: 20em;
		margin: 0 0 0.8rem 0;
	}

	.post :global(h2) {
		margin: 2em 0 0.5em 0;
		/* color: var(--second); */
		color: var(--text);
		font-size: var(--h3);
		font-weight: 300;
	}

	.post :global(figure) {
		margin: 1.6rem 0 3.2rem 0;
	}

	.post :global(figure) :global(img) {
		max-width: 100%;
	}

	.post :global(figcaption) {
		color: var(--second);
		text-align: left;
	}

	.post :global(video) {
		width: 100%;
	}

	.post :global(blockquote) {
		max-width: none;
		border-left: 4px solid #eee;
		background: #f9f9f9;
		border-radius: 0 var(--border-r) var(--border-r) 0;
	}

	.post :global(code) {
		padding: 0.3rem 0.8rem 0.3rem;
		margin: 0 0.2rem;
		top: -0.1rem;
		background: var(--back-api);
	}

	.post :global(pre) :global(code) {
		padding: 0;
		margin: 0;
		top: 0;
		background: transparent;
	}

	.post :global(aside) {
		float: right;
		margin: 0 0 1em 1em;
		width: 16rem;
		color: var(--second);
		z-index: 2;
	}

	.post :global(.max) {
		width: 100%;
	}

	.post :global(iframe) {
		width: 100%;
		height: 420px;
		margin: 2em 0;
		border-radius: var(--border-r);
		border: 0.8rem solid var(--second);
	}

	.post :global(.anchor) {
		top: calc((var(--h3) - 24px) / 2);
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
			left: -1em;
		}
	}

	@media (min-width: 910px) {
		.post :global(.max) {
			width: calc(100vw - 2 * var(--side-nav));
			margin: 0 calc(var(--main-width) / 2 - 50vw);
			text-align: center;
		}

		.post :global(.max) > :global(*) {
			width: 100%;
			max-width: 1200px;
		}

		.post :global(iframe) {
			width: 100%;
			max-width: 1100px;
			margin: 2em auto;
		}
	}
</style>
