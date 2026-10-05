<script lang="ts">
	import { page } from '$app/state';
	import { online } from 'svelte/reactivity/window';

	const offline = $derived(online.current === false);
	const title = $derived(offline ? 'Offline' : page.status);
	const message = $derived(offline ? 'Find the internet and try again' : page.error?.message);
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<h1>{title}</h1>

<pre>{message}</pre>

<style>
	h1 {
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		font-weight: 700;
		margin: 0 0 0.5em 0;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}
</style>
