<script>
	/** @type {any} */
	export let data;

	/** @type {string} */
	export let alt;

	let sources;

	$: {
		sources = {};

		data.forEach((img) => {
			if (!sources[img.format]) {
				sources[img.format] = {
					type: `image/${img.format}`,
					srcset: []
				};
			}

			sources[img.format].srcset.push(`${img.src} ${img.width}w`);
		});
	}

	$: fallback = data
		.filter((img) => img.format === 'png' || img.format === 'jpg')
		.sort((a, b) => a.width - b.width)
		.pop();
</script>

<picture>
	{#each Object.values(sources) as source}
		<source type={source.type} srcset={source.srcset.join(', ')} />
	{/each}
	<img src={fallback.src} {alt} width={fallback.width} height={fallback.height} />
</picture>

<style>
	img {
		display: block;
		inline-size: 100%;
		block-size: auto;
		max-block-size: var(--max-height, 100%);
		object-fit: cover;
	}
</style>
