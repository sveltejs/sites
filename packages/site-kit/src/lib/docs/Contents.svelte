<script>
	import { afterUpdate } from 'svelte';
	import Icon from '../components/Icon.svelte';

	export let contents = [];
	export let path = null;
	export let prevent_sidebar_scroll = false;

	let show_contents = false;
	let ul;

	afterUpdate(() => {
		// bit of a hack — prevent sidebar scrolling if
		// TOC is open on mobile, or scroll came from within sidebar
		if (prevent_sidebar_scroll || show_contents && window.innerWidth < 832) return;

		const active = ul.querySelector('.active');

		if (active) {
			const { top, bottom } = active.getBoundingClientRect();

			const min = 200;
			const max = window.innerHeight - 200;

			if (top > max) {
				ul.parentNode.scrollBy({
					top: top - max,
					left: 0
				});
			} else if (bottom < min) {
				ul.parentNode.scrollBy({
					top: bottom - min,
					left: 0
				});
			}
		}
	});
</script>

<aside class="sidebar-container" class:open={show_contents}>
	<div class="sidebar" on:click={() => (show_contents = false)}>
		<!-- scroll container -->
		<ul
			bind:this={ul}
			class="reference-toc"
			on:mouseenter={() => (prevent_sidebar_scroll = true)}
			on:mouseleave={() => (prevent_sidebar_scroll = false)}
		>
			{#each contents as section}
				<li>
					<a class="section" class:active={section.path === path} href={section.path}>
						{section.title}
					</a>

					<ul>
						{#each section.sections as subsection}
							<li>
								<a
									class="subsection"
									class:active={subsection.path === path}
									href={subsection.path}
								>
									{subsection.title}
								</a>

								<ul>
									{#each subsection.sections as subsection}
										<li>
											<a
												class="nested subsection"
												class:active={subsection.path === path}
												href={subsection.path}
											>
												{subsection.title}
											</a>
										</li>
									{/each}
								</ul>
							</li>
						{/each}
					</ul>
				</li>
			{/each}
		</ul>
	</div>

	<button on:click={() => (show_contents = !show_contents)}>
		<Icon name={show_contents ? 'close' : 'menu'} />
	</button>
</aside>

<style>
	aside {
		position: fixed;
		background-color: white;
		inset-inline-start: 0.8rem;
		inset-block-end: 0.8rem;
		inline-size: 2em;
		block-size: 2em;
		overflow: hidden;
		border: 1px solid #eee;
		box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.1);
		transition: width 0.2s, height 0.2s;
	}

	aside button {
		position: absolute;
		inset-block-end: 0;
		inset-inline-start: 0;
		inline-size: 3.4rem;
		block-size: 3.4rem;
	}

	aside.open {
		inline-size: calc(100vw - 3rem);
		block-size: calc(100vh - var(--nav-h));
	}

	aside.open::before {
		content: '';
		position: absolute;
		inset-block-start: 0;
		inset-inline-start: 0;
		inline-size: calc(100% - 2rem);
		block-size: 2em;
		background: linear-gradient(
			to top,
			rgba(255, 255, 255, 0) 0%,
			rgba(255, 255, 255, 0.7) 50%,
			rgba(255, 255, 255, 1) 100%
		);
		pointer-events: none;
		z-index: 2;
	}

	aside::after {
		content: '';
		position: absolute;
		inset-inline-start: 0;
		inset-block-end: 1.9em;
		inline-size: calc(100% - 2rem);
		block-size: 2em;
		background: linear-gradient(
			to bottom,
			rgba(255, 255, 255, 0) 0%,
			rgba(255, 255, 255, 0.7) 50%,
			rgba(255, 255, 255, 1) 100%
		);
		pointer-events: none;
	}

	.sidebar {
		position: absolute;
		font-family: var(--font);
		overflow-y: auto;
		inline-size: 100%;
		block-size: 100%;
		padding-inline: 3.2rem 1.6rem;
		padding-block: 4rem 2rem;
		inset-block-end: 2em;
	}

	li {
		display: block;
		line-height: 1.2;
		margin: 0;
		margin-block-end: 4rem;
	}

	a {
		position: relative;
		transition: color 0.2s;
		border-block-end: none;
		padding: 0;
		color: var(--second);
		user-select: none;
	}

	.section {
		display: block;
		padding-block-end: 0.8rem;
		font-size: var(--h6);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-weight: 600;
	}

	.subsection {
		display: block;
		font-size: 1.6rem;
		font-family: var(--font);
		padding-block-end: 0.6em;
	}

	.section:hover,
	.subsection:hover,
	.active {
		color: var(--flash);
	}

	.active::after {
		content: '';
		position: absolute;
		inset-inline-end: 0;
		inset-block-start: 2px;
		inline-size: 0;
		block-size: 0;
		border: 6px solid transparent;
		border-inline-end-color: white;
	}

	.nested {
		padding-inline-start: 1.2rem;
	}

	ul ul,
	ul ul li {
		margin: 0;
	}

	@media (min-width: 832px) {
		aside {
			display: block;
			inline-size: var(--sidebar-w);
			block-size: 100vh;
			inset-block-start: 0;
			inset-inline-start: 0;
			overflow: hidden;
			box-shadow: none;
			border: none;
			overflow: hidden;
			background-color: var(--second);
			color: white;
		}

		aside.open::before {
			display: none;
		}

		aside::after {
			content: '';
			inset-block-end: 0;
			block-size: var(--top-offset);
			background: linear-gradient(
				to bottom,
				rgba(103, 103, 120, 0) 0%,
				rgba(103, 103, 120, 0.7) 50%,
				rgba(103, 103, 120, 1) 100%
			);
		}

		aside button {
			display: none;
		}

		.sidebar {
			padding-inline: 3.2rem 0;
			padding-block: var(--top-offset) 6.4rem;
			font-family: var(--font);
			overflow-y: auto;
			block-size: 100%;
			inset-block-end: auto;
			inline-size: 100%;
		}

		a {
			color: var(--sidebar-text);
		}

		a:hover,
		.section:hover,
		.subsection:hover,
		.active {
			color: white;
		}
	}
</style>
