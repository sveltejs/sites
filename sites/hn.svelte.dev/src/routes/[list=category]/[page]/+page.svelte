<script>
	import ItemSummary from './ItemSummary.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	const PAGE_SIZE = 30;

	$: start = 1 + (data.page - 1) * PAGE_SIZE;
	$: next = `/${data.list}/${data.page + 1}`;
</script>

<svelte:head>
	<title>Svelte Hacker News</title>
	<meta name="description" content="Latest Hacker News stories in the {data.list} category" />
</svelte:head>

{#each data.items as item, i}
	{#if item}
		<!-- sometimes we get bad data? TODO investigate -->
		<ItemSummary {item} index={start + i} />
	{/if}
{/each}

{#if next}
	<a class="more" href={next}>More...</a>
{/if}
