<script>
	import { page } from '$app/stores';

	export let href = null;
	export let external = null;
	export let title = null;
</script>

{#if external}
	<li><a href={external} {title} rel="external"><slot /></a></li>
{:else}
	<li class:active={$page.path.startsWith(href)}>
		<a sveltekit:prefetch {href} {title}><slot /></a>
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

	.active a {
		color: var(--prime);
	}

	/* TODO figure out some active styles */
</style>
