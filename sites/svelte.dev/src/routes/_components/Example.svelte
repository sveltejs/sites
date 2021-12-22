<script>
	import IntersectionObserver from '../../components/IntersectionObserver.svelte';
	import ReplWidget from '../../components/Repl/ReplWidget.svelte';

	export let id;
</script>

<div class="repl-container">
	<IntersectionObserver once let:intersecting top={400}>
		{#if intersecting}
			<ReplWidget example={id} />
		{/if}
	</IntersectionObserver>
</div>

<style>
	.repl-container {
		inline-size: 100%;
		block-size: 420px;
		border-radius: var(--border-r);
		overflow: hidden;
	}
</style>
