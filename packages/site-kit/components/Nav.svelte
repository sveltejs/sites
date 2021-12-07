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

{#if open}
	<div class="modal-background hide-if-desktop" on:click={() => (open = false)} />
{/if}

<nav class:visible={visible || open} class:open>
	<a
		sveltekit:prefetch
		href="/"
		class="nav-spot home"
		title={home_title}
		style="background-image: url({logo})"
	>
		{home}
	</a>

	<ul>
		<slot name="nav-center" />
	</ul>

	<ul class="external">
		<slot name="nav-right" />
	</ul>

	<button class="menu-toggle" class:open on:click={() => (open = !open)}>
		<Icon name={open ? 'close' : 'menu'} size="1em" />
	</button>

	<!-- <ul class:open on:touchstart|capture={intercept_touchstart} on:click={() => (open = true)}>
		<div class="open-menu-button hide-if-desktop" class:open>
			<Icon name="menu" size="1em" />
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
	</div> -->
</nav>

<style>
	.modal-background {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background: rgba(255, 255, 255, 0.8);
		z-index: 2;
		backdrop-filter: grayscale(0.5) blur(2px);
	}

	nav {
		--shadow-height: 0.5rem;
		--shadow-gradient: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0.1) 0%,
			rgba(0, 0, 0, 0.05) 30%,
			transparent 100%
		);
		position: fixed;
		width: 100vw;
		height: var(--nav-h);
		margin: 0 auto;
		background-color: white;
		font-family: var(--font);
		z-index: 100;
		user-select: none;
		transition: transform 0.2s;
	}

	nav::after {
		content: '';
		position: absolute;
		width: 100%;
		height: var(--shadow-height);
		left: 0;
		bottom: calc(-1 * var(--shadow-height));
		background: var(--shadow-gradient);
	}

	nav:not(.visible):not(:focus-within) {
		transform: translate(0, calc(-100% - 1rem));
	}

	ul {
		position: relative;
		display: none;
		width: 100%;
		padding: 0;
		margin: 0;
		list-style: none;
		background: white;
		padding: 1rem var(--side-nav);
		z-index: 101;
	}

	ul.external {
		padding: 1rem var(--side-nav) 1rem;
	}

	ul.external::before {
		content: '';
		position: absolute;
		top: 0;
		left: var(--side-nav);
		width: calc(100% - 2 * var(--side-nav));
		height: 1px;
		background: radial-gradient(circle at center, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05));
	}

	ul.external::after {
		content: '';
		position: absolute;
		width: 100%;
		height: var(--shadow-height);
		left: 0;
		bottom: calc(-1 * var(--shadow-height));
		background: var(--shadow-gradient);
	}

	ul :global(li) {
		padding: 0.5rem 0;
	}

	ul :global(a) {
		color: var(--text);
	}

	.open ul {
		display: block;
	}

	.home {
		width: 30rem;
		height: var(--nav-h);
		display: flex;
		text-indent: -9999px;
		background-position: calc(var(--side-nav) - 1rem) 50%;
		background-repeat: no-repeat;
		background-size: auto 70%;
	}

	button {
		position: absolute;
		top: calc(var(--nav-h) / 2 - 1rem);
		right: var(--side-nav);
		line-height: 1;
	}

	@media (min-width: 800px) {
		nav {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		ul {
			display: flex;
			width: auto;
		}

		button {
			display: none;
		}
	}
</style>
