<script>
	const d = new Date();

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<svelte:head>
	<title>{data.name} • Svelte Hacker News</title>
</svelte:head>

<h1>{data.name}</h1>

<div>
	<p>...joined <strong>{data.user.created}</strong>, and has <strong>{data.user.karma}</strong> karma</p>

	<p>
		<a href="https://news.ycombinator.com/submitted?id={data.user.id}">submissions</a> /
		<a href="https://news.ycombinator.com/threads?id={data.user.id}">comments</a> /
		<a href="https://news.ycombinator.com/favorites?id={data.user.id}">favourites</a>
	</p>

	{#if data.user.about}
		<div class="about">
			{@html '<p>' + data.user.about}
		</div>
	{/if}
</div>
