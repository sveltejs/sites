<script lang="ts">
	import type { PageProps } from './$types';
	import { resolve } from '$app/paths';
	import { getList } from '#lib/list.remote.js';
	import ItemSummary from './ItemSummary.svelte';
	import NullItem from './NullItem.svelte';

	const { params }: PageProps = $props();
	const PAGE_SIZE = 30 as const;

	async function getViewData(list: PageProps['params']['list'], page: PageProps['params']['page']) {
		const items = await getList({ list, page });

		return {
			list,
			page: +page,
			items,
			now: Date.now() / 1000
		};
	}

	const { list, page, items, now } = $derived(await getViewData(params.list, params.page));
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
