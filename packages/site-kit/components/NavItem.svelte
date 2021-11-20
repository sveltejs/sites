<script>
	import { getContext } from 'svelte';

	export let segment = null;
	export let external = null;
	export let title = null;

	const current = getContext('nav');
</script>

{#if external}
	<li><a href={external} {title} rel="external"><slot></slot></a></li>
{:else}
	<li class:active="{$current === segment}"><a sveltekit:prefetch href={segment} {title}><slot></slot></a></li>
{/if}
