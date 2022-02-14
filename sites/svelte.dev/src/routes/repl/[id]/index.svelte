<script context="module">
	export async function load({ params, fetch, url }) {
		const res = await fetch(`/repl/${params.id}.json`);

		if (!res.ok) {
			return {
				status: res.status
			};
		}

		const gist = await res.json();

		return {
			props: {
				gist,
				version: url.searchParams.get('version') || '3'
			}
		};
	}
</script>

<script>
	import Repl from '@sveltejs/repl';
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';
	import { mapbox_setup } from '../../../config';
	import AppControls from './_components/AppControls/index.svelte';

	export let version;
	export let gist;

	let repl;
	let name = gist.name;
	let zen_mode = false;
	let modified_count = 0;

	function update_query_string(version) {
		const params = [];

		if (version !== 'latest') params.push(`version=${version}`);

		const url = params.length > 0 ? `/repl/${gist.id}?${params.join('&')}` : `/repl/${gist.id}`;

		history.replaceState({}, 'x', url);
	}

	$: if (typeof history !== 'undefined') update_query_string(version);

	onMount(() => {
		if (version !== 'local') {
			fetch(`https://unpkg.com/svelte@${version || '3'}/package.json`)
				.then((r) => r.json())
				.then((pkg) => {
					version = pkg.version;
				});
		}

		repl.set({
			components: gist.components
		});
	});

	function handle_fork(event) {
		console.log('> handle_fork', event);
		gist = event.detail.gist;
		goto(`/repl/${gist.id}?version=${version}`);
	}

	function handle_change(event) {
		modified_count = event.detail.components.filter((c) => c.modified).length;
	}

	$: svelteUrl =
		browser && version === 'local'
			? `${location.origin}/repl/local`
			: `https://unpkg.com/svelte@${version}`;

	$: relaxed = gist.relaxed || ($session.user && $session.user.id === gist.owner);
</script>

<svelte:head>
	<title>{name} • REPL • Svelte</title>

	<meta name="twitter:title" content="{gist.name} • REPL • Svelte" />
	<meta name="twitter:description" content="Cybernetically enhanced web apps" />
	<meta name="Description" content="Interactive Svelte playground" />
</svelte:head>

<div class="repl-outer {zen_mode ? 'zen-mode' : ''}">
	<AppControls {gist} {repl} bind:name bind:zen_mode bind:modified_count on:forked={handle_fork} />

	{#if browser}
		<Repl
			bind:this={repl}
			{svelteUrl}
			{relaxed}
			injectedJS={mapbox_setup}
			showModified
			showAst
			on:change={handle_change}
			on:add={handle_change}
			on:remove={handle_change}
		/>
	{/if}
</div>

<style>
	.repl-outer {
		position: relative;
		height: calc(100vh - var(--nav-h));
		--app-controls-h: 5.6rem;
		--pane-controls-h: 4.2rem;
		overflow: hidden;
		background-color: var(--back);
		padding: var(--app-controls-h) 0 0 0;
		/* margin: 0 calc(var(--side-nav) * -1); */
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}

	/* temp fix for #2499 and #2550 while waiting for a fix for https://github.com/sveltejs/svelte-repl/issues/8 */

	.repl-outer :global(.tab-content),
	.repl-outer :global(.tab-content.visible) {
		pointer-events: all;
		opacity: 1;
	}
	.repl-outer :global(.tab-content) {
		visibility: hidden;
	}
	.repl-outer :global(.tab-content.visible) {
		visibility: visible;
	}

	.zen-mode {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		z-index: 111;
	}

	@keyframes fade-in {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>
