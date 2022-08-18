<script context="module">
	export function load({ url }) {
		const query = url.searchParams;
		return {
			props: {
				version: query.get('version') || '3',
				gist: query.get('gist'),
				example: query.get('example')
			}
		};
	}
</script>

<script>
	import { browser } from '$app/env';
	import ReplWidget from '$lib/components/ReplWidget.svelte';

	export let version;
	export let gist;
	export let example;
</script>

<svelte:head>
	<title>REPL • Svelte</title>

	<meta name="twitter:title" content="Svelte REPL" />
	<meta name="twitter:description" content="Cybernetically enhanced web apps" />
	<meta name="Description" content="Interactive Svelte playground" />
</svelte:head>

<div class="repl-outer">
	{#if browser}
		<ReplWidget {version} {gist} {example} embedded={true} />
	{/if}
</div>

<style>
	.repl-outer {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: var(--back);
		overflow: hidden;
		box-sizing: border-box;
		--pane-controls-h: 4.2rem;
		display: flex;
		flex-direction: column;
	}
</style>
