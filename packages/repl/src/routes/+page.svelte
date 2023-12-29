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
						'<scr' +
						'ipt>\n\t// See "Ease Visualizer" at https://svelte.dev/examples#easing.\n\timport { backInOut, linear } from \'svelte/easing\';\n\timport {blur, fade, fly, scale, slide} from \'svelte/transition\';\n\tlet show = true;\n\t\n\t// Setting the easing function to "linear" makes it more\n  // obvious that the animations are happening simultaneously.\n\tlet options = {duration: 1000, easing: linear};\n\t\n\t// The "back" easing function is more interesting.\n\t//let options = {duration: 1000, easing: backInOut};\n</scr' +
						'ipt>\n\n<button on:click={() => show = !show}>\n\tToggle\n</button>\n{#if show}\n<h1 transition:fade={options}>This is fade.</h1>\n<h1 transition:blur={options}>This is blur.</h1>\n<h1 transition:slide={{...options, x: -150}}>This is slide.</h1>\n<h1 transition:scale={options}>This is scale.</h1>\n<h1 transition:fly={{...options, x: -150}}>This is fly.</h1>\n<h1 transition:fly={{...options, opacity: 1, x: -400}}>This is fly retaining opacity.</h1>\n<h1\n\tin:fly={{...options, opacity: 1, x: -400}}\n\tout:fly={{...options, opacity: 1, x: 500}}\n>Enter from left and exit right.</h1>\n{/if}'
				}
			]
		});
	});
</script>

<main>
	<Repl
		bind:this={repl}
		showAst
		autocomplete={true}
		previewTheme="dark"
		svelteUrl="https://esm.run/svelte@3.26"
	/>
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
