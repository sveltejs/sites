<script context="module">
	export function load() {
		return {
			maxage: 60
		};
	}
</script>

<script>
	import Machine from '$img/svelte-kit-machine.webp?w=1440;800&format=avif;webp;png&meta'
	import PageSpeed from '$img/page-speed.png?format=avif;webp;png&meta'
	import { Blurb, Hero } from '@sveltejs/site-kit';

	const groupBy = (items, key) => items.reduce(
		(result, item) => ({
			...result,
			[item[key]]: [
				...(result[item[key]] || []),
				item,
			],
		}), 
		{},
	);

	const imageGroups = Object.values(groupBy(PageSpeed, 'format'));

	// adapter animation
	const adapters = Object.entries({
		'Vercel': '@sveltejs/adapter-vercel',
		'Netlify': '@sveltejs/adapter-netlify',
		'Cloudflare': '@sveltejs/adapter-cloudflare',
		'bare metal': '@sveltejs/adapter-node',
		'static hosting': '@sveltejs/adapter-static',
		'Firebase': 'svelte-adapter-firebase',
		'Deno': 'svelte-adapter-deno',
		'AppEngine': 'svelte-adapter-appengine'
	});

	let i = 0;
	let host;
	let adapter;

	function updateAdapter() {
		[host, adapter] = adapters[i];
		i = (i + 1) % adapters.length;
		setTimeout(updateAdapter, 1000);
	}

	updateAdapter();

	// page speed widget
	let url = '';
	function openPageSpeed() {
		window.open(`https://pagespeed.web.dev/report?url=${encodeURIComponent(url)}`);
	}
</script>

<svelte:head>
	<title>SvelteKit • The fastest way to build Svelte apps</title>

	<meta name="twitter:title" content="SvelteKit">
	<meta name="twitter:description" content="The fastest way to build Svelte apps">
	<meta name="description" content="SvelteKit is the official Svelte application framework">
</svelte:head>

<h1 class="visually-hidden">SvelteKit</h1>
<Hero
	title="SvelteKit"
	logotype="images/svelte-kit-logotype.svg"
	tagline="The fastest way to build svelte apps"
	background={Machine}
	alt="SvelteKit illustration"
	width={800}
/>

<Blurb>
	<div slot="one">
		<h2>Powered by Svelte</h2>
		<p>
			SvelteKit is an application framework powered by Svelte — build bigger apps with a smaller
			footprint
		</p>

		<a href="https://svelte.dev">learn Svelte</a>
	</div>

	<div slot="two">
		<h2>Best of both worlds</h2>
		<p>
			All the SEO and progressive enhancement of a server-rendered app, with the slick navigation of
			an SPA
		</p>

		<a sveltekit:prefetch href="/docs">read the docs</a>
	</div>

	<div slot="three">
		<h2>Build fast</h2>
		<p>
			Hit the ground running with advanced routing, server-side rendering, code-splitting, offline
			support and more
		</p>

		<a sveltekit:prefetch href="/docs">read the docs</a>
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
			<a href="https://node.new/sveltekit">Try on StackBlitz</a> or create a project locally.
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

<div class="section page-speed">
	<h3>Perfect Page Speed Scores</h3>

	<p>SvelteKit builds instant, optimized bundles with the Svelte compiler and code-splitting.</p>

	<div style="margin:1em 0">
		<picture>
			{#each imageGroups as imageGroup}
				<source type={'image/' + imageGroup[0].format} srcset={imageGroup.map(image => `${image.src} ${image.width === 788 ? '1x' : '2x'}`).join(', ')}/> 
				{#if imageGroup[0].format === 'png'}
					<img src={imageGroup[0].src} alt="Perfect Google Page Speed Score of 100" />
				{/if}
			{/each}
		</picture>
	</div>

	<h5 style="margin-bottom:0.5em">Compare to another site:</h5>
	<select bind:value={url} style="padding:0.8rem">
		<option value="https://reactjs.org/">https://reactjs.org/</option>
		<option value="https://vuejs.org/">https://vuejs.org/</option>
		<option value="https://nextjs.org/">https://nextjs.org/</option>
		<option value="https://ember.com/">https://ember.com/</option>
		<option value="https://angular.io/">https://angular.io/</option>
    </select>
    <button class="btn" outline on:click={openPageSpeed} style="margin:0">Go</button>
</div>

<div class="section adapters">
	<h3>Deploy Anywhere</h3>

	Deploy to {host}

	<pre class="code"><code>import adapter from '{adapter}';

export default &#123;
	kit: &#123;
		adapter: adapter()
	}
}</code></pre>
</div>

<div class="section bullet-container">
	<div>
		<h4>🛠️ SSR, SPA, SSG, and In-Between</h4>
		<p>Generate HTML on the server or client at build-time or run-time.</p>
		<a href="/docs#ssr-and-javascript">Documentation →</a>
	</div>

	<div>
		<h4>⚡️ Lightning Fast Code Changes</h4>
		<p>Instant Hot Module Replacement (HMR) regardless of app size.</p>
		<a href="/docs#introduction-what-is-sveltekit">Documentation →</a>
	</div>

	<div>
		<h4>🔩 Existing Universe of Plugins</h4>
		<p>Use Vite and Rollup plugins to customize your build.</p>
		<a href="/docs#configuration-vite">Documentation →</a>
	</div>

	<div>
		<h4>🚀 File System Routing</h4>
		<p>Routing with navigation that is instantaneous for an app-like feel.</p>
		<a href="/docs#routing">Documentation →</a>
	</div>

	<div>
		<h4>📦 SEO Optimized</h4>
		<p>SSR and dynamic rendering for full seach engine support.</p>
		<a href="/docs#ssr-and-javascript">Documentation →</a>
	</div>

	<div>
		<h4>🔑 IDE and TypeScript Support</h4>
		<p>Officially supported IDE extension and type definitions in every package.</p>
		<a href="/docs#introduction-getting-started">Documentation →</a>
	</div>

	<div>
		<h4>💡 Single-Line Integrations</h4>
		<p>Easily setup Tailwind, PostCSS, Sass, Less, Jest and much more.</p>
		<a href="/docs#additional-resources-integrations">Documentation →</a>
	</div>

	<div>
		<h4>🏗 Build Your Backend</h4>
		<p>Build API endpoints in SvelteKit or fetch data from another server.</p>
		<a href="/docs#routing-endpoints">Documentation →</a>
	</div>

	<div>
		<h4>👪 A Vibrant Community</h4>
		<p>Leverage community solutions for i18n, image optimization, and more.</p>
		<a href="https://sveltesociety.dev/">Community →</a>
	</div>
</div>

<style>
	pre {
		height: 100%;
		display: flex;
		flex-direction: column;
		color: var(--second-text);
	}

	.code {
		max-width: 525px;
		text-align: left;
		padding: 1em;
		background: var(--back-light);
		box-shadow: inset 1px 1px 3px rgba(81, 81, 81, 0.2);
	}

	.orange-highlight {
		color: var(--prime);
	}

	.section {
		position: relative;
		margin: 0 auto 10rem auto;
		padding: 0 var(--side-nav);
		max-width: 120rem;
	}

	.page-speed {
		text-align: center;
	}

	.adapters {
		max-width: 525px;
		text-align: center;
	}

	h3 {
		margin-bottom: 0.8rem;
	}	

	.bullet-container {
 		display: grid; 
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: 1fr 1fr;
		gap: 5em 5em; 
		grid-template-areas: 
  			". ."
			". ."; 
	}
	.bullet-container h4 {
		margin-bottom: 0.8rem;
	}
</style>
