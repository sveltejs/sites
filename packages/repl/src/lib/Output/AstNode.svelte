<script>
	import { getContext } from 'svelte';

	export let ast;
	export let collapsed = true;

	$: is_ast_array = Array.isArray(ast);

	const { mark_text, unmark_text } = getContext('REPL');

	function make_preview(sub_ast) {
		if (Array.isArray(sub_ast)) {
			return `[ ${sub_ast.length} elements ]`;
		} else {
			return `{ ${Object.keys(sub_ast).join(', ')} }`;
		}
	}

	function highlight(node, sub_ast) {
		function handle_mark_text() {
			if (sub_ast && typeof sub_ast.start === 'number' && typeof sub_ast.end === 'number') {
				mark_text({ from: sub_ast.start, to: sub_ast.end });
			}
		}

		node.addEventListener('mouseenter', handle_mark_text);
		node.addEventListener('mouseleave', unmark_text);

		return {
			update(new_sub_ast) {
				sub_ast = new_sub_ast;
			},
			destroy() {
				node.removeEventListener('mouseenter', handle_mark_text);
				node.removeEventListener('mouseleave', unmark_text);
			}
		};
	}
</script>

<ul>
	{#each Object.entries(ast) as [k, v]}
		<li>
			{#if !is_ast_array}
				<button class="node" use:highlight={v}>
					{k}:
				</button>
			{/if}
			{#if typeof v === 'object'}
				{#if collapsed}
					<button class="node preview" use:highlight={v} on:click={() => (collapsed = false)}>
						{make_preview(v)}
					</button>
				{:else}
					<svelte:self ast={v} />
				{/if}
			{:else}
				{JSON.stringify(v)}
			{/if}
		</li>
	{/each}
</ul>

<style>
	ul {
		padding-left: 2rem;
		list-style-type: none;
	}

	.preview {
		opacity: 0.8;
		font-style: italic;
	}
</style>
