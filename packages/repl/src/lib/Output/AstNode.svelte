<script>
	import { getContext } from 'svelte';

	export let key = '';
	export let value = undefined;
	export let collapsed = true;
	export let root = false;

	const { mark_text, unmark_text } = getContext('REPL');

	$: is_ast_array = Array.isArray(value);
	$: is_collapsable = value && typeof value === 'object';
	$: is_markable = value && typeof value.start === 'number' && typeof value.end === 'number';
	$: key_text = key ? `${key}:` : '';

	let preview_text;
	$: if (is_collapsable && collapsed) {
		if (is_ast_array) {
			preview_text = `[ ${value.length} element${value.length === 1 ? '' : 's'} ]`;
		} else {
			preview_text = `{ ${Object.keys(value).join(', ')} }`;
		}
	}

	function handle_mark_text(e) {
		if (is_markable) {
			e.stopPropagation();
			mark_text({ from: value.start, to: value.end });
		}
	}

	function handle_unmark_text(e) {
		if (is_markable) {
			e.stopPropagation();
			unmark_text();
		}
	}
</script>

<li on:mouseover={handle_mark_text} on:focus={handle_mark_text} on:mouseleave={handle_unmark_text}>
	{#if !root && is_collapsable}
		<button class="toggle" class:open={!collapsed} on:click={() => (collapsed = !collapsed)}>
			{key_text}
		</button>
	{:else if key_text}
		<span>{key_text}</span>
	{/if}
	{#if is_collapsable}
		{#if collapsed}
			<button class="preview" on:click={() => (collapsed = !collapsed)}>
				{preview_text}
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
