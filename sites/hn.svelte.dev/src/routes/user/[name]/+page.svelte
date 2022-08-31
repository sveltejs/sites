<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<svelte:head>
	<title>{data.id} • Svelte Hacker News</title>
</svelte:head>

<h1>{data.id}</h1>

<div>
	<p>
		...joined <strong>{data.created}</strong>, and has <strong>{data.karma}</strong> karma
	</p>

	<p>
		<a href="https://news.ycombinator.com/submitted?id={data.id}">submissions</a> /
		<a href="https://news.ycombinator.com/threads?id={data.id}">comments</a> /
		<a href="https://news.ycombinator.com/favorites?id={data.id}">favourites</a>
	</p>

	{#if data.about}
		<div class="about">
			{@html '<p>' + data.about}
		</div>
	{/if}
</div>
