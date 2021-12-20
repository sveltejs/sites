<script context="module">
	export async function load({ fetch, page, session: { user } }) {
		let gists = [];
		let next = null;

		if (user) {
			let url = 'apps.json';
			if (page.query.get('offset')) {
				url += `?offset=${encodeURIComponent(page.query.get('offset'))}`;
			}
			const r = await fetch(url, {
				credentials: 'include'
			});
			if (!r.ok) return { status: r.status, body: await r.text() };

			({ gists, next } = await r.json());
		}

		return { props: { user, gists, next } };
	}
</script>

<script>
	import { getContext } from 'svelte';
	import { Icon } from '@sveltejs/site-kit';
	import { ago } from '$lib/time';

	export let user;
	export let gists;
	export let next;

	const { login, logout } = getContext('app');

	const format = (str) => ago(new Date(str));

	let selected = [];

	$: selecting = selected.length > 0;
</script>

<svelte:head>
	<title>Your apps • Svelte</title>
</svelte:head>

<div class="apps">
	{#if user}
		<header>
			<h1>Your apps</h1>
			<div class="user">
				<img
					class="avatar"
					alt="{user.github_name || user.github_login} avatar"
					src={user.github_avatar_url}
				/>
				<span>
					{user.github_name || user.github_login}
					(<a on:click|preventDefault={logout} href="auth/logout">log out</a>)
				</span>
			</div>
		</header>

		<div class="controls">
			{#if selected.length > 0}
				<button class="delete" on:click={() => destroy(selected)}>
					<Icon name="delete"/>
					Delete {selected.length} {selected.length === 1 ? 'app' : 'apps'}
				</button>

				<button on:click={() => selected = []}>Clear selection</button>
			{:else}
				<input type="search" placeholder="Search">
			{/if}
		</div>

		<ul class:selecting>
			{#each gists as gist}
				<li class:selected={selected.includes(gist.id)}>
					<a href={selecting ? undefined : `/repl/${gist.id}`}>
						<h2>{gist.name}</h2>
						<span>updated {format(gist.updated_at || gist.created_at)}</span>
					</a>

					<input type="checkbox" bind:group={selected} value={gist.id}>
				</li>
			{/each}
		</ul>

		{#if next !== null}
			<div><a href="apps?offset={next}">Next page...</a></div>
		{/if}
	{:else}
		<p>
			Please <a on:click|preventDefault={login} href="auth/login">log in</a> to see your saved apps.
		</p>
	{/if}
</div>

<style>
	.apps {
		padding: var(--top-offset) var(--side-nav) 6rem var(--side-nav);
		max-width: var(--main-width);
		margin: 0 auto;
	}

	header {
		margin: 0 0 1em 0;
	}

	h1 {
		font-size: 4rem;
		font-weight: 400;
	}

	.user {
		display: flex;
		padding: 0 0 0 3.2rem;
		position: relative;
		margin: 1rem 0;
		color: var(--text);
	}

	.avatar {
		position: absolute;
		left: 0;
		top: 0.1rem;
		width: 2.4rem;
		height: 2.4rem;
		border: 1px solid rgba(0, 0, 0, 0.3);
		border-radius: 0.2rem;
	}

	.controls {
		position: sticky;
		background: white;
		top: 1rem;
		display: flex;
		align-items: center;
		width: 100%;
		height: 4rem;
		margin: 0 0 2rem 0;
		font-size: 1.6rem;
		z-index: 2;
		justify-content: space-between;
		outline: 1rem solid white;
	}

	.controls::after {
		content: '';
		position: absolute;
		width: 100%;
		bottom: -2rem;
		height: 2rem;
		background: linear-gradient(to bottom, white 0%, white 50%, transparent);
	}

	.controls input, .controls button {
		font-family: inherit;
		font-size: inherit;
	}

	.controls input[type=search] {
		width: 100%;
		height: 100%;
		padding: 0.5rem 1rem;
		line-height: 1;
		display: flex;
		border: 1px solid #eee;
		border-radius: var(--border-r);
	}

	.controls button {
		display: flex;
		gap: 1rem;
		padding: 0 1rem;
		height: 100%;
		border-radius: var(--border-r);
		align-items: center;
	}

	.delete {
		background-color: #da106e;
		color: white;
	}

	ul {
		list-style: none;
		display: grid;
		grid-gap: 1rem;
	}

	li {
		position: relative;
	}

	h2 {
		color: var(--text);
		font-size: var(--h5);
		font-weight: 400;
	}

	li a {
		display: block;
		background: var(--back-light);
		padding: 1rem 3rem 1rem 1rem;
		height: 100%;
		line-height: 1;
		border-radius: var(--border-r);
		text-decoration: none;
	}

	li span {
		font-size: 12px;
		color: rgba(0,0,0,0.6);
	}

	li input {
		position: absolute;
		right: 1rem;
		top: 1rem;
		opacity: 0.2;
	}

	ul:not(.selecting) li:hover a {
		background-color: var(--second);
		color: white;
	}

	ul:not(.selecting) li:hover h2,
	ul:not(.selecting) li:hover span {
		color: white;
	}

	ul:not(.selecting) li:hover input {
		opacity: 1;
	}

	li.selected {
		filter: drop-shadow(1px 2px 4px hsla(205.7, 63.6%, 30.8%, 0.1));
	}

	li.selected input {
		opacity: 1;
	}

	.selecting li:not(.selected) {
		opacity: 0.4;
	}

	.selecting li:not(.selected):hover,
	.selecting li:not(.selected):focus-within {
		opacity: 1;
	}

	@media (min-width: 640px) {
		ul {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 960px) {
		ul {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
