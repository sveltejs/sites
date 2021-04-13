<script>
	export let title;
	export let tagline;
	export let logotype;
	export let outline;
</script>

<section class="hero-banner">
	<div class="hero-overlay" style="background-image: url(./{outline});" />
	<div class="hero-container">
		<div class="hero-content">
			<img alt="{title} logotype" width="240" class="logotype" src={logotype} />
			<h3 class="hero-tagline">{@html tagline}</h3>
		</div>
	</div>
</section>

<style>
	.hero-banner {
		height: 70vh;
		max-width: 100vw;
		position: relative;
		padding: 10rem auto;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.hero-overlay {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		background-repeat: no-repeat;
		background-size: cover;
		background-position: right;
		opacity: 0.3;
		transition: opacity 0.3s linear;
	}

	.hero-container {
		width: 100%;
		max-width: 90vw;
		margin: -10rem auto 0 auto;
		display: flex;
		justify-content: center;
	}

	.hero-content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.hero-banner h3 {
		margin-top: 2rem;
		position: relative;
		font-size: var(--h4);
		font-weight: 200;
		line-height: 2.5rem;
		letter-spacing: 0.1em;
		text-align: center;
		text-transform: uppercase;
		color: var(--text);
	}

	.logotype {
		height: 4.5rem;
		position: relative;
	}

	@media (min-width: 800px) {
		.hero-banner {
			padding: 15rem auto;
		}

		.hero-banner h3,
		.logotype {
			left: 3rem;
		}
	}

	@media (min-width: 1200px) {
		.hero-overlay {
			opacity: 1;
		}

		.hero-container {
			max-width: 90rem;
			justify-content: flex-start;
			margin: -10rem auto 0 auto;
		}
	}
</style>
