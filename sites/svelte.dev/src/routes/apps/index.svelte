<script context="module">
	export async function load({ fetch, url, session: { user } }) {
		let gists = [];
		let next = null;

		const search = url.searchParams.get('search');

		if (user) {
			const r = await fetch(`/apps.json?${url.searchParams}`, {
				credentials: 'include'
			});

			if (!r.ok) return { status: r.status, body: await r.text() };

			({ gists, next } = await r.json());
		}

		return { props: { user, gists, next, search } };
	}
</script>

<script>
	import { getContext } from 'svelte';
	import { Icon } from '@sveltejs/site-kit';
	import { ago } from '$lib/time';
	import { goto, invalidate } from '$app/navigation';

	export let user;
	export let gists;
	export let next;
	export let search;

	const { login, logout } = getContext('app');

	const format = (str) => ago(new Date(str));

	let destroying = false;

	async function destroy(selected) {
		const confirmed = confirm(
			`Are you sure you want to delete ${selected.length} ${
				selected.length === 1 ? 'app' : 'apps'
			}?`
		);
		if (!confirmed) return;

		destroying = true;

		const res = await fetch(`/apps/destroy`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				ids: selected
			})
		});

		if (res.ok) {
			// await invalidate('/apps.json');
			// selected = [];

			// this is a temporary fix because invalidation only works once
			// TODO raise an issue
			location.reload();
		} else {
			alert('Deletion failed');
		}

		destroying = false;
	}

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
					(<a on:click|preventDefault={logout} href="/auth/logout">log out</a>)
				</span>
			</div>
		</header>

		<div class="controls">
			{#if selected.length > 0}
				<button class="delete" on:click={() => destroy(selected)} disabled={destroying}>
					<Icon name="delete" />
					Delete {selected.length}
					{selected.length === 1 ? 'app' : 'apps'}
				</button>

				<button on:click={() => (selected = [])}>Clear selection</button>
			{:else}
				<form
					on:submit|preventDefault={(e) => {
						const search = new FormData(e.target).get('search');
						goto(search ? `/apps?search=${encodeURIComponent(search)}` : '/apps');
					}}
				>
					<input
						type="search"
						placeholder="Search"
						aria-label="Search"
						name="search"
						value={search}
					/>
				</form>
			{/if}
		</div>

		{#if gists.length > 0}
			<ul class:selecting>
				{#each gists as gist}
					<li class:selected={selected.includes(gist.id)}>
						<a href={selecting ? undefined : `/repl/${gist.id}`}>
							<h2>{gist.name}</h2>
							<span>updated {format(gist.updated_at || gist.created_at)}</span>
						</a>

						<label>
							<input
								aria-label="Select for delection"
								type="checkbox"
								bind:group={selected}
								value={gist.id}
							/>
						</label>
					</li>
				{/each}
			</ul>

			<div class="pagination">
				<!-- TODO more sophisticated pagination -->
				{#if next !== null && !selecting}
					<a href="/apps?offset={next}{search ? `&search=${encodeURIComponent(search)}` : ''}"
						>Next page...</a
					>
				{/if}
			</div>
		{:else}
			<p>No apps here. <a href="/repl">Go make one!</a></p>
		{/if}
	{:else}
		<p>
			Please <a on:click|preventDefault={login} href="/auth/login">log in</a> to see your saved apps.
		</p>
	{/if}
</div>

<style>
	.apps {
		padding-inline: var(--side-nav);
		padding-block: var(--top-offset) 6rem;
		max-inline-size: var(--main-width);
		margin-inline: auto;
		margin-block: 0;
	}

	header {
		margin: 0;
		margin-block-end: 1em;
	}

	h1 {
		font-size: 4rem;
		font-weight: 400;
	}

	.user {
		display: flex;
		padding-inline-start: 3.2rem;
		position: relative;
		margin-block: 1rem;
		color: var(--text);
	}

	.avatar {
		position: absolute;
		inset-inline-start: 0;
		inset-block-start: 0.1rem;
		inline-size: 2.4rem;
		block-size: 2.4rem;
		border: 1px solid rgba(0, 0, 0, 0.3);
		border-radius: 0.2rem;
	}

	.controls {
		position: sticky;
		background: white;
		inset-block-start: 1rem;
		display: flex;
		align-items: center;
		inline-size: 100%;
		block-size: 4rem;
		margin-block-end: 2rem;
		font-size: 1.6rem;
		z-index: 2;
		justify-content: space-between;
		outline: 1rem solid white;
	}

	.controls::after {
		content: '';
		position: absolute;
		inline-size: 100%;
		inset-block-end: -2rem;
		block-size: 2rem;
		background: linear-gradient(to bottom, white 0%, white 50%, transparent);
	}

	.controls form {
		inline-size: 100%;
		block-size: 100%;
	}

	.controls input,
	.controls button {
		font-family: inherit;
		font-size: inherit;
	}

	.controls input[type='search'] {
		position: relative;
		inline-size: 100%;
		block-size: 100%;
		padding-inline: 1rem;
		padding-block: 0.5rem;
		line-height: 1;
		display: flex;
		border: 1px solid #eee;
		border-radius: var(--border-r);
		z-index: 2;
	}

	.controls button {
		display: flex;
		gap: 1rem;
		padding-inline: 1rem;
		padding-block: 0;
		block-size: 100%;
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
		padding-inline: 1rem 3rem;
		padding-block: 1rem;
		block-size: 100%;
		line-height: 1;
		border-radius: var(--border-r);
		text-decoration: none;
	}

	li span {
		font-size: 12px;
		color: rgba(0, 0, 0, 0.6);
	}

	li label {
		position: absolute;
		inset-inline-end: 0;
		inset-block-start: 0;
		padding: 1rem;
	}

	li input {
		display: block;
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

	.pagination {
		block-size: 4rem;
	}

	@media (min-width: 540px) {
		ul {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 720px) {
		ul {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
