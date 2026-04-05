<script>
	import { parse } from './htmlSubsetParse';
	/** @type {{ content: string }} */
	const { content } = $props();

	const parsedContent = $derived(parse(content));
</script>

{#snippet inline(/** @type {import("./htmlSubsetParse").Inline} */ child)}
	{#if child.type === 'text'}
		{child.text}
	{:else if child.type === 'link'}
		<a rel="external" href={child.href}>{child.text}</a>
	{:else if child.type === 'italic'}
		{#each child.children as subchild}
			{@render inline(subchild)}
		{/each}
	{/if}
{/snippet}

{#each parsedContent as block}
	{#if block.type === 'paragraph'}
		<p>
			{#each block.children as child}
				{@render inline(child)}
			{/each}
		</p>
	{:else}
		<pre><code>{block.text}</code></pre>
	{/if}
{/each}
