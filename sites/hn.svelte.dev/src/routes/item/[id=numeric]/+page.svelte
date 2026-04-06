<script>
	import { resolve } from '$app/paths';
	import SubsetHTML from '$lib/SubsetHTML.svelte';
	import { timeAgo } from '$lib/utils';
	import CommentElement from './Comment.svelte';

	/** @type {import('./$types').PageProps} */
	const { data } = $props();
	const { algoliaItem, pollOptions } = $derived(data);
</script>

<svelte:head>
	<title>{algoliaItem.title} | Svelte Hacker News</title>
</svelte:head>

<div>
	<article class="item">
		<a class="main-link" rel="external" href={algoliaItem.url}>
			<h1>{algoliaItem.title}</h1>
			{#if algoliaItem.url}<small>{new URL(algoliaItem.url).hostname}</small>{/if}
		</a>

		<p class="meta">
			{algoliaItem.points}
			{algoliaItem.points === 1 ? 'point' : 'points'} by
			<a href={resolve('/user/[name]', { name: algoliaItem.author })}>{algoliaItem.author}</a>
			{algoliaItem.created_at_i ? timeAgo(algoliaItem.created_at_i) : 'Some time ago'}
		</p>

		{#if algoliaItem.text}
			<SubsetHTML content={algoliaItem.text} />
		{/if}
		{#if algoliaItem.options && algoliaItem.options.length > 0}
			<!-- Poll parts -->
			{#each pollOptions as pollOption (pollOption.id)}
				<SubsetHTML content={pollOption.text} />
				<small>{pollOption.score} points</small>
			{/each}
		{/if}
	</article>

	{#if algoliaItem.children && algoliaItem.children.length > 0}
		<div class="comments">
			{#each algoliaItem.children as comment (comment.id)}
				<CommentElement {comment} />
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
