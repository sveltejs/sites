<script>
	export let alt;
	export let title;
	export let tagline;
	export let logotype;
	export let background;
</script>

<section class="hero-banner">
	<div class="hero-container">
		<div class="hero-text">
			<img alt="{title} logotype" width="440" class="logotype" src={logotype} />
			<h3>{tagline}</h3>
		</div>

		<div class="hero-image">
		<picture>
			<source srcset="{background}.webp">
			<img {alt} src="{background}.png">
		</picture>
	</div>
	</div>
</section>

<style>
	.hero-banner {
		max-width: 100vw;
		background: rgb(211, 214, 217);
		position: relative;
		padding: 8rem var(--side-nav) 0;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.hero-container {
		width: 100%;
		max-width: 90rem;
		margin: 0 auto;
		/* display: flex; */
		justify-content: center;
	}

	.hero-text {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.hero-banner h3 {
		margin-top: 0;
		position: relative;
		font-size: var(--h4);
		font-weight: 200;
		line-height: 2.5rem;
		letter-spacing: 0.1em;
		text-align: center;
		text-transform: uppercase;
		color: var(--text);
		max-width: 12em;
	}

	.logotype {
		position: relative;
		width: 100%;
		max-width: 400px;
		margin: 0 0 2rem 0;
	}

	.hero-image {
		display: flex;
		flex: 1;
		justify-content: center;
		align-items: center;
	}

	picture img {
		width: 600px;
		object-fit: contain;
		transform: translate(-2%,0);
	}

	@media (min-width: 480px) {
		.hero-banner h3 {
			max-width: auto;
		}

		picture img {
			width: 800px;
			object-fit: contain;
			transform: translate(-2%,0);
		}
	}

	@media (min-width: 1024px) {
		.hero-banner {
			padding: 0 var(--side-nav);
		}

		.hero-text {
			margin-top: -10rem;
			align-items: flex-end;
			flex: 1;
		}

		.hero-image {
			flex: 1.2;
		}

		.hero-image img {
			width: 600px;
			transform: translate(0,10%) scale(1.8);
		}

		.hero-banner h3 {
			text-align: right;
			max-width: 12em;
		}

		.hero-container {
			height: 70vh;
			display: flex;
			justify-content: flex-start;
			margin: 0 auto;
			padding: 0;
		}
	}
</style>
