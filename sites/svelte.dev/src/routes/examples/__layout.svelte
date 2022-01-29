<script context="module">
	import { API_BASE } from '$lib/env';

	export async function load() {
		const examples = await fetch(`${API_BASE}/docs/svelte/examples`).then((r) => r.json());

		return {
			props: {
				examples
			},
			maxage: 60
		};
	}
</script>

<script>
	import { setContext } from 'svelte';

	export let examples;
	setContext('examples', { sections: examples });
</script>

<slot />
