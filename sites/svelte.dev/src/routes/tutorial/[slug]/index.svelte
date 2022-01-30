<script context="module">
	import { API_BASE } from '$lib/env';

	export async function load({ params }) {
		const tutorial = await fetch(`${API_BASE}/docs/svelte/tutorial/${params.slug}`);

		if (!tutorial.ok) {
			return {
				status: 301,
				redirect: '/tutorial/basics'
			};
		}

		return {
			props: { tutorial: await tutorial.json(), slug: params.slug },
			maxage: 60
		};
	}
</script>

<script>
	import '@sveltejs/site-kit/code.css';
	import { browser } from '$app/env';
	import { getContext } from 'svelte';

	import Repl from '@sveltejs/repl';
	import ScreenToggle from '$lib/components/ScreenToggle.svelte';
	import TableOfContents from './_TableOfContents.svelte';

	import {
		mapbox_setup, // needed for context API tutorial
		rollupUrl,
		svelteUrl
	} from '../../../config.js';

	export let slug;
	export let tutorial;

	const { sections } = getContext('tutorial');

	let repl;
	let prev;
	let scrollable;
	const lookup = new Map();

	let width = browser ? window.innerWidth : 1000;
	let offset = 0;

	sections.forEach((section) => {
		section.tutorials.forEach((chapter) => {
			const obj = {
				slug: chapter.slug,
				section,
				chapter,
				prev
			};

			lookup.set(chapter.slug, obj);

			if (browser) {
				// pending https://github.com/sveltejs/svelte/issues/2135
				if (prev) prev.next = obj;
				prev = obj;
			}
		});
	});

	// TODO is there a non-hacky way to trigger scroll when chapter changes?
	$: if (scrollable) tutorial, scrollable.scrollTo(0, 0);

	$: selected = lookup.get(slug);
	$: improve_link = `https://github.com/sveltejs/svelte/tree/master/site/content/tutorial/${tutorial.dir}`;

	const clone = (file) => ({
		name: file.name.replace(/.\w+$/, ''),
		type: file.type,
		source: file.content
	});

	$: if (repl) {
		completed = false;
		repl.set({
			components: tutorial.initial.map(clone)
		});
	}

	$: mobile = width < 768;

	function reset() {
		repl.update({
			components: tutorial.initial.map(clone)
		});
	}

	function complete() {
		repl.update({
			components: tutorial.complete.map(clone)
		});
	}

	let completed = false;

	function handle_change(event) {
		completed = event.detail.components.every((file, i) => {
			const expected = tutorial.complete[i] && clone(tutorial.complete[i]);
			return (
				expected &&
				file.name === expected.name &&
				file.type === expected.type &&
				file.source.trim().replace(/\s+$/gm, '') === expected.source.trim().replace(/\s+$/gm, '')
			);
		});
	}
</script>

<svelte:head>
	<title>{selected.section.name} / {selected.chapter.name} • Svelte Tutorial</title>

	<meta name="twitter:title" content="Svelte tutorial" />
	<meta name="twitter:description" content="{selected.section.name} / {selected.chapter.name}" />
	<meta name="Description" content="{selected.section.name} / {selected.chapter.name}" />
</svelte:head>

<svelte:window bind:innerWidth={width} />

<div class="tutorial-outer">
	<div class="viewport offset-{offset}">
		<div class="tutorial-text">
			<div class="table-of-contents">
				<TableOfContents {sections} {slug} {selected} />
			</div>

			<div class="chapter-markup" bind:this={scrollable}>
				{@html tutorial.content}

				<div class="controls">
					{#if tutorial.complete.length}
						<!-- TODO disable this button when the contents of the REPL
							matches the expected end result -->
						<button class="show" on:click={() => (completed ? reset() : complete())}>
							{completed ? 'Reset' : 'Show me'}
						</button>
					{/if}

					{#if selected.next}
						<a class="next" href="/tutorial/{selected.next.slug}">Next</a>
					{/if}
				</div>

				<div class="improve-chapter">
					<a class="no-underline" href={improve_link}>Edit this chapter</a>
				</div>
			</div>
		</div>

		<div class="tutorial-repl">
			{#if browser}
				<Repl
					bind:this={repl}
					{svelteUrl}
					{rollupUrl}
					orientation={mobile ? 'columns' : 'rows'}
					fixed={mobile}
					on:change={handle_change}
					injectedJS={mapbox_setup}
					relaxed
				/>
			{/if}
		</div>
	</div>

	{#if mobile}
		<ScreenToggle bind:offset labels={['tutorial', 'input', 'output']} />
	{/if}
</div>

<style>
	.tutorial-outer {
		position: relative;
		block-size: calc(100vh - var(--nav-h));
		overflow: hidden;
		padding-block-end: 42px;
		box-sizing: border-box;
	}

	.viewport {
		display: grid;
		inline-size: 300%;
		block-size: 100%;
		grid-template-columns: 33.333% 66.666%;
		transition: transform 0.3s;
		grid-auto-rows: 100%;
	}

	.offset-1 {
		transform: translate(-33.333%, 0);
	}
	.offset-2 {
		transform: translate(-66.666%, 0);
	}

	@media (min-width: 768px) {
		.tutorial-outer {
			padding: 0;
		}

		.viewport {
			inline-size: 100%;
			block-size: 100%;
			display: grid;
			grid-template-columns: minmax(33.333%, var(--sidebar-large-w)) auto;
			grid-auto-rows: 100%;
			transition: none;
		}

		.offset-1,
		.offset-2 {
			transform: none;
		}
	}

	.tutorial-text {
		display: flex;
		flex-direction: column;
		block-size: 100%;
		border-inline-end: 1px solid var(--second);
		background-color: var(--second);
		color: var(--sidebar-text);
	}

	.chapter-markup {
		padding-inline: 4rem;
		padding-block: 3.2rem;
		overflow: auto;
		flex: 1;
		block-size: 0;
	}

	.chapter-markup :global(h2) {
		margin-block: 4rem 1.6rem;
		font-size: var(--h3);
		line-height: 1;
		font-weight: 400;
		color: white;
	}

	.chapter-markup :global(h2:first-child) {
		margin-block-start: 0.4rem;
	}

	.chapter-markup :global(a) {
		transition: color 0.2s;
		text-decoration: underline;
		color: var(--sidebar-text);
	}

	.chapter-markup :global(a:hover) {
		color: white;
	}

	.chapter-markup :global(ul) {
		padding: 0;
		padding-inline-start: 2em;
	}

	.chapter-markup :global(blockquote) {
		background-color: rgba(0, 0, 0, 0.17);
		color: var(--sidebar-text);
	}

	.chapter-markup::-webkit-scrollbar {
		background-color: var(--second);
		inline-size: 8px;
	}

	.chapter-markup::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.7);
		border-radius: 1em;
	}

	.chapter-markup :global(p) > :global(code),
	.chapter-markup :global(ul) :global(code) {
		color: var(--sidebar-text);
		background: rgba(0, 0, 0, 0.12);
		padding-inline: 0.4em;
		padding-block: 0.2em 0.3em;
		white-space: nowrap;
		position: relative;
		inset-block-start: -0.1em;
	}

	.controls {
		border-block-start: 1px solid rgba(255, 255, 255, 0.15);
		padding-block-start: 1em;
		display: flex;
		align-items: center;
	}

	.show {
		background: var(--prime);
		padding-inline: 0.7em;
		padding-block: 0.3em;
		border-radius: var(--border-r);
		inset-block-start: 0.1em;
		position: relative;
		font-size: var(--h5);
		font-weight: 300;
		color: rgba(255, 255, 255, 0.7);
	}

	.show:hover {
		color: white;
	}

	a.next {
		padding-inline-end: 1.2em;
		background: no-repeat 100% 50% url(@sveltejs/site-kit/icons/arrow-right.svg);
		background-size: 1em 1em;
		margin-inline-start: auto;
	}

	.improve-chapter {
		padding-inline: 0;
		padding-block: 1em 0.5em;
	}

	.improve-chapter a {
		font-size: 14px;
		text-decoration: none;
		opacity: 0.3;
		padding-inline: 1.2em 0.1em;
		padding-block: 0;
		background: no-repeat 0 50% url(/icons/edit.svg);
		background-size: 1em 1em;
	}

	.improve-chapter a:hover {
		opacity: 1;
	}
</style>
