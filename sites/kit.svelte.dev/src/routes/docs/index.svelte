<script context="module">
	import { API_BASE } from '../../_env';

	export async function load({ fetch }) {
		const sections = await fetch(`${API_BASE}/docs/kit/docs?content`).then(r => r.json());
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

<Docs {sections} project="kit" path="/documentation">
	<h1 slot="header">Documentation</h1>
</Docs>
