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
		{#if ['http:', 'https:'].includes(new URL(child.href).protocol)}
			<a rel="external" href={child.href}>{child.text}</a>
		{:else}
			<!-- link might be other protocol like `javascript:` so bail out and do best effort render -->
			<del>{child.text}</del>
		{/if}
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
