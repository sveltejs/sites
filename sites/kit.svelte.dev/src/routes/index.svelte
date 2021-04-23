<script context="module">
	export function load() {
		return {
			maxage: 60
		};
	}
</script>

<script>
	import { Hero, Blurb } from '@sveltejs/site-kit';
</script>

<svelte:head>
	<title>SvelteKit • The fastest way to build Svelte apps</title>
</svelte:head>

<Hero
	title="SvelteKit"
	logotype="images/svelte-kit-logotype.svg"
	tagline="The fastest way to build svelte apps"
	background="/images/svelte-kit-machine"
	alt="SvelteKit illustration"
/>

<Blurb>
	<div class="hero-card" slot="one">
		<h2>Powered by Svelte</h2>
		<p>
			SvelteKit is an application framework powered by Svelte — build bigger apps with a smaller
			footprint
		</p>

		<a href="https://svelte.dev" class="learn-more arrow-link">learn more</a>
	</div>

	<div class="hero-card" slot="two">
		<h2>Best of both worlds</h2>
		<p>
			All the SEO and progressive enhancement of a server-rendered app, with the slick navigation of
			an SPA
		</p>

		<a href="docs" class="learn-more arrow-link">learn more</a>
	</div>

	<div class="hero-card" slot="three">
		<h2>Build fast</h2>
		<p>
			Hit the ground running with advanced routing, server-side rendering, code-splitting, offline
			support and more
		</p>

		<a href="docs" class="learn-more arrow-link">learn more</a>
	</div>

	<div class="description" slot="what">
		<p>
			SvelteKit is a framework for building web applications of all sizes, with a beautiful
			development experience and flexible filesystem-based routing.
		</p>

		<p>
			Unlike single-page apps, SvelteKit doesn't compromise on SEO, progressive enhancement or the
			initial load experience — but unlike traditional server-rendered apps, navigation is
			instantaneous for that app-like feel.
		</p>

		<p>
			Read the <a href="https://svelte.dev/blog/whats-the-deal-with-sveltekit">introductory blog</a>
			post to learn more.
		</p>
	</div>

	<div slot="how">
		<div class="code-box">
			<pre>
npm init <span class="orange-highlight">svelte@next</span> my-app
cd my-app
npm install
npm run dev -- --open
            </pre>
		</div>
		<p class="cta"><a sveltekit:prefetch href="docs" class="arrow-link">Learn SvelteKit</a></p>
	</div>
</Blurb>

<style>
	:global(h2) {
		font-weight: 200;
		margin-bottom: 1.5rem;
	}

	:global(a):hover {
		text-decoration: underline;
	}

	.hero-card {
		color: var(--back);
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.code-box {
		display: flex;
		flex-direction: column;
		grid-area: start;
		margin-top: 0rem;
		margin-bottom: 1.2rem;
		padding: 2rem 4rem;
		background: var(--back-light);
		box-shadow: inset 1px 1px 3px rgba(81, 81, 81, 0.2);
		border-radius: 4px;
		color: var(--second-text);
	}

	.orange-highlight {
		color: var(--prime);
	}

	.arrow-link::after {
		content: '';
		position: absolute;
		display: block;
		right: 0;
		top: 0.3em;
		width: 1em;
		height: 1em;
		background: url(/icons/arrow-right.svg);
		background-size: 0% 100%;
		background-repeat: no-repeat;
		transition: background-size 0.2s linear;
	}

	.arrow-link:hover:after {
		background-size: 100% 100%;
	}
</style>
