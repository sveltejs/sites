<script>
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import Icon from './Icon.svelte';

	export let segment;
	export let page;
	export let logo;
	export let home = 'Home';
	export let home_title = 'Homepage';

	const current = writable(null);
	setContext('nav', current);

	let open = false;
	let visible = true;

	// hide nav whenever we navigate
	page.subscribe(() => {
		open = false;
	});

	function intercept_touchstart(event) {
		if (!open) {
			event.preventDefault();
			event.stopPropagation();
			open = true;
		}
	}

	// Prevents navbar to show/hide when clicking in docs sidebar
	let hash_changed = false;
	function handle_hashchange() {
		hash_changed = true;
	}

	let last_scroll = 0;
	function handle_scroll() {
		const scroll = window.pageYOffset;
		if (!hash_changed) {
			visible = scroll < 50 || scroll < last_scroll;
		}

		last_scroll = scroll;
		hash_changed = false;
	}

	$: $current = segment;
</script>

<svelte:window on:hashchange={handle_hashchange} on:scroll={handle_scroll} />

<header class:visible={visible || open}>
	<nav>
		{#if open}
			<div class="modal-background hide-if-desktop" on:click={() => (open = false)} />
		{/if}

		<a
			sveltekit:prefetch
			href="/"
			class="nav-spot home"
			title={home_title}
			style="background-image: url({logo})"
		>
			{home}
		</a>
		<ul
			class:open
			on:touchstart|capture={intercept_touchstart}
			on:mouseenter={() => (open = true)}
			on:mouseleave={() => (open = false)}
		>
			<div class="open-menu-button hide-if-desktop" class:open>
				<Icon name="chevron" size="1em" />
			</div>
			<li class="hide-if-desktop" class:active={$current === ''}>
				<a sveltekit:prefetch href="/">{home}</a>
			</li>
			<div class="nav-center">
				<slot name="nav-center" />
			</div>
			{#if open}
				<div class="nav-right hide-if-desktop">
					<slot name="nav-right" />
				</div>
			{/if}
		</ul>
		<div class="nav-spot nav-right show-if-desktop">
			<slot name="nav-right" />
		</div>
	</nav>
</header>

<style>
	header {
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100vw;
		height: var(--nav-h);
		padding: 0 var(--side-nav);
		margin: 0 auto;
		background-color: white;
		box-shadow: 0 -0.4rem 0.9rem 0.2rem rgba(0, 0, 0, 0.5);
		font-family: var(--font);
		z-index: 100;
		user-select: none;
		transition: transform 0.2s;
	}

	header:not(.visible):not(:focus-within) {
		transform: translate(0, calc(-100% - 1rem));
	}

	nav {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: var(--nav-h);
		padding: 0 var(--side-nav) 0 var(--side-nav);
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: transparent;
		transform: none;
		transition: none;
		box-shadow: none;
	}

	.nav-spot {
		width: 50rem;
		height: 4.2rem;
	}

	ul :global(li) {
		display: block;
		display: none;
	}

	ul :global(li).active {
		display: block;
	}

	ul {
		position: relative;
		margin: 0;
		padding: 0 1.5rem 0 0;
	}

	ul::after {
		/* prevent clicks from registering if nav is closed */
		position: absolute;
		content: '';
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
	}

	ul.open {
		width: 100%;
		padding: 0 0 1em 0;
		background: white;
		border-left: 1px solid #eee;
		border-right: 1px solid #eee;
		border-bottom: 1px solid #eee;
		border-radius: 0 0 var(--border-r) var(--border-r);
		align-self: start;
	}

	ul.open :global(li) {
		display: block;
		text-align: right;
	}

	ul.open::after {
		display: none;
	}

	ul :global(li) :global(a) {
		font-size: var(--h5);
		padding: 0 0.8rem;
		border: none;
		color: inherit;
	}

	ul.open :global(li) :global(a) {
		padding: 1.5rem 3.7rem 1.5rem 4rem;
		display: block;
	}

	ul.open :global(.nav-right) {
		padding-right: 2rem;
	}

	ul.open :global(.nav-right) :global(a) {
		padding: 1.5rem;
		display: block;
	}

	ul.open :global(li):first-child :global(a) {
		padding-top: 1.5rem;
	}

	.open-menu-button {
		position: absolute;
		top: 0;
		right: 0;
	}

	.open-menu-button.open {
		display: none;
	}

	.home {
		position: relative;
		top: -0.1rem;
		-webkit-tap-highlight-color: transparent;
		-webkit-touch-callout: none;
		background: 0 50% no-repeat;
		background-size: auto 100%;
		text-indent: -9999px;
	}

	ul :global(li).active :global(a) {
		color: var(--prime);
	}

	.modal-background {
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		background-color: rgba(255, 255, 255, 0.9);
	}

	a {
		color: inherit;
		border-bottom: none;
		transition: none;
	}

	ul :global(li):not(.active) :global(a):hover {
		color: var(--flash);
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

	.nav-right :global(img) {
		height: 2rem;
		margin-left: 0;
		transition: filter 0.3s linear;
	}

	.nav-right :global(img):hover {
		filter: brightness(1.3);
	}

	.show-if-desktop {
		display: none;
	}

	@media (min-width: 768px) {
		ul {
			width: 100%;
			display: flex;
			flex-direction: row;
			padding: 0;
		}

		ul.open {
			padding: 0;
			background: white;
			border: none;
			align-self: initial;
		}

		ul.open :global(li) {
			display: inline;
			text-align: left;
		}

		ul.open :global(li) :global(a) {
			font-size: var(--h5);
			padding: 0 0.8rem;
			display: inline;
		}

		ul::after {
			display: none;
		}

		ul :global(li) {
			display: inline !important;
		}

		.show-if-desktop {
			display: flex;
		}

		.hide-if-desktop {
			display: none !important;
		}

		.nav-center {
			flex-direction: row;
			align-items: center;
		}

		.nav-right :global(img) {
			margin-left: 28px;
		}
	}
</style>
