<section>
	<slot />
</section>

<style>
	section {
		position: relative;
		margin: -12rem auto 10rem auto;
		padding: 0 var(--side-nav);
		max-width: 120rem;
	}

	section :global(h3) {
		color: var(--text);
	}
</style>
