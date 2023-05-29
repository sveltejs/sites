<script>
	import Repl from '$lib/Repl.svelte';
	import { onMount } from 'svelte';
	import '@sveltejs/site-kit/styles/index.css';

	/** @type {Repl} */
	let repl;

	onMount(() => {
		repl.set({
			files: [
				{
					name: 'App',
					type: 'svelte',
					source:
						`<scr` +
						`ipt>
	let name = 'world';
</scr` +
						`ipt>

<h1>Hello {name}!</h1>`
				}
			]
		});
	});
</script>

<main>
	<Repl bind:this={repl} showAst autocomplete={true} previewTheme="dark" />
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}

	main {
		height: 100vh;
	}
</style>
