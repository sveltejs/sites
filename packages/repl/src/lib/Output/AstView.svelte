<script>
	import { getContext } from 'svelte';
	import AstNode from './AstNode.svelte';

	export let ast;

	const { cursor_index } = getContext('REPL');

	// $cursor_index may go over the max since ast computation is usually slower.
	// clamping this helps prevent the collapse view flashing
	$: max_cursor_index = !ast ? $cursor_index : Math.min($cursor_index, get_ast_max_end(ast));

	$: path_nodes = find_deepest_path(max_cursor_index, [ast]) || [];

	function find_deepest_path(cursor, paths) {
		const value = paths[paths.length - 1];

		if (!value) return;

		for (const v of Object.values(value)) {
			if (typeof v === 'object') {
				const result = find_deepest_path(cursor, paths.concat([v]));
				if (result) return result;
			}
		}

		if (
			typeof value.start === 'number' &&
			typeof value.end === 'number' &&
			value.start <= cursor &&
			cursor <= value.end
		) {
			return paths;
		}
	}

	function get_ast_max_end(ast) {
		let max_end = 0;

		for (const node of Object.values(ast)) {
			if (node && typeof node.end === 'number' && node.end > max_end) {
				max_end = node.end;
			}
		}

		return max_end;
	}
</script>

<div class="code-block">
	<pre>
		<code>
			{#if typeof ast === 'object'}
				<ul>
					<AstNode value={ast} {path_nodes} collapsed={false} />
				</ul>
			{:else}
				<p>No AST available</p>
			{/if}
		</code>
	</pre>
</div>

<style>
	.code-block,
	pre,
	code {
		height: 100%;
		block-size: 100%;
		font: 400 var(--code-fs)/1.7 var(--font-mono);
	}

	pre {
		white-space: normal;
		padding: 1rem;
	}

	ul {
		padding: 0;
		margin: 0;
		list-style-type: none;
	}
</style>
