<script lang="ts">
	import type { PageProps } from './$types';
	import SubsetHTML from '#lib/SubsetHTML.svelte';
	import { timeAgo } from '#lib/utils.js';

	const { data }: PageProps = $props();
	const { user, now } = $derived(data);
</script>

<svelte:head>
	<title>{user.id} • Svelte Hacker News</title>
</svelte:head>

<h1>{user.id}</h1>

<div>
	<p>
		...joined <strong>{timeAgo(now - user.created)}</strong>, and has
		<strong>{user.karma}</strong> karma
	</p>

	<p>
		<a rel="external" href="https://news.ycombinator.com/submitted?id={user.id}">submissions</a> /
		<a rel="external" href="https://news.ycombinator.com/threads?id={user.id}">comments</a> /
		<a rel="external" href="https://news.ycombinator.com/favorites?id={user.id}">favourites</a>
	</p>

	{#if user.about}
		<div class="about">
			<SubsetHTML content={user.about} />
		</div>
	{/if}
</div>
