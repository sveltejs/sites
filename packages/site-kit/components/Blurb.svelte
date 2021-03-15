<script>
	import Section from './Section.svelte';
</script>

<style>
	.blurb {
		display: grid;
		grid-row-gap: 1em;
		grid-template-areas:
			"one"
			"two"
			"three"
			"what"
			"how";
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
		color: white;
		text-align: left;
	}

	.blurb :global(p) {
		font-size: var(--h5);
	}

	.box :global(.learn-more) {
		display: block;
		position: relative;
		text-align: right;
		margin-top: auto;
		padding: 0 1.2em 0 0;
	}

	.box:hover :global(.learn-more) {
		color: white;
		text-decoration: underline;
	}

	.box :global(.learn-more)::after, .box :global(.cta) :global(a)::after {
		content: '';
		position: absolute;
		display: block;
		right: 0;
		top: 0.3em;
		width: 1em;
		height: 1em;
		background: url(/icons/arrow-right.svg);
		background-size: 100% 100%;
	}

	.how {
		/* needed to prevent the <pre> from
		   breaking the grid layout */
		min-width: 0;
	}

	.how :global(.cta) :global(a) {
		display: inline-block;
		text-align: right;
		background-color: var(--prime);
		padding: 0.5em 1.8em 0.5em 1em;
		border-radius: var(--border-r);
		border: none;
		color: white;
		position: relative;
	}

	.how :global(.cta) :global(a)::after {
		right: 0.5em;
		top: 0.75em;
	}

	.what {
		margin: 2em 0 0 0;
	}

	.how :global(.cta) {
		margin: 0;
	}

	@media (min-width: 900px) {
		.blurb {
			grid-column-gap: 1em;
			grid-row-gap: 1em;
			grid-template-columns: repeat(2, 1fr);
			grid-template-areas:
				"one two"
				"three how"
				"what what";
		}

		.box {
			padding: 2em;
		}

		.box :global(.cta) {
			text-align: right;
		}
	}

	@media (min-width: 1200px) {
		.blurb {
			grid-column-gap: 1em;
			grid-row-gap: 5em;
			grid-template-columns: repeat(6, 1fr);
			grid-template-areas:
				"one one two two three three"
				"what what what how how how";
		}

		.what {
			margin: 0;
		}

		.box :global(.cta) {
			text-align: left;
		}
	}
</style>

<Section>
	<div class="blurb">
		<div class="box" style="background: var(--prime); grid-area: one;">
			<slot name="one"></slot>
		</div>

		<div class="box" style="background: var(--flash); grid-area: two;">
			<slot name="two"></slot>
		</div>

		<div class="box" style="background: var(--second); grid-area: three;">
			<slot name="three"></slot>
		</div>

		<div class="what" style="grid-area: what;">
			<slot name="what"></slot>
		</div>

		<div class="how" style="grid-area: how;">
			<slot name="how"></slot>
		</div>
	</div>
</Section>
