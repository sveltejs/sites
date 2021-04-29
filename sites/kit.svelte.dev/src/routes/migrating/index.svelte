<script context="module">
	export async function load({ fetch }) {
		const sections = await fetch(`https://api.svelte.dev/docs/kit/migrating?content`).then((r) => r.json());
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
	<title>Migration • SvelteKit</title>

	<meta name="twitter:title" content="SvelteKit migration guides">
	<meta name="twitter:description" content="How to migrate your app from Sapper to SvelteKit">
	<meta name="description" content="How to migrate your app from Sapper to SvelteKit">
</svelte:head>

<h1 class="visually-hidden">Migration</h1>
<Docs {sections} project="kit" path="/documentation" dir="migrating" />
