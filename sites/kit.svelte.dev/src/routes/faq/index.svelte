<script context="module">
	export async function load({ fetch }) {
		const faqs = await fetch('https://api.svelte.dev/docs/kit/faq?content').then(r => r.json());
		return { props: { faqs } };
	}
</script>

<script>
	export let faqs;
</script>

<svelte:head>
	<title>FAQ • SvelteKit</title>
	<meta name="twitter:title" content="SvelteKit FAQ" />
	<meta name="twitter:description" content="The fastest way to build Svelte apps" />
	<meta name="Description" content="The fastest way to build Svelte apps" />
</svelte:head>

<div class="faqs stretch">
	<h1>Frequently Asked Questions</h1>
	{#each faqs as faq}
		<article class="faq">
			<h2>
				<a id={faq.slug} class="offset-anchor" />
				<a class="anchor" sapper:prefetch href="faq#{faq.slug}" title={faq.title}>&nbsp;</a>
				{faq.title}
			</h2>
			{@html faq.content}
		</article>
	{/each}
	<p>
		See also the <a href="https://svelte.dev/faq" rel="external">Svelte FAQ</a> for questions relating
		to Svelte directly.
	</p>
</div>

<style>
	.faqs {
		grid-template-columns: 1fr 1fr;
		grid-gap: 1em;
		min-height: calc(100vh - var(--nav-h));
		padding: var(--top-offset) var(--side-nav) 6rem var(--side-nav);
		max-width: var(--main-width);
		margin: 0 auto;
		tab-size: 2;
	}

	.faqs :global(pre) :global(code) {
		padding: 0;
		margin: 0;
		top: 0;
		background: transparent;
		color: white;
	}

	.faqs :global(pre) {
		margin: 0 0 2rem 0;
		width: 100%;
		max-width: var(--linemax);
		padding: 1.5rem 2.5rem;
		background: #333;
		border-radius: 0.5rem;
		font-size: 0.8rem;
	}

	.faqs :global(.anchor) {
		position: absolute;
		display: block;
		background: url(/icons/link.svg) 0 50% no-repeat;
		background-size: 1em 1em;
		width: 1.4em;
		height: 1em;
		left: -1.3em;
		opacity: 0;
		transition: opacity 0.2s;
		border: none !important; /* TODO get rid of linkify */
	}

	.faqs :global(h2 > .anchor),
	.faqs :global(h3 > .anchor) {
		top: 0.2em;
	}

	@media (min-width: 768px) {
		.faqs :global(h2):hover :global(.anchor),
		.faqs :global(h3):hover :global(.anchor),
		.faqs :global(h4):hover :global(.anchor),
		.faqs :global(h5):hover :global(.anchor),
		.faqs :global(h6):hover :global(.anchor) {
			opacity: 1;
		}

		.faqs :global(h5) :global(.anchor),
		.faqs :global(h6) :global(.anchor) {
			top: 0.25em;
		}
	}

	h2 {
		display: inline-block;
		margin: 3.5rem 0 1rem 0;
		padding: 0;
		color: var(--text);
		max-width: 24em;
		font-size: var(--h3);
		font-weight: 400;
	}
	.faq:first-child {
		margin: 0 0 2rem 0;
		padding: 0 0 4rem 0;
		border-bottom: var(--border-w) solid #6767785b; /* based on --second */
	}
	.faq:first-child h2 {
		font-size: 4rem;
		font-weight: 400;
		color: var(--second);
	}
	.faq p {
		font-size: var(--h5);
		max-width: 30em;
		color: var(--second);
	}
	:global(.faqs .faq ul) {
		margin-left: 3.2rem;
	}
	.faqs :global(.anchor) {
		top: calc((var(--h3) - 24px) / 2);
	}
	@media (max-width: 768px) {
		.faqs :global(.anchor) {
			transform: scale(0.6);
			opacity: 1;
			left: -1em;
		}
	}
</style>
