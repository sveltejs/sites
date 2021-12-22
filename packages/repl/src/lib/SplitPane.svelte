<script>
	import * as yootils from 'yootils';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let type;
	export let pos = 50;
	export let fixed = false;
	export let buffer = 42;
	export let min;
	export let max;

	let w;
	let h;
	$: size = type === 'vertical' ? h : w;

	$: min = 100 * (buffer / size);
	$: max = 100 - min;
	$: pos = yootils.clamp(pos, min, max);

	const refs = {};

	let dragging = false;

	function setPos(event) {
		const { top, left } = refs.container.getBoundingClientRect();

		const px = type === 'vertical'
			? (event.clientY - top)
			: (event.clientX - left);

		pos = 100 * px / size;
		dispatch('change');
	}

	function setTouchPos(event) {
		const { top, left } = refs.container.getBoundingClientRect();

		const px = type === 'vertical'
			? (event.touches[0].clientY - top)
			: (event.touches[0].clientX - left);

		pos = 100 * px / size;
		dispatch('change');
	}

	function drag(node, callback) {
		const mousedown = event => {
			if (event.which !== 1) return;

			event.preventDefault();

			dragging = true;

			const onmouseup = () => {
				dragging = false;

				window.removeEventListener('mousemove', callback, false);
				window.removeEventListener('mouseup', onmouseup, false);
			};

			window.addEventListener('mousemove', callback, false);
			window.addEventListener('mouseup', onmouseup, false);
		}

		node.addEventListener('mousedown', mousedown, false);

		return {
			destroy() {
				node.removeEventListener('mousedown', mousedown, false);
			}
		};
	}

	function touchDrag(node, callback) {
		const touchdown = event => {
			if (event.targetTouches.length > 1) return;

			event.preventDefault();

			dragging = true;

			const ontouchend = () => {
				dragging = false;

				window.removeEventListener('touchmove', callback, false);
				window.removeEventListener('touchend', ontouchend, false);
			};

			window.addEventListener('touchmove', callback, false);
			window.addEventListener('touchend', ontouchend, false);
		}

		node.addEventListener('touchstart', touchdown, false);

		return {
			destroy() {
				node.removeEventListener('touchstart', touchdown, false);
			}
		};
	}

	$: side = type === 'horizontal' ? 'left' : 'top';
	$: dimension = type === 'horizontal' ? 'width' : 'height';
</script>

<style>
	.container {
		position: relative;
		inline-size: 100%;
		block-size: 100%;
	}

	.pane {
		position: relative;
		float: left;
		inline-size: 100%;
		block-size: 100%;
		overflow: auto;
	}

	.mousecatcher {
		position: absolute;
		inset-inline-start: 0;
		inset-block-start: 0;
		inline-size: 100%;
		block-size: 100%;
		background: rgba(255,255,255,.01);
	}

	.divider {
		position: absolute;
		z-index: 10;
		display: none;
	}

	.divider::after {
		content: '';
		position: absolute;
		/* background-color: #eee; */
		background-color: var(--second);
	}

	.horizontal {
		padding-inline: 8px;
		inline-size: 0;
		block-size: 100%;
		cursor: ew-resize;
	}

	.horizontal::after {
		inset-inline-start: 8px;
		inset-block-start: 0;
		inline-size: 1px;
		block-size: 100%;
	}

	.vertical {
		padding-block: 8px;
		inline-size: 100%;
		block-size: 0;
		cursor: ns-resize;
	}

	.vertical::after {
		inset-block-start: 8px;
		inset-inline-start: 0;
		inline-size: 100%;
		block-size: 1px;
	}

	.left, .right, .divider {
		display: block;
	}

	.left, .right {
		block-size: 100%;
		float: left;
	}

	.top, .bottom {
		position: absolute;
		inline-size: 100%;
	}

	.top { inset-block-start: 0; }
	.bottom { inset-block-end: 0; }
</style>

<div class="container" bind:this={refs.container} bind:clientWidth={w} bind:clientHeight={h}>
	<div class="pane" style="{dimension}: {pos}%;">
		<slot name="a"></slot>
	</div>

	<div class="pane" style="{dimension}: {100 - (pos)}%;">
		<slot name="b"></slot>
	</div>

	{#if !fixed}
		<div class="{type} divider" style="{side}: calc({pos}% - 8px)" use:drag={setPos} use:touchDrag={setTouchPos}></div>
	{/if}
</div>

{#if dragging}
	<div class="mousecatcher"></div>
{/if}