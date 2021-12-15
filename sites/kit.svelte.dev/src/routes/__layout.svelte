<script>
	import '@sveltejs/site-kit/base.css';
	import { page, navigating } from '$app/stores';
	import { Icon, Icons, Nav, NavItem, PreloadingIndicator } from '@sveltejs/site-kit';

	export let segment;
	$: segment = $page.path.split('/').pop();
</script>

<Icons />

{#if $navigating}
	<PreloadingIndicator />
{/if}

<Nav {segment} {page} logo="/images/svelte-kit-horizontal.svg">
	<svelte:fragment slot="nav-center">
		<NavItem segment="/docs">Docs</NavItem>
		<NavItem segment="/faq">FAQ</NavItem>
		<NavItem segment="/migrating">Migrating</NavItem>
	</svelte:fragment>

	<svelte:fragment slot="nav-right">
		<!-- <NavItem external="https://svelte.dev/chat" title="Discord Chat">
			<img width="20px" src="/icons/discord.svg" alt="Open Discord chat" />
		</NavItem>

		<NavItem external="https://github.com/sveltejs/kit" title="GitHub Repo">
			<img width="20px" src="/icons/github.svg" alt="Open Svelte GitHub page" />
		</NavItem>

		<NavItem external="https://svelte.dev/" title="Svelte Homepage">
			<img width="20px" src="./icons/svelte.svg" alt="Open Svelte page" />
		</NavItem> -->

		<NavItem external="https://svelte.dev">Svelte</NavItem>

		<NavItem external="https://svelte.dev/chat" title="Discord Chat">
			<span class="small">Discord</span>
			<span class="large"><Icon name="message-square" /></span>
		</NavItem>

		<NavItem external="https://github.com/sveltejs/svelte" title="GitHub Repo">
			<span class="small">GitHub</span>
			<span class="large"><Icon name="github" /></span>
		</NavItem>
	</svelte:fragment>
</Nav>

<main>
	<slot />
</main>

<style>
	main {
		position: relative;
		margin: 0 auto;
		padding: var(--nav-h) 0 0 0;
		overflow-x: hidden;
	}

	.small {
		display: inline;
	}

	.large {
		display: none;
	}

	@media (min-width: 800px) {
		.small {
			display: none;
		}

		.large {
			display: inline;
		}
	}
</style>
