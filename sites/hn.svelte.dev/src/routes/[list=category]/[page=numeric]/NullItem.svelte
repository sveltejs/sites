<script>
	/**
	 * @type {{ id: number; index: number; }}
	 */
	const { id, index } = $props();
</script>

<article>
	<h2>
		Item #{id} Unavailable
	</h2>

	<p>API failed to return this item - maybe deleted?</p>

	<span class="index">{index}</span>
</article>

<style>
	article {
		position: relative;
		padding: 0 0 0 4em;
		margin: 0 0 1.5em 0;

		opacity: 0.5;
	}

	h2 {
		font-size: 1em;
		font-weight: 500;
		margin: 0 0 0.5em 0;
		color: var(--fg);
	}

	p {
		font-size: 0.8em;
		color: var(--fg-light);
		margin: 0;
		font-weight: 300;
	}

	.index {
		position: absolute;
		font-size: 1.6em;
		font-weight: 200;
		color: var(--fg-light);
		left: 0.2em;
		top: 0;
		text-align: right;
		width: 0.75em;
		line-height: 1;
	}
</style>
