<script>
	import AstNode from './AstNode.svelte';
	export let ast;
</script>

<div class="code-block">

<pre>
  <code>
    {#if typeof ast === 'object'}
			<span>&#123;</span>
			<AstNode {ast} collapsed={false} />
      <span>&#125;</span>
		{:else}
			<p>No AST available</p>
		{/if}
  </code>
</pre>
</div>

<style>
  .code-block, pre, code {
    height: 100%;
  }
	pre {
		white-space: normal;
    padding: 1rem;
	}
</style>
