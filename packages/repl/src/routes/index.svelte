<script>
	import Repl from '@sveltejs/repl';
	import { onMount } from 'svelte';

	let repl;

	onMount(() => {
		repl.set({
			components: [
				{
					name: 'App',
					type: 'svelte',
					source: '<h1>Hello world</h1>'
				}
			]
		});
	});
</script>

<main>
	<Repl bind:this={repl} />
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}

	main {
		height: 100vh;

		/* TODO get rid of these, use REPL-specific vars so that it is more portable */
		--font: sans-serif;
		--font-mono: Menlo;
		--base: black;
		--prime: #ff3e00;
		--flash: rgb(13, 172, 184);
		--second: rgb(2, 75, 56);
		--back-light: #def;
	}
</style>
