<script>
	import { getContext } from 'svelte';
	import AstNode from './AstNode.svelte';

	export let ast;

	const { cursor_index } = getContext('REPL');
	let path_nodes;

	$: path_nodes = ast ? find_deepest($cursor_index, [ast]) : [];

	function find_deepest(cursor, paths) {
		const value = paths[paths.length - 1];

		for (const v of Object.values(value)) {
			if (typeof v === 'object') {
				const result = find_deepest(cursor, paths.concat([v]));
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
