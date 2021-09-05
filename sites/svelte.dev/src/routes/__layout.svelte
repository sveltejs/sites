<script>
	import {API_BASE} from '../_env'
	import {setContext} from 'svelte';
	import { page, navigating, session } from '$app/stores';
	import { Icons, Nav, NavItem, PreloadingIndicator, ReplIcon } from '@sveltejs/site-kit';
	import '@sveltejs/site-kit/base.css';
	import '../prism.css';

	export let segment;
	$: segment = $page.path.split('/').pop();

	setContext('app', {
		login: () => {
			const login_window = window.open(`${API_BASE}/auth/login`, 'login', 'width=600,height=400');

			window.addEventListener('message', function handler(event) {
				login_window.close();
				window.removeEventListener('message', handler);
				console.log(event.data)
				$session.user = event.data.user;
			});
		},

		logout: async () => {
			const r = await fetch(`${API_BASE}/auth/logout`, {
				credentials: 'include'
			});

			if (r.ok) $session.user = null;
		}
	});
</script>

<Icons />

{#if $navigating}
	<PreloadingIndicator />
{/if}

<Nav {segment} {page} logo="/images/svelte-kit-horizontal.svg">
	<div slot="nav-center" class="nav-center">
		<NavItem segment="/tutorial">Tutorial</NavItem>
		<NavItem segment="/docs">Docs</NavItem>
		<NavItem segment="/examples">Examples</NavItem>
		<NavItem segment="/blog">Blog</NavItem>
		<NavItem segment="/faq">FAQ</NavItem>
	</div>

	<div class="nav-right" slot="nav-right">
		<NavItem segment="/repl" title="Svelte REPL">
			<ReplIcon />
		</NavItem>
		<NavItem external="https://svelte.dev/chat" title="Discord Chat">
			<img class="nav-icon" width="20px" src="/icons/discord.svg" alt="Open Discord chat" />
		</NavItem>

		<NavItem external="https://github.com/sveltejs/svelte" title="GitHub Repo">
			<img class="nav-icon" width="20px" src="/icons/github.svg" alt="Open Svelte GitHub page" />
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
		align-items: flex-end;
	}

	.nav-right {
		height: 100%;
		margin: 0;
		display: flex;
		justify-content: flex-end;
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
			align-items: center;
		}

		.nav-right img {
			margin-left: 28px;
		}
	}
</style>
