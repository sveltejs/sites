<script>
	import Section from './Section.svelte';
</script>

<Section>
	<div class="blurb">
		<div class="box one">
			<slot name="one" />
		</div>

		<div class="box two">
			<slot name="two" />
		</div>

		<div class="box three">
			<slot name="three" />
		</div>

		<div class="what">
			<slot name="what" />
		</div>

		<div class="how">
			<slot name="how" />
		</div>
	</div>
</Section>

<style>
	.blurb {
		display: grid;
		grid-row-gap: 1em;
		grid-template-areas:
			'one'
			'two'
			'three'
			'what'
			'how';
	}

	.box {
		padding: 1em;
		display: flex;
		flex-direction: column;
		border-bottom: none;
	}

	.box :global(a) {
		color: white;
		padding: 0;
		border: none;
	}

	.box :global(h2) {
		padding: 0;
		margin: 0 0 0.5em 0;
		font-size: var(--h2);
		font-weight: 300;
		color: white;
		text-align: center;
	}

	.blurb :global(p) {
		font-size: var(--h5);
	}

	.box :global(.learn-more) {
		padding: 0.8rem 1.6rem;
		border-radius: 4px;
		background: var(--back);
		color: var(--second);
		font-size: var(--h6);
		transition: all 0.2s linear;
	}

	.box :global(.learn-more):hover {
		padding: 0.8rem 2.75rem 0.8rem 1.6rem;
		filter: brightness(0.95);
	}

	.box :global(.learn-more)::after {
		top: 1.25rem;
		right: 0.75rem;
		background-image: url(/icons/arrow-right-black.svg);
	}

	.one {
		background: var(--prime);
		grid-area: one;
	}

	.two {
		background: var(--flash);
		grid-area: two;
	}

	.three {
		background: var(--second);
		grid-area: three;
	}

	.how {
		/* needed to prevent the <pre> from
		   breaking the grid layout */
		min-width: 0;
		grid-area: how;
	}

	.how :global(.cta) {
		margin: 0;
	}

	.how :global(.cta) :global(a) {
		display: inline-block;
		background-color: var(--prime);
		border-radius: 4px;
		padding: 0.5em 1em;
		color: var(--back);
		transition: all 0.2s linear;
	}

	.how :global(.cta) :global(a):hover {
		padding: 0.5em 1.8em 0.5em 1em;
	}

	.how :global(.cta) :global(a)::after {
		right: 0.5em;
		top: 0.75em;
	}

	.what {
		margin: 2em 0 0 0;
		grid-area: what;
	}

	@media (min-width: 900px) {
		.blurb {
			grid-column-gap: 1em;
			grid-row-gap: 1em;
			grid-template-columns: repeat(2, 1fr);
			grid-template-areas:
				'one two'
				'three how'
				'what what';
		}

		.box {
			padding: 2em;
		}
	}

	@media (min-width: 1200px) {
		.blurb {
			grid-column-gap: 1em;
			grid-row-gap: 5em;
			grid-template-columns: repeat(6, 1fr);
			grid-template-areas:
				'one one two two three three'
				'what what what how how how';
		}

		.what {
			margin: 0;
		}

		.box :global(.cta) {
			text-align: left;
		}
	}
</style>
