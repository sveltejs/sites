<script>
	import { getContext } from 'svelte';

	export let ast;
	export let collapsed = true;

	$: is_ast_array = Array.isArray(ast);

	const { mark_text, unmark_text } = getContext('REPL');

	function make_preview(sub_ast) {
		if (Array.isArray(sub_ast)) {
			return `[ ${sub_ast.length} element${sub_ast.length === 1 ? '' : 's'} ]`;
		} else {
			return `{ ${Object.keys(sub_ast).join(', ')} }`;
		}
	}

	function highlight(node, sub_ast) {
		let can_highlight =
			sub_ast && typeof sub_ast.start === 'number' && typeof sub_ast.end === 'number';

		function handle_mark_text(e) {
			if (can_highlight) {
				e.stopPropagation();
				mark_text({ from: sub_ast.start, to: sub_ast.end });
			}
		}

		function handle_unmark_text(e) {
			if (can_highlight) {
				e.stopPropagation();
				unmark_text();
			}
		}

		node.addEventListener('mouseover', handle_mark_text);
		node.addEventListener('mouseleave', handle_unmark_text);

		return {
			update(new_sub_ast) {
				sub_ast = new_sub_ast;
				can_highlight =
					sub_ast && typeof sub_ast.start === 'number' && typeof sub_ast.end === 'number';
			},
			destroy() {
				node.removeEventListener('mouseover', handle_mark_text);
				node.removeEventListener('mouseleave', handle_unmark_text);
			}
		};
	}
</script>

<ul>
	{#each Object.entries(ast) as [k, v]}
		<li use:highlight={v}>
			{#if !is_ast_array}
				<span>{k}:</span>
			{/if}
			{#if v && typeof v === 'object'}
				{#if collapsed}
					<button class="preview" on:click={() => (collapsed = false)}>
						{make_preview(v)}
					</button>
				{:else}
					<span>{Array.isArray(v) ? '[' : '{'}</span>
					<svelte:self ast={v} />
					<span>{Array.isArray(v) ? ']' : '}'}</span>
				{/if}
			{:else}
				<span class="token {typeof v}">
					{JSON.stringify(v)}
				</span>
			{/if}
		</li>
	{/each}
</ul>

<style>
	ul {
		padding: 0 0 0 2ch;
		margin: 0;
		list-style-type: none;
	}

	.preview {
		opacity: 0.8;
		font-style: italic;
	}
</style>
