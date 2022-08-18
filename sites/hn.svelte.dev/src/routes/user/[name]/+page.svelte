<script>
	const d = new Date();

	/** @type {import('./$types').PageData} */
	export let data;

	export let { name, user } = data;
</script>

<svelte:head>
	<title>{name} • Svelte Hacker News</title>
</svelte:head>

<h1>{name}</h1>

<div>
	<p>...joined <strong>{user.created}</strong>, and has <strong>{user.karma}</strong> karma</p>

	<p>
		<a href="https://news.ycombinator.com/submitted?id={user.id}">submissions</a> /
		<a href="https://news.ycombinator.com/threads?id={user.id}">comments</a> /
		<a href="https://news.ycombinator.com/favorites?id={user.id}">favourites</a>
	</p>

	{#if user.about}
		<div class="about">
			{@html '<p>' + user.about}
		</div>
	{/if}
</div>
