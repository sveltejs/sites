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

	<meta name="twitter:title" content="Svelte" />
	<meta name="twitter:description" content="The fastest way to build Svelte apps" />
	<meta name="description" content="SvelteKit is the official Svelte application framework" />
</svelte:head>

<h1 class="visually-hidden">Svelte</h1>
<Hero
	title="Svelte"
	logotype="images/svelte-logotype.svg"
	tagline="Cybernetically enhanced web apps"
	background="/images/svelte-kit-machine"
	alt="Svelte illustration"
	width={960}
	height={960}
/>

<Blurb>
	<div slot="one">
		<h2>Write less code</h2>
		<p>
			Build boilerplate-free components using languages you already know — HTML, CSS and JavaScript
		</p>

		<a href="blog/write-less-code">On writing</a>
	</div>

	<div slot="two">
		<h2>No virtual DOM</h2>
		<p>
			Svelte compiles your code to tiny, framework-less vanilla JS — your app starts fast and stays
			fast
		</p>

		<a sveltekit:prefetch href="blog/virtual-dom-is-pure-overhead">On overhead</a>
	</div>

	<div slot="three">
		<h2>Truly reactive</h2>
		<p>
			No more complex state management libraries — Svelte brings reactivity to JavaScript itself
		</p>

		<a sveltekit:prefetch href="/blog/svelte-3-rethinking-reactivity">On reactivity</a>
	</div>

	<div class="description" slot="what">
		<p>
			Svelte is a radical new approach to building user interfaces. Whereas traditional frameworks
			like React and Vue do the bulk of their work in the browser, Svelte shifts that work into a
			compile step that happens when you build your app.
		</p>

		<p>
			Instead of using techniques like virtual DOM diffing, Svelte writes code that surgically
			updates the DOM when the state of your app changes.
		</p>

		<p>
			Read the <a href="blog/svelte-3-rethinking-reactivity">introductory blog</a>
			post to learn more.
		</p>
	</div>

	<div slot="how">
		<pre><code>
npm init <span class="orange-highlight">svelte@next</span> my-app
cd my-app
npm install
npm run dev -- --open
</code></pre>
		<a sveltekit:prefetch href="/docs">get started</a>
	</div>
</Blurb>

<style>
	pre {
		height: 100%;
		display: flex;
		flex-direction: column;
		color: var(--second-text);
	}

	.orange-highlight {
		color: var(--prime);
	}
</style>
