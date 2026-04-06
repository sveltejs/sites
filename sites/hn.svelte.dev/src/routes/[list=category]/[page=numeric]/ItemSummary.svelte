<script>
	import { resolve } from '$app/paths';
	import { timeAgo } from '$lib/utils';
	/**
	 * @type {{
	 *   item: HNStory | HNJob | HNPoll;
	 *   index: number;
	 * }}
	 */
	const { item, index } = $props();
	const relativeTimeAgo = $derived(item.time ? timeAgo(item.time) : 'some time ago');
</script>

<article>
	<h2>
		{#if item.type !== 'poll' && item.url}
			<a rel="external" href={item.url}>
				{item.title}
				<small>{new URL(item.url).hostname}</small>
			</a>
		{:else}
			<a
				href={resolve('/item/[id=numeric]', {
					id: `${item.id}`
				})}>{item.title}</a
			>
		{/if}
	</h2>

	<p>
		{item.score}
		{item.score === 1 ? 'point' : 'points'} by
		<a href={resolve('/user/[name]', { name: item.by })}>{item.by}</a>
		{relativeTimeAgo}
		{#if item.type !== 'job'}
			|
			<a
				href={resolve('/item/[id=numeric]', {
					id: `${item.id}`
				})}
			>
				{item.descendants}
				{item.descendants === 1 ? 'comment' : 'comments'}
			</a>
		{/if}
	</p>

	<span class="index">{index}</span>
</article>

<style>
	article {
		position: relative;
		padding: 0 0 0 4em;
		margin: 0 0 1.5em 0;
	}

	h2 {
		font-size: 1em;
		font-weight: 500;
		margin: 0 0 0.5em 0;
		color: var(--fg);
	}

	h2 a {
		text-decoration: none;
	}

	p {
		font-size: 0.8em;
		color: var(--fg-light);
		margin: 0;
		font-weight: 300;
	}

	small {
		color: var(--fg-light);
		font-weight: 300;
	}

	.index {
		position: absolute;
		font-size: 1.6em;
		font-weight: 200;
		color: var(--fg-light);
		left: 0.2em;
		top: 0;
		text-align: right;
		width: 0.75em;
		line-height: 1;
	}
</style>
