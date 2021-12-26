<script>
	import Repl from '@sveltejs/repl';
	import { onMount } from 'svelte';
	import '../../../site-kit/src/lib/base.css';
	import '../../../site-kit/src/lib/code.css';

	let repl;

	onMount(() => {
		repl.set({
			components: [
				{
					name: 'App',
					type: 'svelte',
					source: `<scr` + `ipt>
	let name = 'world';
</scr` + `ipt>

<h1>Hello {name}!</h1>`
				}
			]
		});
	});
</script>

<main>
	<Repl bind:this={repl} showAst />
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}

	main {
		block-size: 100vh;
	}
</style>
