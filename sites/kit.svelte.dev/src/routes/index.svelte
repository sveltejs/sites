<script>
	import { Hero, Blurb } from '@sveltejs/site-kit';
</script>

<style>

</style>

<svelte:head>
	<title>SvelteKit • The fastest way to build Svelte apps</title>
</svelte:head>

<Hero
	title="SvelteKit"
	tagline="The fastest way to build Svelte apps"
	outline="images/svelte-logo-outline.svg"
	logotype="images/svelte-kit-logotype.svg"
/>

<Blurb>
	<a href="https://svelte.dev" slot="one">
		<h2>Big ideas, small size</h2>
		<p>SvelteKit is an application framework powered by Svelte — build ambitious apps with a smaller footprint</p>

		<span class="learn-more">learn more</span>
	</a>

	<a href="docs" slot="two">
		<h2>Best of both worlds</h2>
		<p>All the SEO and progressive enhancement of a server-rendered app, with the slick navigation of an SPA</p>

		<span class="learn-more">learn more</span>
	</a>

	<a href="docs" slot="three">
		<h2>Build fast</h2>
		<p>World-class developer experience powered by Vite — see your changes instantly</p>

		<span class="learn-more">learn more</span>
	</a>

	<div class="description" slot="what">
		<p>SvelteKit is a framework for building web applications of all sizes, with a beautiful development experience and flexible filesystem-based routing.</p>

		<p>Unlike single-page apps, SvelteKit doesn't compromise on SEO, progressive enhancement or the initial load experience — but unlike traditional server-rendered apps, navigation is instantaneous for that app-like feel.</p>

		<p><a href="https://svelte.dev/blog/whats-the-deal-with-sveltekit">Read the introductory blog post</a> to learn more.</p>
	</div>

	<div style="grid-area: start; display: flex; flex-direction: column; min-width: 0" slot="how">
		<pre class="language-bash" style="margin: 0 0 1em 0; min-width: 0; min-height: 0">
npm init svelte@next my-app
cd my-app
npm install
npm run dev -- --open
		</pre>

		<p class="cta"><a sveltekit:prefetch href="docs">Learn SvelteKit</a></p>
	</div>
</Blurb>
