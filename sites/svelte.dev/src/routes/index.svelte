<script>
	import { Blurb, Section } from '@sveltejs/site-kit-legacy';
	import Supporters from './_components/Supporters.svelte';
	import Hero from './_components/Hero.svelte';
	import Image from './_components/Image.svelte';
	import Example from './_components/Example.svelte';
	import WhosUsingSvelte from './_components/WhosUsingSvelte.svelte';
	import Balls from '$img/svelte-balls.png?w=640;1280;2560&format=avif;webp;png&meta';

	// import Lazy from '../components/Lazy.svelte';

	// TODO this causes a Sapper CSS bug...
	// function loadReplWidget() {
	// 	console.log('lazy loading');
	// 	return import('../components/Repl/ReplWidget.svelte').then(mod => mod.default);
	// }
</script>

<svelte:head>
	<title>Svelte • Cybernetically enhanced web apps</title>

	<meta name="twitter:title" content="Svelte" />
	<meta name="twitter:description" content="Cybernetically enhanced web apps" />
	<meta name="Description" content="Cybernetically enhanced web apps" />
</svelte:head>

<h1 class="visually-hidden">Svelte</h1>

<Hero />

<div class="blurb-shifter">
	<Blurb>
		<a href="blog/write-less-code" slot="one">
			<h2>Write less code</h2>
			<p>
				Build boilerplate-free components using languages you already know — HTML, CSS and
				JavaScript
			</p>

			<span class="learn-more">learn more</span>
		</a>

		<a href="blog/virtual-dom-is-pure-overhead" slot="two">
			<h2>No virtual DOM</h2>
			<p>
				Svelte compiles your code to tiny, framework-less vanilla JS — your app starts fast and
				stays fast
			</p>

			<span class="learn-more">learn more</span>
		</a>

		<a href="blog/svelte-3-rethinking-reactivity" slot="three">
			<h2>Truly reactive</h2>
			<p>
				No more complex state management libraries — Svelte brings reactivity to JavaScript itself
			</p>

			<span class="learn-more">learn more</span>
		</a>

		<div class="description" slot="what">
			<p>
				Svelte is a radical new approach to building user interfaces. Whereas traditional frameworks
				like React and Vue do the bulk of their work in the <em>browser</em>, Svelte shifts that
				work into a <em>compile step</em> that happens when you build your app.
			</p>

			<p>
				Instead of using techniques like virtual DOM diffing, Svelte writes code that surgically
				updates the DOM when the state of your app changes.
			</p>

			<p>
				We're proud that Svelte was recently voted the <a
					href="https://insights.stackoverflow.com/survey/2021#section-most-loved-dreaded-and-wanted-web-frameworks"
					>most loved web framework</a
				>
				with the
				<a href="https://2020.stateofjs.com/en-US/technologies/front-end-frameworks/"
					>most satisfied developers</a
				>
				in a pair of industry surveys. We think you'll love it too.
				<a href="blog/svelte-3-rethinking-reactivity">Read the introductory blog post</a> to learn more.
			</p>
		</div>

		<div style="grid-area: start; display: flex; flex-direction: column; min-width: 0" slot="how">
			<pre
				class="language-bash"
				style="margin: 0 0 1em 0; min-width: 0; min-height: 0">
npx degit <a href="https://github.com/sveltejs/template" style="user-select: initial;">sveltejs/template</a> my-svelte-project
<span class="token comment"># or download and extract <a href="https://github.com/sveltejs/template/archive/master.zip">this .zip file</a></span>
cd my-svelte-project
<span class="token comment"># to use <a href="blog/svelte-and-typescript">TypeScript</a> run:</span>
<span class="token comment"># node scripts/setupTypeScript.js</span>

npm install
npm run dev
		</pre>

			<p style="flex: 1">
				See the <a href="blog/the-easiest-way-to-get-started">quickstart guide</a> for more information.
			</p>

			<p class="cta"><a sveltekit:prefetch href="tutorial">Learn Svelte</a></p>
		</div>
	</Blurb>
</div>

<div class="examples">
	<Example id="hello-world">
		<p>Svelte components are built on top of HTML. Just add data.</p>
	</Example>

	<Example id="nested-components">
		<p>
			CSS is component-scoped by default — no more style collisions or specificity wars. Or you can <a
				href="/blog/svelte-css-in-js">use your favourite CSS-in-JS library</a
			>.
		</p>
	</Example>

	<Example id="reactive-assignments">
		<p>
			Trigger efficient, granular updates by assigning to local variables. The compiler does the
			rest.
		</p>
	</Example>

	<Example id="svg-transitions">
		<p>
			Build beautiful UIs with a powerful, performant transition engine built right into the
			framework.
		</p>
	</Example>
</div>

<Section>
	<h3>Who's using Svelte?</h3>

	<WhosUsingSvelte />
</Section>

<Supporters />

<Image data={Balls} alt="The Svelte logo in a ball pit" />

<div id="footer">
	<a href="/tutorial">Tutorial</a>
	<a href="/docs">Docs</a>
	<a href="/examples">Examples</a>
	<a href="/blog">Blog</a>
	<a href="/faq">FAQ</a>
	<a href="https://opencollective.com/svelte">Open Collective</a>
</div>

<style>
	/* darken text for accessibility */
	/* TODO does this belong elsewhere? */
	:global(.back-light) {
		--text: hsl(36, 3%, 44%);
	}

	.blurb-shifter {
		margin-top: calc(-10rem + var(--side-nav));
	}

	.examples {
		background: var(--second);
		color: white;
		overflow: hidden;
	}

	#footer {
		text-align: center;
		padding: 4rem;
	}
	#footer a {
		color: black;
		margin: 0 1rem;
	}

	@media (min-width: 900px) {
		.blurb-shifter {
			margin-top: -12em;
		}
	}
</style>
