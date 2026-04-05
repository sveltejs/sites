<script>
	import { resolve } from '$app/paths';
	import SubsetHTML from '$lib/SubsetHTML.svelte';
	import { timeAgo } from '$lib/utils';
	import CommentElement from './Comment.svelte';

	/** @type {import('./$types').PageProps} */
	const { data } = $props();
</script>

<svelte:head>
	<title>{data.title} | Svelte Hacker News</title>
</svelte:head>

<div>
	<article class="item">
		<a class="main-link" rel="external" href={data.url}>
			<h1>{data.title}</h1>
			{#if data.url}<small>{new URL(data.url).hostname}</small>{/if}
		</a>

		<p class="meta">
			{data.score} points by <a href={resolve('/user/[name]', { name: data.by })}>{data.by}</a>
			{data.time ? timeAgo(data.time) : 'Some time ago'}
		</p>

		{#if data.text}
			<SubsetHTML content={data.text} />
		{/if}
		{#if data.parts}
			<!-- Poll parts -->
			{#each data.parts as partId (partId)}
				{#await fetch(`https://hacker-news.firebaseio.com/v0/item/${partId}.json`).then((res) => /** @type {Promise<HNPollOption>} */ (res.json())) then pollOption}
					<SubsetHTML content={pollOption.text} />
					<small>{pollOption.score} points</small>
				{/await}
			{/each}
		{/if}
	</article>

	{#if data.kids && data.kids.length > 0}
		<div class="comments">
			{#each data.kids as commentId (commentId)}
				{#await fetch(`https://hacker-news.firebaseio.com/v0/item/${commentId}.json`).then((res) => /** @type {Promise<HNComment>} */ (res.json())) then comment}
					<CommentElement {comment} />
				{/await}
			{/each}
		</div>
	{/if}
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
