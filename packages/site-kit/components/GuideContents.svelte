<script>
	import { afterUpdate } from 'svelte';

	export let sections = [];
	export let active_section = null;
	export let show_contents;
	export let prevent_sidebar_scroll = false;

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

<ul
	bind:this={ul}
	class="reference-toc"
	on:mouseenter="{() => prevent_sidebar_scroll = true}"
	on:mouseleave="{() => prevent_sidebar_scroll = false}"
>
	{#each sections as section}
		<li>
			<a class="section" class:active="{section.slug === active_section}" href="#{section.slug}">
				{@html section.title}
			</a>

			{#each section.sections as subsection}
				<a
					class="subsection"
					class:active="{subsection.slug === active_section}"
					href="#{subsection.slug}"
				>
					{@html subsection.title}
				</a>

				{#each subsection.sections as subsection}
					<a
						class="nested subsection"
						class:active="{subsection.slug === active_section}"
						href="#{subsection.slug}"
					>
						{@html subsection.title}
					</a>
				{/each}
			{/each}
		</li>
	{/each}
</ul>

<style>
	.reference-toc li {
		display: block;
		line-height: 1.2;
		margin: 0 0 4rem 0;
	}

	a {
		position: relative;
		transition: color 0.2s;
		border-bottom: none;
		padding: 0;
		color: var(--second);
	}

	.section {
		display: block;
		padding: 0 0 .8rem 0;
		font-size: var(--h6);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-weight: 600;
	}

	.subsection {
		display: block;
		font-size: 1.6rem;
		font-family: var(--font);
		padding: 0 0 0.6em 0;
	}

	.section:hover,
	.subsection:hover,
	.active {
		color: var(--flash);
	}

	.active::after {
		content: '';
		position: absolute;
		right: 0;
		top: 2px;
		width: 0;
		height: 0;
		border: 6px solid transparent;
		border-right-color: white;
	}

	.nested {
		padding-left: 1.2rem;
	}

	@media (min-width: 832px) {
		a {
			color: var(--sidebar-text);
		}

		a:hover,
		.section:hover,
		.subsection:hover,
		.active {
			color: white
		}
	}
</style>
