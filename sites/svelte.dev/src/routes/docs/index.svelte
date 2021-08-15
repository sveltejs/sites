<script context="module">
	import { API_BASE } from '../../_env';

	const title_replacements = {
		"component-format-script-1-export-creates-a-component-prop": "props",
		"component-format-script-2-assignments-are-reactive":
			"reactive assignments",
		"component-format-script-3-$-marks-a-statement-as-reactive":
			"reactive statements ($:)",
		"component-format-script-4-prefix-stores-with-$-to-access-their-values":
			"accessing stores ($)",
	};

	export async function load({ fetch }) {
		const sections = await fetch(`${API_BASE}/docs/svelte/docs?content`).then(r => r.json());
		console.log(sections)
		sections[1].sections[0].sections.forEach((section) => {
			if (section.slug in title_replacements) {
				section.title = title_replacements[section.slug];
				}
		})
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

	<meta name="twitter:title" content="SvelteKit docs" />
	<meta name="twitter:description" content="Complete documentation for SvelteKit" />
	<meta name="Description" content="Complete documentation for SvelteKit" />
</svelte:head>

<Docs {sections} project="kit" path="/documentation">
	<h1 slot="header">Documentation</h1>
</Docs>
