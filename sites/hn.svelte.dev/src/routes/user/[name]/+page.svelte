<script>
	import SubsetHTML from '$lib/SubsetHTML.svelte';
	import { timeAgo } from '$lib/utils';

	/** @type {import('./$types').PageProps} */
	const { data } = $props();
</script>

<svelte:head>
	<title>{data.id} • Svelte Hacker News</title>
</svelte:head>

<h1>{data.id}</h1>

<div>
	<p>
		...joined <strong>{timeAgo(data.created)}</strong>, and has <strong>{data.karma}</strong> karma
	</p>

	<p>
		<a rel="external" href="https://news.ycombinator.com/submitted?id={data.id}">submissions</a> /
		<a rel="external" href="https://news.ycombinator.com/threads?id={data.id}">comments</a> /
		<a rel="external" href="https://news.ycombinator.com/favorites?id={data.id}">favourites</a>
	</p>

	{#if data.about}
		<div class="about">
			<SubsetHTML content={data.about} />
		</div>
	{/if}
</div>
