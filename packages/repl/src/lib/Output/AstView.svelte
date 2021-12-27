<script>
	import AstNode from './AstNode.svelte';
	export let ast;
</script>

<div class="code-block">
	<pre>
		<code>
			{#if typeof ast === 'object'}
				<ul>
					
					<AstNode value={ast} root collapsed={false} />
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
