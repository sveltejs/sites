<script>
	import Permalink from '../components/Permalink.svelte';
	import Icon from '../components/Icon.svelte';

	export let section;
	export let base;
	export let edit;
</script>

<section data-id={section.slug}>
	<h2>
		<span class="offset-anchor" id={section.slug} />
		{@html section.title}
		<Permalink href="{base}#{section.slug}" />
		<small>
			<a href={edit} title="edit this section">
				<Icon name="edit" />
			</a>
		</small>
	</h2>

	{@html section.content}
</section>
