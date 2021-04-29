<script context="module">
	export async function load({ fetch }) {
		const sections = await fetch('https://api.svelte.dev/docs/kit/docs?content').then((r) => r.json());
		return {
			props: { sections },
			maxage: 60
		};
	}
</script>

<script>
	import { Docs } from '@sveltejs/site-kit';

	export let sections;
</script>

<svelte:head>
	<title>Docs • SvelteKit</title>

	<meta name="twitter:title" content="SvelteKit docs">
	<meta name="twitter:description" content="Complete documentation for SvelteKit">
	<meta name="Description" content="Complete documentation for SvelteKit">
</svelte:head>

<h1 class="visually-hidden">Docs</h1>
<Docs {sections} project="kit" path="/documentation" />
