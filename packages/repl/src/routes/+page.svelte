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
	import { ConfettiExplosion } from 'svelte-confetti-explosion'
	import { tick } from 'svelte'
	
  let x, y;
  let isVisible = false;

  const handleClick = async e => {
    x = e.clientX;
    y = e.clientY;
		
		isVisible = false;
		await tick();
    isVisible = true
  }
</scr` +
						`ipt>

<svelte:body on:click={handleClick} />

{#if isVisible}
  <ConfettiExplosion --x="{x}px" --y="{y}px" />
{/if}

<div>
	Click anywhere for confetti
</div>

<style>
	div {
		width: 100%;
		height: 100vh;
		
		display: grid;
		place-items: center;
		
		user-select: none;
		
		color: grey;
	}
	
	:global(body) {
		overflow: hidden;
	}
</style>`
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
