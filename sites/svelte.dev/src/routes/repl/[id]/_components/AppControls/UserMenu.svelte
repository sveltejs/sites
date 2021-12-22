<script>
	import { getContext } from 'svelte';
	import { session } from '$app/stores';

	const { logout } = getContext('app');

	let showMenu = false;
	let name;

	$: name = $session.user.github_name || $session.user.github_login;
</script>

<div class="user" on:mouseenter={() => (showMenu = true)} on:mouseleave={() => (showMenu = false)}>
	<span>{name}</span>
	<img alt="{name} avatar" src={$session.user.github_avatar_url} />

	{#if showMenu}
		<div class="menu">
			<a href="/apps">Your saved apps</a>
			<button on:click={logout}>Log out</button>
		</div>
	{/if}
</div>

<style>
	.user {
		position: relative;
		display: inline-block;
		padding-inline: 1.6rem 1.2rem;
		padding-block: 0;
		block-size: 0.8em;
		line-height: 1;
		z-index: 99;
	}

	.user::after {
		/* embiggen hit zone, so log out menu doesn't disappear */
		position: absolute;
		content: '';
		inline-size: 100%;
		block-size: 3.2rem;
		inset-inline-start: 0;
		inset-block-start: 0;
	}

	span {
		/* position: relative; padding-inline-end: 2em; */
		line-height: 1;
		display: none;
		font-family: var(--font);
		font-size: 1.6rem;
		opacity: 0.7;
	}

	.user:hover span {
		opacity: 1;
	}

	img {
		position: absolute;
		inset-block-start: -0.05em;
		inset-inline-end: 0;
		inline-size: 2.1rem;
		block-size: 2.1rem;
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 0.2rem;
	}

	.menu {
		position: absolute;
		inline-size: calc(100% + 1.6rem);
		min-width: 10em;
		inset-block-start: 3rem;
		inset-inline-end: -1.6rem;
		background-color: var(--second);
		padding-inline: 1.6rem;
		padding-block: 0.8rem;
		z-index: 99;
		text-align: left;
		border-radius: 0.4rem;
		display: flex;
		flex-direction: column;
	}

	.menu button,
	.menu a {
		background-color: transparent;
		font-family: var(--font);
		font-size: 1.6rem;
		opacity: 0.7;
		padding-inline: 0;
		padding-block: 0.4rem;
		text-decoration: none;
		text-align: left;
		border: none;
		color: inherit;
	}

	.menu button:hover,
	.menu a:hover {
		opacity: 1;
		color: inherit;
	}

	@media (min-width: 600px) {
		.user {
			padding-inline: 1.6rem 3.2rem;
			padding-block: 0;
		}

		img {
			inline-size: 2.4rem;
			block-size: 2.4rem;
		}

		span {
			display: inline-block;
		}
	}
</style>
