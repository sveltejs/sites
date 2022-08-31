<script>
	import Comment from './Comment.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<svelte:head>
	<title>{data.title} | Svelte Hacker News</title>
</svelte:head>

<div>
	<article class="item">
		<a class="main-link" href={data.url}>
			<h1>{data.title}</h1>
			{#if data.domain}<small>{data.domain}</small>{/if}
		</a>

		<p class="meta">
			{data.points} points by <a href="/user/{data.user}">{data.user}</a>
			{data.time_ago}
		</p>

		{#if data.content}
			{@html data.content}
		{/if}
	</article>

	<div class="comments">
		{#each data.comments as comment}
			<Comment {comment} />
		{/each}
	</div>
</div>

<style>
	h1 {
		font-weight: 500;
	}

	.item {
		border-bottom: 1em solid rgba(0, 0, 0, 0.1);
		margin: 0 -2em 2em -2em;
		padding: 0 2em 2em 2em;
	}

	:global(html.dark) .item {
		border-bottom: 1em solid rgba(255, 255, 255, 0.1);
	}

	.main-link {
		display: block;
		text-decoration: none;
	}

	small {
		display: block;
		font-size: 14px;
	}

	.meta {
		font-size: 0.8em;
		font-weight: 300;
		color: var(--fg-light);
	}

	.comments > :global(.comment):first-child {
		border-top: none;
	}
</style>
