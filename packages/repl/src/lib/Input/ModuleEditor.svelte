<script>
	import { bundle, handle_change, module_editor, selected } from '$lib/state';
	import CodeMirror from '../CodeMirror.svelte';
	import Message from '../Message.svelte';

	/** @type {import('$lib/types').StartOrEnd | null} */
	export let errorLoc = null;
	// export let theme;

	export function focus() {
		$module_editor?.focus();
	}

	/** @type {import('$lib/types').Error | null | undefined} */
	let error = null;

	/** @type {import('$lib/types').Warning[]} */
	let warnings = [];

	/** @type {NodeJS.Timeout} */
	let timeout;

	$: filename = $selected?.name + '.' + $selected?.type;

	$: if ($bundle) {
		clearTimeout(timeout);

		// if there's already an error/warnings displayed, update them
		if (error) error = $bundle.error;
		if (warnings.length > 0) warnings = $bundle.warnings;

		timeout = setTimeout(() => {
			error = $bundle?.error;
			warnings = $bundle?.warnings ?? [];
		}, 400);
	}
</script>

<div class="editor-wrapper">
	<div class="editor notranslate" translate="no">
		<CodeMirror bind:this={$module_editor} {errorLoc} on:change on:change={handle_change} />
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
		/* height: 100%; */
	}
</style>
