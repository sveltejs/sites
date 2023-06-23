<script>
	import { get_repl_context } from '$lib/context.js';
	import { get_full_filename } from '$lib/utils.js';
	import { createEventDispatcher } from 'svelte';

	export let show_modified = false;

	/** @type {ReturnType<typeof createEventDispatcher<{
	 * remove: { files: import('$lib/types').File[]; diff: import('$lib/types').File },
	 * add: { files: import('$lib/types').File[]; diff: import('$lib/types').File },
	 * }>>} */
	const dispatch = createEventDispatcher();

	/** @type {string | null} */
	let editing_name = null;

	const {
		files,
		handle_select,
		module_editor,
		rebundle,
		selected,
		selected_name,
		EDITOR_STATE_MAP
	} = get_repl_context();

	let uid = 1;

	function add_new() {
		const file = {
			name: uid++ ? `Component${uid}` : 'Component1',
			type: 'svelte',
			source: '',
			modified: true
		};

		$files = $files.concat(file);

		editing_name = get_full_filename(file);

		handle_select(editing_name);

		dispatch('add', { files: $files, diff: file });
	}
</script>

<div class="component-selector">
	{#if $files.length}
		<div class="file-tabs" on:dblclick={add_new}>
			{#each $files as file, index (file.name)}
				{@const filename = get_full_filename(file)}

				<button
					class="button"
					id={filename}
					class:active={filename === $selected_name}
					class:draggable={filename !== editing_name && index !== 0}
				>
					<i class="drag-handle" />
					{#if file.name === 'App' && filename !== editing_name}
						<div class="uneditable">
							App.svelte{#if show_modified && file.modified}*{/if}
						</div>
					{:else if filename === editing_name}{/if}
				</button>
			{/each}

			<button class="add-new" on:click={add_new} title="add new component">
				<svg width="12" height="12" viewBox="0 0 24 24">
					<line stroke="#999" x1="12" y1="5" x2="12" y2="19" />
					<line stroke="#999" x1="5" y1="12" x2="19" y2="12" />
				</svg>
			</button>
		</div>
	{/if}
</div>

<style>
	.component-selector {
		position: relative;
		border-bottom: 1px solid var(--sk-text-4);
		overflow: hidden;
	}

	.file-tabs {
		border: none;
		margin: 0;
		white-space: nowrap;
		overflow-x: auto;
		overflow-y: hidden;
		height: 10em;
	}

	.file-tabs .button,
	.file-tabs button {
		position: relative;
		display: inline-block;
		font: 400 12px/1.5 var(--sk-font);
		background: var(--sk-back-1);
		border: none;
		border-bottom: 3px solid transparent;
		padding: 12px 14px 8px 16px;
		margin: 0;
		color: var(--sk-text-3);
		border-radius: 0;
		cursor: pointer;
	}

	.file-tabs .button.active {
		/* color: var(--second); */
		color: var(--sk-text-2, #333);
		border-bottom: 3px solid var(--sk-theme-1);
	}

	.editable,
	.uneditable,
	.input-sizer,
	input {
		display: inline-block;
		position: relative;
		line-height: 1;
	}

	.input-sizer {
		color: var(--sk-text-3, #ccc);
	}

	input {
		position: absolute;
		width: 100%;
		left: 16px;
		top: 12px;
		font: 400 12px/1.5 var(--sk-font);
		border: none;
		color: var(--sk-theme-3);
		outline: none;
		background-color: transparent;
	}

	.duplicate {
		color: var(--sk-theme-1);
	}

	.remove {
		position: absolute;
		display: none;
		right: 1px;
		top: 4px;
		width: 16px;
		text-align: right;
		padding: 12px 0 12px 5px;
		font-size: 8px;
		cursor: pointer;
	}

	.remove:hover {
		color: var(--sk-theme-3);
	}

	.file-tabs .button.active .editable {
		cursor: text;
	}

	.file-tabs .button.active .remove {
		display: block;
	}

	.file-tabs .button.drag-over {
		background: #67677814;
	}

	.file-tabs .button.drag-over {
		cursor: move;
	}

	.add-new {
		position: absolute;
		left: 0;
		top: 0;
		padding: 12px 10px 8px 0 !important;
		height: 40px;
		text-align: center;
		background-color: white;
	}

	.add-new:hover {
		color: var(--sk-theme-3) !important;
	}

	.drag-handle {
		cursor: move;
		width: 5px;
		height: 25px;
		position: absolute;
		left: 5px;
		top: 9px;
		--drag-handle-color: #dedede;
		background: linear-gradient(
			to right,
			var(--sk-back-4, --drag-handle-color) 1px,
			var(--sk-back-1, white) 1px,
			var(--sk-back-1, white) 2px,
			var(--sk-back-4, --drag-handle-color) 2px,
			var(--sk-back-4, --drag-handle-color) 3px,
			var(--sk-back-1, white) 3px,
			var(--sk-back-1, white) 4px,
			var(--sk-back-4, --drag-handle-color) 4px
		);
	}

	svg {
		position: relative;
		overflow: hidden;
		vertical-align: middle;
		-o-object-fit: contain;
		object-fit: contain;
		-webkit-transform-origin: center center;
		transform-origin: center center;

		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
		fill: none;
	}
</style>
