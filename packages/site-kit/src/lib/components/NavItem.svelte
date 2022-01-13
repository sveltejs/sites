<script>
	import { page } from '$app/stores';

	export let href = null;
	export let external = null;
	export let title = null;
</script>

{#if external}
	<li><a href={external} {title} rel="external"><slot /></a></li>
{:else}
	<li>
		<a
			aria-current={$page.url.pathname.startsWith(href) ? true : undefined}
			sveltekit:prefetch
			{href}
			{title}
		><slot /></a>
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

	[aria-current] {
		color: var(--prime);
	}
</style>
