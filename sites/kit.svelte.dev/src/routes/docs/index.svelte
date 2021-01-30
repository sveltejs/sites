<script context="module">
	export async function load({ fetch }) {
		const sections = await fetch(`docs.json`).then(r => r.json());
		return {
			props: { sections }
		};
	}
</script>

<script>
	import { Docs } from '$components/site-kit'

	export let sections;
</script>

<svelte:head>
	<title>Docs • SvelteKit</title>

	<meta name="twitter:title" content="SvelteKit docs">
	<meta name="twitter:description" content="The next small thing in web development">
	<meta name="Description" content="The next small thing in web development">
</svelte:head>

<Docs {sections} project="sveltekit"/>
