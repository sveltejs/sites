<script>
	export let checked;
</script>

<input type="checkbox" bind:checked />

<style>
	input[type='checkbox'] {
		/* display: block; */
		position: relative;
		block-size: 1em;
		inline-size: calc(100% - 0.6em);
		max-inline-size: 2em;
		inset-block-start: -2px;
		border-radius: 0.5em;
		-webkit-appearance: none;
		appearance: none;
		outline: none;
		border: transparent;
		margin: 0;
		margin-inline-end: 0.6em;
	}

	input[type='checkbox']::before {
		content: '';
		position: absolute;
		display: block;
		block-size: 100%;
		inline-size: 100%;
		padding: 2px;
		border-radius: 1em;
		inset-block-start: 0;
		inset-inline-start: 0;
		background: var(--second);
		/* box-sizing: border-box; */
		box-sizing: content-box;
	}

	input[type='checkbox']:checked::before {
		background: var(--prime);
	}

	input[type='checkbox']::after {
		content: '';
		position: absolute;
		display: block;
		block-size: 1em;
		inline-size: 1em;
		inset-block-start: 2px;
		inset-inline-start: 2px;
		border-radius: 1em;
		background: white;
		box-shadow: 0 0px 1px rgba(0, 0, 0, 0.4), 0 4px 2px rgba(0, 0, 0, 0.1);
		transition: background 0.2s ease-out, left 0.2s ease-out;
	}

	input[type='checkbox']:checked::after {
		inset-inline-start: calc(100% - 1em + 2px);
	}
</style>
