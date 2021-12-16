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
	import { ago } from '$lib/time';

	export let user;
	export let gists;
	export let next;

	const { login, logout } = getContext('app');

	const format = (str) => ago(new Date(str));
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

		<ul>
			{#each gists as gist}
				<li>
					<a href="repl/{gist.id}">
						<h2>{gist.name}</h2>
						<span>updated {format(gist.updated_at || gist.created_at)}</span>
					</a>
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
		margin: 1rem 0 5rem 0;
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

	ul {
		list-style: none;
	}

	li {
		margin: 0 0 1em 0;
	}

	h2 {
		color: var(--text);
		font-size: var(--h3);
		font-weight: 400;
	}

	li a {
		border: none;
	}

	li a:hover h2 {
		color: var(--flash);
	}

	li span {
		font-size: 14px;
		color: #999;
	}
</style>
