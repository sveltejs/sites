<script>
	import { onMount } from 'svelte';

	export let sections = [];
	export let active_section = null;
	export let isLoading = false;

	let active_el;

	onMount(() => {
		active_el.scrollIntoView({ block: 'center' });
	});
</script>

<ul class="examples-toc">
	{#each sections as section}
		<li>
			<span class="section-title">{section.name}</span>

			{#each section.examples as example}
				<div class="row" class:active={example.slug === active_section} class:loading={isLoading}>
					<a
						href="/examples/{example.slug}"
						class="row"
						class:active={example.slug === active_section}
						class:loading={isLoading}
					>
						<img
							class="thumbnail"
							alt="{example.title} thumbnail"
							src="/examples/thumbnails/{example.slug}.jpg"
						/>

						<span>{example.name}</span>
					</a>
					{#if example.slug === active_section}
						<a bind:this={active_el} href="/repl/{example.slug}" class="repl-link">REPL</a>
					{/if}
				</div>
			{/each}
		</li>
	{/each}
</ul>

<style>
	.examples-toc {
		overflow-y: auto;
		block-size: 100%;
		border-inline-end: 1px solid var(--second);
		background-color: var(--second);
		color: white;
		padding-inline: 3rem;
		padding-block: 3rem 0;
	}

	.examples-toc li {
		display: block;
		line-height: 1.2;
		margin: 0;
		margin-block-end: 4.8rem;
	}

	.section-title {
		display: block;
		padding-block-end: 0.8rem;
		font: 400 var(--h6) var(--font);
		text-transform: uppercase;
		letter-spacing: 0.12em;
		font-weight: 700;
	}

	div {
		display: flex;
		flex-direction: row;
		padding-inline: 3rem;
		padding-block: 0.2rem;
		margin-inline: -3rem;
	}

	div.active {
		color: white;
	}

	div.active.loading {
		background: rgba(0, 0, 0, 0.1) calc(100% - 3rem) 47% no-repeat url(/icons/loading.svg);
		background-size: 1em 1em;
		color: white;
	}

	a {
		display: flex;
		flex: 1 1 auto;
		position: relative;
		color: var(--sidebar-text);
		border-block-end: none;
		font-size: 1.6rem;
		align-items: center;
		justify-content: start;
		padding: 0;
	}

	a:hover {
		color: white;
	}

	.repl-link {
		flex: 0 1 auto;
		font-size: 1.2rem;
		font-weight: 700;
		margin-inline-end: 2.5rem;
	}

	.thumbnail {
		background-color: white;
		object-fit: contain;
		inline-size: 5rem;
		block-size: 5rem;
		border-radius: 2px;
		box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.13);
		margin-inline: 0 0.5em;
		margin-block: 0.2em;
	}
</style>
