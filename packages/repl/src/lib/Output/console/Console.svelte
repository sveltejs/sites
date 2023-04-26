<script>
	import ConsoleLine from './ConsoleLine.svelte';

	/** @type {import('./console').Log[]} */
	export let logs;
</script>

<div class="container">
	{#each logs as log}
		<ConsoleLine {log} />
	{/each}
</div>

<style>
	.container {
		--json-tree-string-color: var(--sk-code-string);
	}
</style>
