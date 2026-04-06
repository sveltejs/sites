<script>
	import { resolve } from '$app/paths';

	/** @type {{ section: string }} section */
	const { section } = $props();

	/** @type {('top' | 'new' | 'best' | 'show' | 'ask' | 'jobs')[]} */
	const lists = ['top', 'new', 'best', 'show', 'ask', 'jobs'];
</script>

<nav>
	<a href={resolve('/')}>
		<img alt="Svelte Hacker News logo" class="icon" src="/favicon.png" />
	</a>

	<ul>
		{#each lists as list (list)}
			<li>
				<a
					href={resolve('/[list=category]/[page=numeric]', { list, page: '1' })}
					class:selected={section === list}>{list}</a
				>
			</li>
		{/each}

		<li class="about">
			<a href={resolve('/about')} class:selected={section === 'about'}>about</a>
		</li>
	</ul>
</nav>

<style>
	nav {
		/* background-color: rgba(255, 102, 0, 0.05); */
		border-bottom: 1px solid #ff6600;
		color: var(--fg-light);
		font-weight: 300;
		padding: 0 1em;
	}

	.icon {
		display: block;
		width: 1em;
		height: 1em;
		float: left;
		font-size: 2em;
		position: relative;
		top: 0.4em;
		box-sizing: border-box;
		margin: 0 0.5em 0 0;
	}

	ul {
		margin: 0;
		padding: 0;
	}

	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: left;
	}

	.about {
		float: right;
	}

	.selected {
		position: relative;
		display: inline-block;
		color: var(--fg);
	}

	.selected::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		height: 2px;
		background-color: #ff6600;
		display: block;
		bottom: 0;
	}

	li a {
		color: inherit;
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
		font-weight: 500;
	}

	@media (min-width: 400px) {
		.icon {
			margin: 0 0.5em 0 0;
		}

		li {
			display: inline-block;
		}
	}
</style>
