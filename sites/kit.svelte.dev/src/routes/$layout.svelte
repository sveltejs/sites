<script>
	import '@sveltejs/site-kit/base.css';
	import { page, navigating } from '$app/stores';
	import { Nav, NavItem, PreloadingIndicator } from '@sveltejs/site-kit';

	// TODO
	export let segment;
</script>

{#if $navigating}
	<PreloadingIndicator />
{/if}

<Nav {segment} {page} logo="images/svelte-kit-horizontal.svg">
	<div slot="nav-center" class="nav-center">
		<NavItem segment="docs">Docs</NavItem>
		<NavItem segment="faq">FAQ</NavItem>
		<NavItem segment="migrating">Migrating</NavItem>
	</div>

	<div class="nav-right" slot="nav-right">
		<!-- <NavItem external="https://svelte.dev/repl" title="Repl Page">
			<img class="nav-icon" width="20px" src="./icons/repl.svg" alt="Open Svelte Repl page" />
		</NavItem> -->

		<NavItem external="https://svelte.dev/chat" title="Discord Chat">
			<img class="nav-icon" width="20px" src="./icons/discord.svg" alt="Open Discord chat" />
		</NavItem>

		<NavItem external="https://github.com/sveltejs/kit" title="GitHub Repo">
			<img class="nav-icon" width="20px" src="./icons/github.svg" alt="Open Svelte GitHub page" />
		</NavItem>
	</div>
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

	.nav-center {
		height: 100%;
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.nav-right {
		height: 100%;
		margin: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: var(--font);
		line-height: 1;
		list-style: none;
	}

	.nav-right img {
		margin-left: 0;
		transition: filter 0.3s linear;
	}

	.nav-right img:hover {
		filter: brightness(1.3);
	}

	.nav-icon {
		height: 2rem;
	}

	@media (min-width: 768px) {
		.nav-center {
			flex-direction: row;
		}

		.nav-right {
			justify-content: flex-end;
		}

		.nav-right img {
			margin-left: 28px;
		}
	}
</style>
