<script context="module">
	import { API_BASE } from '../../_env';

	export async function load({ fetch }) {
		const sections = await fetch(`${API_BASE}/docs/kit/migrating?content`).then(r => r.json());
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

<Docs {sections} project="kit" path="/documentation" dir="migrating">
	<h1 slot="header">Migration</h1>
</Docs>
