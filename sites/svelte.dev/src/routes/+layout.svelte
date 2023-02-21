<script>
	import '@sveltejs/site-kit/base.css';
	import { page, navigating } from '$app/stores';
	import { Icon, Icons, Nav, NavItem, SkipLink } from '@sveltejs/site-kit';
	import PreloadingIndicator from '$lib/components/PreloadingIndicator.svelte';
	import StopWar from './stopwar.svg';
</script>

<Icons />

{#if $navigating && $navigating.to}
	<PreloadingIndicator />
{/if}

{#if $page.url.pathname !== '/repl/embed'}
	<SkipLink href="#main" />
	<Nav {page} logo={StopWar}>
		<svelte:fragment slot="nav-center">
			<NavItem href="/tutorial">Tutorial</NavItem>
			<NavItem href="/docs">Docs</NavItem>
			<NavItem href="/examples">Examples</NavItem>
			<NavItem href="/repl">REPL</NavItem>
			<NavItem href="/blog">Blog</NavItem>
			<NavItem href="/faq">FAQ</NavItem>
		</svelte:fragment>

		<svelte:fragment slot="nav-right">
			<NavItem external="https://kit.svelte.dev">SvelteKit</NavItem>

			<NavItem external="/chat" title="Discord Chat">
				<span class="small">Discord</span>
				<span class="large"><Icon name="message-square" /></span>
			</NavItem>

			<NavItem external="https://github.com/sveltejs/svelte" title="GitHub Repo">
				<span class="small">GitHub</span>
				<span class="large"><Icon name="github" /></span>
			</NavItem>
		</svelte:fragment>
	</Nav>
{/if}

<svelte:head>
	{#if $page.route.id !== '/blog/[slug]'}
		<meta name="twitter:card" content="summary" />
		<meta name="twitter:image" content="https://svelte.dev/images/twitter-thumbnail.jpg" />
		<meta name="og:image" content="https://svelte.dev/images/twitter-thumbnail.jpg" />
	{/if}
</svelte:head>

<main id="main">
	<slot />
</main>

<a target="_blank" rel="noopener noreferrer" href="https://hack.sveltesociety.dev/">
	<div class="banner">
		<span class="small">
			<strong>Announcing SvelteHack</strong> Participate →
		</span>
		<span class="large">
			<strong>Announcing SvelteHack</strong> Participate in our first hackathon and win →
		</span>
	</div>
</a>

<style>
	@media (max-width: 830px) {
		:global(aside) {
			z-index: 9999 !important;
		}
	}

	main {
		position: relative;
		margin: 0 auto;
		/* padding: var(--nav-h) var(--side-nav) 0 var(--side-nav); */
		padding: var(--nav-h) 0 0 0;
		overflow: auto;
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

	/** Ukraine banner */
	:root {
		--banner-footer-height: 48px;
	}

	main {
		padding-bottom: var(--banner-footer-height);
	}

	.banner {
		--banner-bg: #ff4700;
		--banner-color: white;
		--banner-strong-color: white;

		background-color: var(--banner-bg);
		color: var(--banner-color);
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: center;
		bottom: 0;
		width: 100vw;
		height: var(--banner-footer-height);
		z-index: 999;
	}

	.banner strong {
		font-weight: bold;
		color: var(--banner-strong-color);
	}

	:global(.examples-container, .repl-outer, .tutorial-outer) {
		height: calc(100vh - var(--nav-h) - var(--banner-footer-height)) !important;
	}

	:global(.toggle) {
		bottom: var(--banner-footer-height) !important;
	}

	:global(.zen-mode) {
		height: calc(100vh - var(--banner-footer-height)) !important;
	}

	@media (max-width: 830px) {
		:global(aside) {
			z-index: 9999 !important;
		}
	}
</style>
