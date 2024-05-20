<script>
	import { get_repl_context } from '$lib/state.svelte.js';
	import { get_full_filename } from '$lib/utils.js';
	import { tick } from 'svelte';

	/**
	 * @type {{
	 * show_modified: boolean
	 * onadd?: (data: { files: import('$lib/types').File[], diff: import('$lib/types').File }) => void;
	 * onremove?: (data: { files: import('$lib/types').File[], diff: import('$lib/types').File }) => void;
	 * }}
	 */
	const { show_modified, onadd, onremove } = $props();

	const repl_state = get_repl_context();

	/** @type {string | null} */
	let editing_name = $state(null);

	let input_value = $state('');

	/** @param {string} filename */
	function select_file(filename) {
		if (repl_state.selected_name !== filename) {
			editing_name = null;
			repl_state.handle_select(filename);
		}
	}

	/** @param {import('$lib/types').File} file */
	function edit_tab(file) {
		if (repl_state.selected_name === get_full_filename(file)) {
			editing_name = get_full_filename(file);
			input_value = file.name;
		}
	}

	$inspect(repl_state.files).with(console.trace);

	async function close_edit() {
		const match = /(.+)\.(svelte|js|json|md|css)$/.exec(input_value ?? '');

		const edited_file = $state
			.snapshot(repl_state.files)
			.find((val) => get_full_filename(val) === editing_name);

		if (!edited_file) return;

		edited_file.name = match ? match[1] : input_value;

		if (!repl_state.selected) return;

		if (is_file_name_used(repl_state.selected)) {
			let i = 1;
			let name = repl_state.selected.name;

			do {
				const file = repl_state.files.find(
					(val) =>
						get_full_filename(val) === get_full_filename(edited_file) &&
						// @ts-ignore
						val.source === repl_state.selected.source
				);

				if (!file) break;

				file.name = `${name}_${i++}`;
			} while (is_file_name_used(repl_state.selected));

			const idx = repl_state.files.findIndex(
				(val) => get_full_filename(val) === get_full_filename(edited_file)
			);

			repl_state.files[idx] = edited_file;
		}

		const idx = repl_state.files.findIndex((val) => get_full_filename(val) === editing_name);

		if (match?.[2]) edited_file.type = match[2];
		repl_state.files[idx] = edited_file;

		if (editing_name) {
			const old_state = repl_state.editor_state_map.get(editing_name);
			if (old_state) {
				repl_state.editor_state_map.set(get_full_filename(edited_file), old_state);
				repl_state.editor_state_map.delete(editing_name);
			}
		}

		editing_name = null;

		// re-select, in case the type changed
		await repl_state.handle_select(get_full_filename(edited_file));

		// focus the editor, but wait a beat (so key events aren't misdirected)
		await tick();

		repl_state.module_editor?.focus();

		repl_state.rebundle();
	}

	/**
	 * @param {string} filename
	 */
	function remove(filename) {
		const file = repl_state.files.find((val) => get_full_filename(val) === filename);
		const idx = repl_state.files.findIndex((val) => get_full_filename(val) === filename);

		if (!file) return;

		let result = confirm(`Are you sure you want to delete ${get_full_filename(file)}?`);

		if (!result) return;

		repl_state.files = repl_state.files.filter((file) => get_full_filename(file) !== filename);

		onremove?.({ files: repl_state.files, diff: file });

		repl_state.editor_state_map.delete(get_full_filename(file));
		repl_state.handle_select(
			(repl_state.selected_name = idx === 1 ? 'App.svelte' : get_full_filename(file))
		);
	}

	/** @param {FocusEvent & { currentTarget: HTMLInputElement }} event */
	async function select_input(event) {
		await tick();

		event.currentTarget.select();
	}

	let uid = 1;

	function add_new() {
		const file = {
			name: uid++ ? `Component${uid}` : 'Component1',
			type: 'svelte',
			source: '',
			modified: true
		};

		repl_state.files.push(file);

		editing_name = get_full_filename(file);

		input_value = file.name;

		repl_state.handle_select(editing_name);

		repl_state.rebundle();

		onadd?.({ files: repl_state.files, diff: file });
	}

	/** @param {import('$lib/types').File} editing */
	function is_file_name_used(editing) {
		return repl_state.files.find(
			(file) =>
				JSON.stringify(file) !== JSON.stringify(repl_state.selected) && file.name === editing.name
		);
	}

	// drag and drop
	/** @type {string | null} */
	let from = null;

	/** @type {string | null} */
	let over = $state(null);

	/** @param {DragEvent & { currentTarget: HTMLDivElement }} event */
	function drag_start(event) {
		from = event.currentTarget.id;
	}

	function drag_leave() {
		over = null;
	}

	/** @param {DragEvent & { currentTarget: HTMLDivElement }} event */
	function dragOver(event) {
		over = event.currentTarget.id;
	}

	function drag_end() {
		if (from && over) {
			const from_index = repl_state.files.findIndex((file) => file.name === from);
			const to_index = repl_state.files.findIndex((file) => file.name === over);

			const from_component = repl_state.files[from_index];

			repl_state.files.splice(from_index, 1);

			repl_state.files = repl_state.files
				.slice(0, to_index)
				.concat(from_component)
				.concat(repl_state.files.slice(to_index));
		}

		from = over = null;
	}
</script>

<div class="component-selector">
	{#if repl_state.files.length}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="file-tabs" ondblclick={add_new}>
			{#each repl_state.files as file, index (file.name)}
				{@const filename = get_full_filename(file)}
				<div
					id={file.name}
					class="button"
					role="button"
					tabindex="0"
					class:active={filename === repl_state.selected_name}
					class:draggable={filename !== editing_name && index !== 0}
					class:drag-over={over === file.name}
					onclick={() => select_file(filename)}
					onkeyup={(e) => e.key === ' ' && select_file(filename)}
					ondblclick={(e) => e.stopPropagation()}
					draggable={filename !== editing_name}
					ondragstart={drag_start}
					ondragover={(e) => {
						e.preventDefault();
						dragOver(e);
					}}
					ondragleave={drag_leave}
					ondrop={(e) => {
						e.preventDefault();
						drag_end();
					}}
				>
					<i class="drag-handle"></i>
					{#if file.name === 'App' && filename !== editing_name}
						<div class="uneditable">
							App.svelte{#if show_modified && file.modified}*{/if}
						</div>
					{:else if filename === editing_name}
						{@const editing_file = repl_state.files.find(
							(file) => get_full_filename(file) === editing_name
						)}

						{#if editing_file}
							<span class="input-sizer">
								{input_value + (/\./.test(input_value) ? '' : `.${editing_file.type}`)}
							</span>

							<!-- svelte-ignore a11y_autofocus -->
							<input
								autofocus
								spellcheck={false}
								bind:value={input_value}
								onfocus={select_input}
								onblur={close_edit}
								onkeydown={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault();
										if (!is_file_name_used(editing_file)) {
											e.currentTarget.blur();
										}
									}
								}}
								class:duplicate={is_file_name_used(editing_file)}
							/>
						{/if}
					{:else}
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="editable"
							title="edit component name"
							onclick={() => edit_tab(file)}
							onkeyup={(e) => e.key === ' ' && edit_tab(file)}
						>
							{file.name}.{file.type}{#if show_modified && file.modified}*{/if}
						</div>

						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<span
							class="remove"
							onclick={() => remove(filename)}
							onkeyup={(e) => e.key === ' ' && remove(filename)}
						>
							<svg width="12" height="12" viewBox="0 0 24 24">
								<line stroke="#999" x1="18" y1="6" x2="6" y2="18" />
								<line stroke="#999" x1="6" y1="6" x2="18" y2="18" />
							</svg>
						</span>
					{/if}
				</div>
			{/each}

			<button class="add-new" onclick={add_new} title="add new component">
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
