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
						'<scri' +
						"pt>\n\timport Timeline from './Timeline.svelte'\n\timport Sequence from './Sequence.svelte'\n\t\n\timport { tweened } from 'svelte/motion';\n</sc" +
						'ript>\n\n<Timeline>\n\t<Sequence let:fps let:frame>\n\t\t<div style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">\n\t\t\t<h1 style="opacity: {Math.min(1, frame / fps)}; transform: translateY({Math.cos(frame/15) * 10}px);">\n\t\t\t\tHello Svelte\n\t\t\t</h1>\n\t\t\t<p style="opacity: {Math.min(1, frame / fps)}; transform: translateY({Math.cos((frame - 5)/15) * 10}px);">\n\t\t\t\tThis is a test.\n\t\t\t</p>\n\t\t</div>\n\t</Sequence>\n</Timeline>\n'
				},
				{
					name: 'Sequence',
					type: 'svelte',
					source:
						'<scri' +
						"pt>\n\timport { onMount, onDestroy, getContext } from 'svelte';\n\t\n\tconst timeline = getContext('x:timeline');\n\t\n\t$: ({ width, height, fps } = $timeline);\n\t\n\texport let duration = fps * 10;\n\texport let start = 0;\n\texport let track = 1;\n\t\n\t$: frame = $timeline.frame - start;\n</sc" +
						'ript>\n\n{#if timeline}\n\t<div class="sequence" style="width: {width}px; height: {height}px; border: 1px solid #ddd;">\n\t\t<slot {width} {height} {fps} {duration} {frame} />\n\t</div>\n{/if}\n'
				},
				{
					name: 'Timeline',
					type: 'svelte',
					source: ''
				}
			]
		});
	});
</script>

<main>
	<Repl vim bind:this={repl} showAst autocomplete={true} previewTheme="dark" />
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
