<script>
	import { getContext } from 'svelte';

	export let key = '';
	export let value = undefined;
	export let collapsed = true;

	$: is_ast_array = Array.isArray(value);
	$: is_collapsable = value && typeof value === 'object';
	$: key_text = key ? `${key}:` : '';

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

<li use:highlight={value}>
	{#if is_collapsable}
		<button class="toggle" class:open={!collapsed} on:click={() => (collapsed = !collapsed)}>
			{key_text}
		</button>
	{:else if key_text}
		<span>{key_text}</span>
	{/if}
	{#if is_collapsable}
		{#if collapsed}
			<button class="preview" on:click={() => (collapsed = !collapsed)}>
				{make_preview(value)}
			</button>
		{:else}
			<span>{is_ast_array ? '[' : '{'}</span>
			<ul>
				{#each Object.entries(value) as [k, v]}
					<svelte:self key={is_ast_array ? '' : k} value={v} />
				{/each}
			</ul>
			<span>{is_ast_array ? ']' : '}'}</span>
		{/if}
	{:else}
		<span class="token {typeof value}">
			{JSON.stringify(value)}
		</span>
	{/if}
</li>

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

	button:hover {
		text-decoration: underline;
	}

	.toggle {
		position: relative;
	}

	.toggle::before {
		content: '\25B6';
		position: absolute;
		bottom: 0;
		left: -1.3rem;
		opacity: 0.7;
	}

	.toggle.open::before {
		content: '\25BC';
	}
</style>
