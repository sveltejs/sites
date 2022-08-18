<script context="module">
	import { API_BASE } from '$lib/env';

	export async function load() {
		const tutorials = await fetch(`${API_BASE}/docs/svelte/tutorial`).then(r => r.json());

		return {
			props: {
				tutorials
			},
			cache: {
				maxage: 60
			}
		};
	}
</script>

<script>
	import { setContext } from 'svelte';

	export let tutorials;
	setContext('tutorial', { sections: tutorials });
</script>

<slot />
