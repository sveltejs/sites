<script lang="ts">
	import { onMount } from 'svelte';

	let p = $state(0);
	let visible = $state(false);

	onMount(() => {
		visible = true;

		let timer: ReturnType<typeof setTimeout>;

		function next() {
			p += 0.1;
			const remaining = 1 - p;

			if (remaining > 0.15) {
				timer = setTimeout(next, 500 / remaining);
			}
		}

		timer = setTimeout(next, 250);

		return () => {
			clearTimeout(timer);
		};
	});
</script>

<div class="status" role="status" aria-atomic="true">
	{#if visible}
		Loading...
	{/if}
</div>

{#if visible}
	<div class="progress-container" aria-hidden="true">
		<div class="progress" style:--progress={`${p * 100}%`}></div>
	</div>
{/if}

{#if p >= 0.4}
	<div class="fade" aria-hidden="true"></div>
{/if}

<style>
	.status {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
		font-family: Verdana, Arial, sans-serif;
	}

	.progress-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 4px;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		pointer-events: none;
		z-index: 999;
	}

	.progress {
		width: var(--progress);
		height: 100%;
		background-color: #ff6600;
		transition: width 0.4s;
	}

	.fade {
		position: fixed;
		inset: 0;
		background-color: rgba(255, 255, 255, 0.3);
		pointer-events: none;
		z-index: 998;
		animation: fade 0.4s;
	}

	:global(html.dark) .fade {
		background-color: rgba(0, 0, 0, 0.3);
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.progress {
			width: 100%;
			transition: none;
		}

		.fade {
			animation: none;
		}
	}
</style>
