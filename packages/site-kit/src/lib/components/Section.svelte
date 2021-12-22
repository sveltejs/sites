<section>
	<slot />
</section>

<style>
	section {
		position: relative;
		margin-inline: auto;
		margin-block: 0;
		padding-inline: var(--side-nav);
		padding-block: 10rem;
		max-inline-size: 120rem;
	}

	section :global(h3) {
		color: var(--text);
	}
</style>
