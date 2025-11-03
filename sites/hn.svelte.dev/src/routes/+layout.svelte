<script>
	import { page, navigating } from '$app/stores';
	import favicon from '$lib/assets/favicon.svg';
	import Nav from '$lib/Nav.svelte';
	import PreloadingIndicator from '$lib/PreloadingIndicator.svelte';
	import ThemeToggler from '$lib/ThemeToggler.svelte';
	import '../app.css';

	const { children } = $props();

	const section = $derived($page.url.pathname.split('/')[1]);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Nav {section} />

{#if $navigating}
	<PreloadingIndicator />
{/if}

<main>
	{@render children()}
</main>

<ThemeToggler />

<style>
	main {
		position: relative;
		max-width: 56em;
		padding: 2em;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
