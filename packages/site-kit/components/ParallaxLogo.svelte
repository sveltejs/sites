<script>
	export let src;
	export let alt;

	let sy = 0;
</script>

<svelte:window bind:scrollY={sy}/>

<style>
	.parallax {
		position: absolute;
		top: -4rem;
		right: 0rem;
		width: 50rem;
		will-change: transform;
		display: none;
	}

	@media (min-width: 800px) {
		.parallax {
			display: block;
		}
	}

	@media (min-width: 1200px) {
		.parallax {
			right: calc(50vw - 60rem);
		}
	}
</style>

<img {alt} {src} class="parallax" style="transform: translate(0, {sy * .2}px)">