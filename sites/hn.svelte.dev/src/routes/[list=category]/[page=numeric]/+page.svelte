<script>
	import { resolve } from '$app/paths';
	import ItemSummary from './ItemSummary.svelte';
	import NullItem from './NullItem.svelte';

	/** @type {import('./$types').PageProps} */
	const { data } = $props();

	const PAGE_SIZE = 30;

	const start = $derived(1 + (data.page - 1) * PAGE_SIZE);
</script>

<svelte:head>
	<title>Svelte Hacker News</title>
	<meta name="description" content="Latest Hacker News stories in the {data.list} category" />
</svelte:head>

{#each data.items as item, i (item.id)}
	{#if item.type !== 'null'}
		<ItemSummary {item} index={start + i} />
	{:else}
		<!-- null item from API -->
		<NullItem id={item.id} index={start + i} />
	{/if}
{/each}

{#if data.items.length >= PAGE_SIZE}
	<a
		class="more"
		href={resolve('/[list=category]/[page=numeric]', {
			list: /** @type {"top" | "new" | "best" | "show" | "ask" | "jobs"} */ (data.list),
			page: `${data.page + 1}`
		})}>More...</a
	>
{:else}
	<p>That's all we can find...</p>
{/if}
