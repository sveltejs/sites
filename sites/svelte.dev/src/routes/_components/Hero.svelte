<script>
	import Image from './Image.svelte';
	import Machine from '$img/svelte-machine.png?w=640;1280;2560;3840&format=avif;webp;png&meta';
</script>

<div class="hero">
	<strong>Cybernetically enhanced web apps</strong>
	<Image
		data={Machine}
		alt="The Svelte compiler packaging up your component code"
		--max-height="65vh"
	/>
	<img alt="Svelte logotype" class="logotype" src="/svelte-logotype.svg" />
</div>

<style>
	.hero {
		position: relative;
		background: radial-gradient(circle at 40% 30%, rgb(235, 243, 249), rgb(214, 222, 228));
	}

	.logotype {
		display: none;
	}

	strong {
		position: absolute;
		font-size: min(4vw, var(--h4));
		max-inline-size: 10em;
		text-transform: uppercase;
		font-weight: 700;
		color: var(--second);
		letter-spacing: 0.05em;
		left: max(var(--side-nav), 10%);
		inset-block-start: 25%;
	}

	@media (min-width: 580px) {
		strong {
			max-inline-size: 12em;
			inset-block-start: 30%;
		}
	}

	@media (min-width: 800px) {
		.logotype {
			position: absolute;
			display: block;
			inline-size: min(30vw, 36rem);
			inset-block-end: 58%;
			left: 10%;
		}

		strong {
			max-inline-size: 16em;
			inset-block-start: 45%;
		}

		.logotype,
		strong {
			left: calc(var(--side-nav) + 4rem);
			/* inset-inline-start: calc(50% - 56rem + var(--side-nav)); */
		}
	}

	@media (min-width: 1200px) {
		strong,
		.logotype {
			left: calc(50% - 56rem + var(--side-nav));
		}
	}
</style>
