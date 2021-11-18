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
	import { Main, Contents } from '@sveltejs/site-kit/components/docs';

	export let sections;

	let selected;
</script>

<svelte:head>
	<title>Docs • SvelteKit</title>

	<meta name="twitter:title" content="SvelteKit docs" />
	<meta name="twitter:description" content="Complete documentation for SvelteKit" />
	<meta name="Description" content="Complete documentation for SvelteKit" />
</svelte:head>

<Main {sections} project="kit" path="/documentation" bind:selected>
	<h1 slot="header">Documentation</h1>
</Main>

<Contents {sections} {selected} />
