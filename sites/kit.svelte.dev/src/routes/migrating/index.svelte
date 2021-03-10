<script context="module">
	export async function load({ fetch }) {
		const sections = await fetch(`migrating.json`).then(r => r.json());
		return {
			props: { sections }
		};
	}
</script>

<script>
	import { Docs } from '@sveltejs/site-kit'

	export let sections;
</script>

<svelte:head>
	<title>Migration • SvelteKit</title>

	<meta name="twitter:title" content="SvelteKit migration guides">
	<meta name="twitter:description" content="The next small thing in web development">
	<meta name="Description" content="The next small thing in web development">
</svelte:head>

<Docs {sections} project="sveltekit" dir="migrating"/>
