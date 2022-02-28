<script>
	import '@sveltejs/site-kit/base.css';
	import { setContext } from 'svelte';
	import { page, navigating, session } from '$app/stores';
	import { browser } from '$app/env';
	import { Icon, Icons, Nav, NavItem, SkipLink } from '@sveltejs/site-kit';
	import PreloadingIndicator from '$lib/components/PreloadingIndicator.svelte';

	setContext('app', {
		login: () => {
			const login_window = window.open(
				`${window.location.origin}/auth/login`,
				'login',
				'width=600,height=400'
			);

			window.addEventListener('message', function handler(event) {
				login_window.close();
				window.removeEventListener('message', handler);
				$session.user = event.data.user;
			});
		},

		logout: async () => {
			const r = await fetch(`/auth/logout`, {
				credentials: 'include'
			});

			if (r.ok) $session.user = null;
		}
	});

	let h = 0;
	$: browser && document.documentElement.style.setProperty('--ukr-footer-height', `${h}px`);
</script>

<Icons />

{#if $navigating && $navigating.to}
	<PreloadingIndicator />
{/if}

{#if $page.url.pathname !== '/repl/embed'}
	<SkipLink href="#main" />
	<Nav {page} logo="/stopwar.svg">
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

	<div class="ukr" bind:clientHeight={h}>
		<strong>We stand with Ukraine.</strong>
		Petition your leaders.
		<a target="_blank" rel="noopener noreferrer" href="https://ukrainewar.carrd.co/"
			>Donate to show support.</a
		>
	</div>
{/if}

<main id="main" style="padding-bottom: {h}px;">
	<slot />
</main>

<style>
	.ukr {
		background-color: #0066cc;
		color: white;
		position: fixed;
		bottom: 0;
		width: 100vw;
		text-align: center;
		padding: 1em;
		z-index: 999;
	}

	:global(.examples-container, .repl-outer, .tutorial-outer) {
		height: calc(100vh - var(--nav-h) - var(--ukr-footer-height)) !important;
	}
	:global(.toggle) {
		bottom: var(--ukr-footer-height) !important;
	}

	@media (max-width: 830px) {
		:global(aside) {
			z-index: 9999 !important;
		}
	}

	.ukr strong,
	.ukr a {
		color: #ffcc00;
	}

	main {
		position: relative;
		margin: 0 auto;
		/* padding: var(--nav-h) var(--side-nav) 0 var(--side-nav); */
		padding: var(--nav-h) 0 0 0;
		overflow: scroll;
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
