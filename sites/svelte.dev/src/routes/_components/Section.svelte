<section>
	<div class="inner"><slot /></div>
</section>

<style>
	section {
		padding-block: 10rem;
		background: var(--background, white);
	}

	.inner {
		max-inline-size: 120rem;
		padding-inline: var(--side-nav);
		margin-inline: auto;
		margin-block: 0;
	}
</style>
