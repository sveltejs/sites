<script>
	import Image from './Image.svelte';
	import Machine from '$img/svelte-machine.png?w=640;1280;2560&format=avif;webp;png&meta';
</script>

<div class="hero">
	<h3>Cybernetically enhanced web apps</h3>
	<Image data={Machine} alt="The Svelte compiler packaging up your component code" />
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

	h3 {
		position: absolute;
		font-size: min(4vw, max(2vw, var(--h4)));
		max-width: 10em;
		text-transform: uppercase;
		font-weight: 700;
		color: var(--second);
		letter-spacing: 0.05em;
		left: max(var(--side-nav), 10%);
		top: 25%;
	}

	@media (min-width: 580px) {
		h3 {
			max-width: 12em;
			top: 30%;
		}
	}

	@media (min-width: 800px) {
		.logotype {
			position: absolute;
			display: block;
			width: 30vw;
			top: 30%;
			left: 10%;
		}

		h3 {
			max-width: 16em;
			top: 45%;
		}
	}
</style>
