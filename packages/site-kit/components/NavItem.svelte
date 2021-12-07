<script>
	import { page } from '$app/stores';

	export let segment = null;
	export let external = null;
	export let title = null;
</script>

{#if external}
	<li><a href={external} {title} rel="external"><slot /></a></li>
{:else}
	<li class:active={$page.path.split('/')[1] === segment}>
		<a sveltekit:prefetch href={segment} {title}><slot /></a>
	</li>
{/if}

<style>
	a {
		font-size: var(--h5);
	}

	a:hover {
		color: var(--flash);
		opacity: 1;
	}

	/* TODO figure out some active styles */
</style>
