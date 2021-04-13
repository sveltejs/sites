<script>
	import { Hero, Blurb } from '@sveltejs/site-kit';
</script>

<svelte:head>
	<title>SvelteKit • The fastest way to build Svelte apps</title>
</svelte:head>

<Hero
	title="SvelteKit"
	tagline="Cybernetically enhanced<br/>web apps"
	logotype="images/svelte-kit-logotype.svg"
	outline="images/hero-banner.png"
/>

<Blurb>
	<div class="hero-card" slot="one">
		<h2>Write less code</h2>
		<p>
			Build boilerplate-free components using languages you already know — HTML, CSS and JavaScript
		</p>

		<a href="https://svelte.dev" class="learn-more arrow-link">On writing</a>
	</div>

	<div class="hero-card" slot="two">
		<h2>No virtual DOM</h2>
		<p>
			Svelte compiles your code to tiny, framework-less vanilla JS — your app starts fast and stays
			fast
		</p>

		<a href="docs" class="learn-more arrow-link">On overhead</a>
	</div>

	<div class="hero-card" slot="three">
		<h2>Truly reactive</h2>
		<p>
			No more complex state management libraries — Svelte brings reactivity to JavaScript itself
		</p>

		<a href="docs" class="learn-more arrow-link">On reactivity</a>
	</div>

	<div class="description" slot="what">
		<h2>A radical new approach<br />to building user interfaces</h2>
		<p>
			Whereas traditional frameworks like React and Vue do the bulk of their work in the browser,
			Svelte shifts that work into a compile step that happens when you build your app.
		</p>

		<p>
			Instead of using techniques like virtual DOM diffing, Svelte writes code that surgically
			updates the DOM when the state of your app changes.
		</p>

		<p>
			Read the <a href="https://svelte.dev/blog/whats-the-deal-with-sveltekit">introductory blog</a>
			post to learn more.
		</p>
	</div>

	<div slot="how">
		<div class="code-box">
			<pre>
mkdir my-app
cd my-app
npm init <span class="orange-highlight">svelte@next</span>

npm install
npm run dev & open http://localhost:3000
            </pre>
		</div>
		<p class="cta"><a rel="prefetch" href="docs" class="arrow-link">Learn SvelteKit</a></p>
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

	@media (min-width: 1200px) {
		.code-box {
			margin-top: 9rem;
		}
	}
</style>
