<script context="module">
	export async function load({ fetch }) {
		const sections = await fetch(`https://api.svelte.dev/docs/kit/migrating?content`).then((r) => r.json());
		return {
			props: { sections }
		};
	}
</script>

<script>
	import { Docs } from '@sveltejs/site-kit';

	export let sections;
</script>

<svelte:head>
	<title>Migration • SvelteKit</title>

	<meta name="twitter:title" content="SvelteKit migration guides" />
	<meta name="twitter:description" content="The fastest way to build Svelte apps" />
	<meta name="Description" content="The fastest way to build Svelte apps" />
</svelte:head>

<Docs {sections} project="kit" path="/documentation" dir="migrating" />
