<script>
	import { onMount } from 'svelte';

	let p = 0;
	let visible = false;

	onMount(() => {
		function next() {
			visible = true;
			p += 0.1;

			const remaining = 1 - p;
			if (remaining > 0.15) setTimeout(next, 500 / remaining);
		}

		setTimeout(next, 250);
	});
</script>

{#if visible}
	<div class="progress-container">
		<div class="progress" style="inline-size: {p * 100}%" />
	</div>
{/if}

{#if p >= 0.4}
	<div class="fade" />
{/if}

<style>
	.progress-container {
		position: absolute;
		inset-block-start: 0;
		inset-inline-start: 0;
		inline-size: 100%;
		block-size: 4px;
		z-index: 999;
	}

	.progress {
		position: absolute;
		inset-inline-start: 0;
		inset-block-start: 0;
		block-size: 100%;
		background-color: var(--prime);
		transition: width 0.4s;
	}

	.fade {
		position: fixed;
		inline-size: 100%;
		block-size: 100%;
		background-color: rgba(255, 255, 255, 0.3);
		pointer-events: none;
		z-index: 998;
		animation: fade 0.4s;
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
