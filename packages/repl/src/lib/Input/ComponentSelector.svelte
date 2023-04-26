<script>
	import {
		files,
		handle_select,
		module_editor,
		rebundle,
		selected,
		selected_index,
	} from '$lib/state';
	import { createEventDispatcher, tick } from 'svelte';

	/** @type {boolean}  */
	export let show_modified;

	/** @type {ReturnType<typeof createEventDispatcher<{
	 * remove: { files: import('$lib/types').File[] },
	 * add: { files: import('$lib/types').File[] },
	 * }>>} */
	const dispatch = createEventDispatcher();

	/** @type {number} */
	let editing_index = -1;

	/** @param {number} index */
	function select_file(index) {
		if ($selected_index !== index) {
			editing_index = -1;
			handle_select(index);
		}
	}

	/** @param {number} index */
	function edit_tab(index) {
		if ($selected_index === index) {
			editing_index = $selected_index;
		}
	}

	async function close_edit() {
		const match = /(.+)\.(svelte|js|json|md)$/.exec($selected?.name ?? '');

		const edited_file = $files[editing_index];
		edited_file.name = match ? match[1] : edited_file.name;

		if (!$selected) return;

		if (is_file_name_used($selected)) {
			let i = 1;
			let name = $selected.name;

			do {
				$files[$selected_index].name = `${name}_${i++}`;
			} while (is_file_name_used($selected));

			$files[$selected_index] = edited_file;
		}

		if (match?.[2]) $files[$selected_index].type = match[2];

		editing_index = -1;

		// re-select, in case the type changed
		handle_select($selected_index);

		// focus the editor, but wait a beat (so key events aren't misdirected)
		await tick();

		$module_editor?.focus();

		rebundle();
	}

	/**
	 * @param {number} index
	 */
	function remove(index) {
		let result = confirm(
			`Are you sure you want to delete ${$files[index].name}.${$files[index].type}?`
		);

		if (!result) return;

		if (index !== -1) {
			$files = $files.slice(0, index).concat($files.slice(index + 1));

			dispatch('remove', { files: $files });
		} else {
			console.error(`Could not find component! That's... odd`);
		}

		handle_select(($selected_index = index - 1));
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
			modified: true,
		};

		$files = $files.concat(file);

		editing_index = $files.length - 1;

		handle_select(editing_index);

		dispatch('add', { files: $files });
	}

	/** @param {import('$lib/types').File} editing */
	function is_file_name_used(editing) {
		return $files.find(
			(file) => JSON.stringify(file) !== JSON.stringify($selected) && file.name === editing.name
		);
	}

	// drag and drop
	/** @type {string | null} */
	let from = null;

	/** @type {string | null} */
	let over = null;

	/** @param {DragEvent & { currentTarget: HTMLDivElement }} event */
	function dragStart(event) {
		from = event.currentTarget.id;
	}

	function dragLeave() {
		over = null;
	}

	/** @param {DragEvent & { currentTarget: HTMLDivElement }} event */
	function dragOver(event) {
		over = event.currentTarget.id;
	}

	/** @param {DragEvent & { currentTarget: HTMLDivElement }} event */
	function dragEnd(event) {
		if (from && over) {
			const from_index = $files.findIndex((file) => file.name === from);
			const to_index = $files.findIndex((file) => file.name === over);

			const from_component = $files[from_index];

			$files.splice(from_index, 1);

			$files = $files.slice(0, to_index).concat(from_component).concat($files.slice(to_index));
		}

		from = over = null;
	}
</script>

<div class="component-selector">
	{#if $files.length}
		<div class="file-tabs" on:dblclick={add_new}>
			{#each $files as file, index (file)}
				<div
					id={file.name}
					class="button"
					role="button"
					tabindex="0"
					class:active={index === $selected_index}
					class:draggable={index !== editing_index && index !== 0}
					class:drag-over={over === file.name}
					on:click={() => select_file(index)}
					on:keyup={(e) => e.key === ' ' && select_file(index)}
					on:dblclick|stopPropagation={() => {}}
					draggable={index !== editing_index}
					on:dragstart={dragStart}
					on:dragover|preventDefault={dragOver}
					on:dragleave={dragLeave}
					on:drop|preventDefault={dragEnd}
				>
					<i class="drag-handle" />
					{#if file.name === 'App' && index !== editing_index}
						<div class="uneditable">
							App.svelte{#if show_modified && file.modified}*{/if}
						</div>
					{:else if index === editing_index}
						{@const file = $files[editing_index]}

						<span class="input-sizer">
							{file.name + (/\./.test(file.name) ? '' : `.${file.type}`)}
						</span>

						<!-- svelte-ignore a11y-autofocus -->
						<input
							autofocus
							spellcheck={false}
							bind:value={$files[editing_index].name}
							on:focus={select_input}
							on:blur={close_edit}
							on:keydown={(e) =>
								e.key === 'Enter' &&
								!is_file_name_used($files[editing_index]) &&
								e.currentTarget.blur()}
							class:duplicate={is_file_name_used($files[editing_index])}
						/>
					{:else}
						<div
							class="editable"
							title="edit component name"
							on:click={() => edit_tab(index)}
							on:keyup={(e) => e.key === ' ' && edit_tab(index)}
						>
							{file.name}.{file.type}{#if show_modified && file.modified}*{/if}
						</div>

						<span
							class="remove"
							on:click={() => remove(index)}
							on:keyup={(e) => e.key === ' ' && remove(index)}
						>
							<svg width="12" height="12" viewBox="0 0 24 24">
								<line stroke="#999" x1="18" y1="6" x2="6" y2="18" />
								<line stroke="#999" x1="6" y1="6" x2="18" y2="18" />
							</svg>
						</span>
					{/if}
				</div>
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
