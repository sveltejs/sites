<script context="module">
	import { fetch_page_list } from './_utils/page-list';
	export async function load({ fetch, page, session: { user } }) {
		let gists = [];
		let next = null;
		let current = null;
		let prev = null;

		if (user) {
			const r = await fetch_page_list(fetch, page.query.get('offset'));
			if (!r.ok) return { status: r.status, body: await r.text() };

			({ gists, next, current, prev } = await r.json());
		}

		return { props: { user, gists, next, current, prev } };
	}
</script>

<script>
	import { getContext } from 'svelte';
	import { goto } from '$app/navigation';
	import { ago } from '$lib/time';
	import { page_list } from './_utils/page-list';

	export let user;
	export let gists;
	export let next;
	export let current;
	export let prev;

	/** @type {"IDLE" | "DELETING"} */
	let deleteState = 'IDLE';

	const { login, logout } = getContext('app');

	const format = (str) => ago(new Date(str));

	async function delete_gist(gist) {
		if (!confirm(`This will permanently delete the gist "${gist.name}"`)) {
			return;
		}
		deleteState = 'DELETING';
		try {
			const r = await fetch(`/repl/${gist.id}.json`, {
				method: 'DELETE',
				credentials: 'include'
			});
			if (r.status !== 202) {
				throw new Error(
					`Unexpected response when trying to delete gist. ${r.status}: ${r.statusText}`
				);
			}
			// Re-fetch gists for current page
			let pageListResult = await page_list(fetch, current);
			// If no gists, and we have a prev page, goto prev.
			if (pageListResult.gists.length < 1 && prev !== null) {
				deleteState = 'IDLE';
				goto(`/apps?offset=${encodeURIComponent(prev)}`);
				return;
			}
			({ gists, prev, next, current } = pageListResult);
		} catch (e) {
			console.log('Error', e);
		}
		deleteState = 'IDLE';
	}
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
					<button
						disabled={deleteState === 'DELETING'}
						on:click={() => delete_gist(gist)}
						class="delete-gist-btn">&times;</button
					>
				</li>
			{/each}
		</ul>

		<div class="pagination-wrapper">
			{#if prev !== null}
				<div class="prev-page"><a href="apps?offset={prev}">&lt; Previous page</a></div>
			{/if}
			{#if next !== null}
				<div><a href="apps?offset={next}">Next page &gt;</a></div>
			{/if}
		</div>
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
		display: flex;
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

	.delete-gist-btn {
		font-size: medium;
		color: #999;
		border-radius: 100%;
		width: 2rem;
		height: 2rem;
		margin: 4px 0 0 8px;
		display: none;
		border: 0;
		background: none;
	}
	.delete-gist-btn:disabled {
		color: #ccc;
	}
	li:hover .delete-gist-btn {
		display: block;
	}
	.pagination-wrapper {
		display: flex;
	}
	.prev-page {
		margin-right: 2rem;
	}
</style>
