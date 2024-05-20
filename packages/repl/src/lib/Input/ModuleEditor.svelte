<script>
	import { get_repl_context } from '$lib/state.svelte.js';
	import { get_full_filename } from '$lib/utils.js';
	import { untrack } from 'svelte';
	import CodeMirror from '../CodeMirror.svelte';
	import Message from '../Message.svelte';

	/**
	 * @type {{
	 *  errorLoc?: import('$lib/types').StartOrEnd | null;
	 * 	autocomplete: boolean;
	 * 	vim: boolean;
	 * }}
	 */
	const { errorLoc = null, autocomplete, vim } = $props();

	const repl_state = get_repl_context();

	export function focus() {
		repl_state.module_editor?.focus();
	}

	/** @type {import('$lib/types').Error | null | undefined} */
	let error = $state(null);

	/** @type {import('$lib/types').Warning[]} */
	let warnings = $state([]);

	const filename = $derived(repl_state.selected?.name + '.' + repl_state.selected?.type);

	$effect(() => {
		if (repl_state.bundle) {
			untrack(() => {
				error = repl_state.bundle?.error;
				warnings = repl_state.bundle?.warnings ?? [];
			});
		}
	});

	async function diagnostics() {
		await repl_state.bundling;

		return /** @type {import('@codemirror/lint').Diagnostic[]} */ ([
			...(repl_state.selected && error?.filename === get_full_filename(repl_state.selected)
				? [
						{
							from: error.start.character,
							to: error.end.character,
							severity: 'error',
							message: error.message
						}
					]
				: []),
			...warnings
				.filter(
					(warning) =>
						repl_state.selected && warning.filename === get_full_filename(repl_state.selected)
				)
				.map((warning) => ({
					from: warning.start.character,
					to: warning.end.character,
					severity: 'warning',
					message: warning.message
				}))
		]);
	}
</script>

<div class="editor-wrapper">
	<div class="editor notranslate" translate="no">
		<CodeMirror
			bind:this={repl_state.module_editor}
			{errorLoc}
			{autocomplete}
			{vim}
			{diagnostics}
			filename={get_full_filename(repl_state.selected)}
			onchange={repl_state.handle_change}
		/>
	</div>

	<div class="info">
		{#if error}
			<Message kind="error" details={error} {filename} />
		{:else if warnings.length > 0}
			{#each warnings as warning}
				<Message kind="warning" details={warning} {filename} />
			{/each}
		{/if}
	</div>
</div>

<style>
	.editor-wrapper {
		z-index: 5;
		background: var(--sk-back-3);
		display: flex;
		flex-direction: column;
	}

	.editor {
		height: 0;
		flex: 1 1 auto;
	}

	.info {
		background-color: var(--sk-theme-2);
		max-height: 50%;
		overflow: auto;
	}

	:global(.columns) .editor-wrapper {
		/* make it easier to interact with scrollbar */
		padding-right: 8px;
		height: auto;
		height: 100%;
	}
</style>
