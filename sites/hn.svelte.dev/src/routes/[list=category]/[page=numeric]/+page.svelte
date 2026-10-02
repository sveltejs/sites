<script lang="ts">
	import type { PageProps } from './$types';
	import { resolve } from '$app/paths';
	import ItemSummary from './ItemSummary.svelte';
	import NullItem from './NullItem.svelte';

	const { data }: PageProps = $props();
	const PAGE_SIZE = 30 as const;
	const { list, items, page, now } = $derived(data);
	const start = $derived(1 + (page - 1) * PAGE_SIZE);
</script>

<svelte:head>
	<title>Svelte Hacker News</title>
	<meta name="description" content="Latest Hacker News stories in the {list} category" />
</svelte:head>

{#each items as item, i (item.id)}
	{#if item.type !== 'null'}
		<ItemSummary {item} index={start + i} {now} />
	{:else}
		<!-- null item from API -->
		<NullItem id={item.id} index={start + i} />
	{/if}
{/each}

{#if items.length >= PAGE_SIZE}
	<a
		class="more"
		href={resolve('/[list=category]/[page=numeric]', {
			list,
			page: `${page + 1}`
		})}>More...</a
	>
{:else}
	<p>That's all we can find...</p>
{/if}
