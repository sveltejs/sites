<script>
	import '@sveltejs/site-kit/base.css';
	import { page, navigating } from '$app/stores';
	import { Icon, Icons, Nav, NavItem, SkipLink } from '@sveltejs/site-kit';
	import PreloadingIndicator from '$lib/components/PreloadingIndicator.svelte';
	import StopWar from './stopwar.svg';

	function close_banner(event) {
		document.querySelector('.banner').remove();
		document.documentElement.style.setProperty('--banner-footer-height', '0px')
	}
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

<div class="banner">
	<a target="_blank" rel="noopener noreferrer" href="https://hack.sveltesociety.dev/">
		<span class="small">
			<strong>Announcing SvelteHack</strong> →
		</span>
		<span class="large">
			<strong>Announcing SvelteHack</strong> Participate in our first hackathon and win →
		</span>
	</a>
	<button on:click={close_banner}>
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg
		>
	</button>
</div>

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
		position: fixed;
		display: grid;
		grid-template-columns: 4rem 1fr 4rem;
		grid-template-rows: auto;
		grid-template-areas: "start center end";
		place-items: center;
		
		bottom: 0;
		width: 100vw;
		height: var(--banner-footer-height);
		z-index: 999;
	}

	.banner a {
		grid-area: center;
		color: var(--banner-color);
	}

	.banner strong {
		font-weight: bold;
		color: var(--banner-strong-color);
	}

	.banner button {
		grid-area: end;
		color: var(--banner-color);
		width: 2rem;
		height: 2rem;
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
