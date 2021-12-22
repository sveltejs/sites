<script>
	import { goto } from '$app/navigation';
	import { Icon } from '@sveltejs/site-kit';

	export let sections;
	export let slug;
	export let selected;

	function navigate(e) {
		goto(`/tutorial/${e.target.value}`);
	}
</script>

<nav>
	<a
		rel="prefetch"
		aria-label="Previous tutorial step"
		class="no-underline"
		href="/tutorial/{(selected.prev || selected).slug}"
		class:disabled={!selected.prev}
	>
		<Icon name="arrow-left" />
	</a>

	<div>
		<span>
			<strong>
				<span style="position: relative; inset-block-start: -0.1em; margin-inline-end: 0.5em;"
					><Icon name="menu" /></span
				>
				{selected.section.name} /
			</strong>
			{selected.chapter.name}
		</span>

		<select value={slug} on:change={navigate}>
			{#each sections as section, i}
				<optgroup label="{i + 1}. {section.name}">
					{#each section.tutorials as chapter, i}
						<option value={chapter.slug}>{String.fromCharCode(i + 97)}. {chapter.name}</option>
					{/each}
				</optgroup>
			{/each}
		</select>
	</div>

	<a
		rel="prefetch"
		aria-label="Next tutorial step"
		class="no-underline"
		href="/tutorial/{(selected.next || selected).slug}"
		class:disabled={!selected.next}
	>
		<Icon name="arrow-right" />
	</a>
</nav>

<style>
	nav {
		display: grid;
		align-items: center;
		grid-template-columns: 2.5em 1fr 2.5em;
		border-block-end: 1px solid rgba(255, 255, 255, 0.1);
	}

	div {
		position: relative;
		padding-inline: 0.5em;
		padding-block: 1em;
		font-weight: 300;
		font-size: var(--h6);
		color: white;
	}

	a {
		display: block;
		padding-block: 0.7rem;
		text-align: center;
		opacity: 0.75;
		color: white;
	}

	a:hover {
		opacity: 1;
	}

	a.disabled,
	a.disabled:hover,
	a.disabled:active {
		color: white;
		opacity: 0.3;
	}

	span {
		white-space: nowrap;
		position: relative;
		inset-block-start: 0.1em;
	}

	strong {
		opacity: 0.7;
	}

	select {
		position: absolute;
		inset-inline-start: 0;
		inset-block-start: 0;
		inline-size: 100%;
		block-size: 100%;
		opacity: 0.0001;
		cursor: pointer;
		-webkit-appearance: none;
	}
</style>
