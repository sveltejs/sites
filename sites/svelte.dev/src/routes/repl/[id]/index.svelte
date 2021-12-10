<script context="module">
	export function load({ page: { params, query } }) {
		return {
			props: {
				version: query.get('version') || '3',
				id: params.id
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
	import InputOutputToggle from '../../../components/Repl/InputOutputToggle.svelte';
	import AppControls from './_components/AppControls/index.svelte';

	export let version;
	export let id;

	let repl;
	let gist = {
		id: null,
		name: null,
		owner: null,
		relaxed: false,
		components: []
	};
	let name = 'Loading...';
	let zen_mode = false;
	let width = browser ? window.innerWidth : 1000;
	let checked = false;
	let modified_count = 0;

	function update_query_string(version) {
		const params = [];

		if (version !== 'latest') params.push(`version=${version}`);

		const url = params.length > 0 ? `/repl/${id}?${params.join('&')}` : `/repl/${id}`;

		history.replaceState({}, 'x', url);
	}

	$: if (typeof history !== 'undefined') update_query_string(version);

	async function fetch_gist(id) {
		if (gist.id === id) {
			// if the id changed because we just forked, don't refetch
			return;
		}

		const res = await fetch(`/repl/${id}.json`);

		if (!res.ok) {
			console.warn('TODO: show error');
			return;
		}

		gist = await res.json();

		name = gist.name;

		repl.set({
			components: gist.components
		});
	}

	$: if (browser) fetch_gist(id);

	onMount(() => {
		if (version !== 'local') {
			fetch(`https://unpkg.com/svelte@${version || '3'}/package.json`)
				.then((r) => r.json())
				.then((pkg) => {
					version = pkg.version;
				});
		}
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

	$: mobile = width < 540;

	$: relaxed = gist.relaxed || ($session.user && $session.user.id === gist.owner);
</script>

<svelte:head>
	<title>{name} • REPL • Svelte</title>

	<meta name="twitter:title" content="Svelte REPL" />
	<meta name="twitter:description" content="Cybernetically enhanced web apps" />
	<meta name="Description" content="Interactive Svelte playground" />
</svelte:head>

<svelte:window bind:innerWidth={width} />

<div class="repl-outer {zen_mode ? 'zen-mode' : ''}" class:mobile>
	<AppControls {gist} {repl} bind:name bind:zen_mode bind:modified_count on:forked={handle_fork} />

	{#if browser}
		<div class="viewport" class:offset={checked}>
			<Repl
				bind:this={repl}
				{svelteUrl}
				{relaxed}
				fixed={mobile}
				injectedJS={mapbox_setup}
				on:change={handle_change}
				on:add={handle_change}
				on:remove={handle_change}
			/>
		</div>

		{#if mobile}
			<InputOutputToggle bind:checked />
		{/if}
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

	.viewport {
		width: 100%;
		height: 100%;
	}

	.mobile .viewport {
		width: 200%;
		height: calc(100% - 42px);
		transition: transform 0.3s;
		flex: 1;
	}

	.mobile .offset {
		transform: translate(-50%, 0);
	}

	/* temp fix for #2499 and #2550 while waiting for a fix for https://github.com/sveltejs/svelte-repl/issues/8 */

	.viewport :global(.tab-content),
	.viewport :global(.tab-content.visible) {
		pointer-events: all;
		opacity: 1;
	}
	.viewport :global(.tab-content) {
		visibility: hidden;
	}
	.viewport :global(.tab-content.visible) {
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
