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
	import { Contents, Main, Section } from '@sveltejs/site-kit/components/docs';

	export let sections;

	let selected;
</script>

<svelte:head>
	<title>Migration • SvelteKit</title>

	<meta name="twitter:title" content="SvelteKit migration guides" />
	<meta name="twitter:description" content="How to migrate your app from Sapper to SvelteKit" />
	<meta name="description" content="How to migrate your app from Sapper to SvelteKit" />
</svelte:head>

<Main bind:selected>
	<h1>Migration</h1>

	{#each sections as section}
		<Section
			{section}
			edit="https://github.com/sveltejs/kit/edit/master/site/content/migrating/{section.file}"
			base="/docs"
		/>
	{/each}
</Main>

<Contents {sections} {selected} />
