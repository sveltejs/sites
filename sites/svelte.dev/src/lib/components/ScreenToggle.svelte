<script>
	export let labels;
	export let offset = 0;
</script>

<div class="toggle">
	{#each labels as label, index}
		<button class:selected={offset === index} on:click={() => (offset = index)}>
			{label}
		</button>
	{/each}
</div>

<style>
	.toggle {
		position: fixed;
		inset-block-end: 0;
		inline-size: 100%;
		block-size: 4.6rem;
		display: flex;
		justify-content: center;
		align-items: center;
		border-block-start: 1px solid var(--second);
		background-color: white;
	}

	button {
		margin-block: 0;
		margin-inline: 0.15em;
		inline-size: 4em;
		block-size: 1em;
		padding-inline: 0.4rem;
		padding-block: 0.3rem;
		border-radius: var(--border-r);
		line-height: 1em;
		box-sizing: content-box;
		color: #888;
		border: 1px solid var(--back-light);
	}

	.selected {
		background-color: var(--prime);
		color: white;
	}
</style>
