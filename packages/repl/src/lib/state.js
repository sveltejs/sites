import { tick } from 'svelte';
import { derived, get, writable } from 'svelte/store';

/**
 * @typedef {import('./types').ReplState} ReplState
 */

/** @type {import('svelte/types/compiler').CompileOptions} */
const DEFAULT_COMPILE_OPTIONS = {
	generate: 'dom',
	dev: false,
	css: 'injected',
	hydratable: false,
	customElement: false,
	immutable: false,
	legacy: false,
};

/** @type {Map<string, import('@codemirror/state').EditorState>} */
export const EDITOR_STATE_MAP = new Map();

/** @param {import('./types').File} file */
export function get_full_filename(file) {
	return `${file.name}.${file.type}`;
}

/** @type {Symbol}  */
let current_token;
export async function rebundle() {
	const token = (current_token = Symbol());
	const result = await get(bundler)?.bundle(get(files));
	if (result && token === current_token) bundle.set(result);
}

/** @type {boolean}  */
let is_select_changing;

/**
 * @param {number} index
 */
export async function handle_select(index) {
	is_select_changing = true;

	const $module_editor = get(module_editor);
	const $compile_options = get(compile_options);
	const $output = get(output);
	const $selected = get(selected);

	if (!$selected) return;

	selected_index.set(index);

	await tick();

	EDITOR_STATE_MAP.set(get_full_filename($selected), $module_editor?.getEditorState());

	const $new_selected = get(selected);

	if (!$new_selected) return;

	await $module_editor?.set({ code: $new_selected.source, lang: $new_selected.type });

	if (EDITOR_STATE_MAP.has(get_full_filename($new_selected))) {
		$module_editor?.setEditorState(EDITOR_STATE_MAP.get(get_full_filename($new_selected)));
	} else {
		$module_editor?.clearEditorState();
	}

	$output?.set($new_selected, $compile_options);

	is_select_changing = false;
}

/**
 * @param {CustomEvent<{ value: string }>} event
 */
export async function handle_change(event) {
	if (is_select_changing) return;

	const $selected_index = get(selected_index);
	const $output = get(output);
	const $compile_options = get(compile_options);
	const $selected = get(selected);

	files.update(($files) => {
		const file = { ...$selected };

		file.source = event.detail.value;
		file.modified = true;

		// @ts-ignore
		$files[$selected_index] = file;

		return $files;
	});

	await tick();

	// recompile selected component
	$output?.update(get(selected), $compile_options);

	rebundle();
}

/** @param {import('./types').MessageDetails | undefined} item */
export async function go_to_warning_pos(item) {
	if (!item) return;

	const match = /^(.+)\.(\w+)$/.exec(item.filename);
	if (!match) return; // ???

	const $files = get(files);
	const $module_editor = get(module_editor);

	const [, name, type] = match;
	const file_index = $files.findIndex((file) => file.name === name && file.type === type);

	if (file_index === -1) return;

	await handle_select(file_index);

	$module_editor?.focus();
	$module_editor?.setCursor(item.start.character);
}

/** Deletes all editor state */
export function clear_state() {
	const $module_editor = get(module_editor);

	$module_editor?.clearEditorState();

	EDITOR_STATE_MAP.clear();
}

/** @type {import('svelte/store').Writable<ReplState['files']>} */
export const files = writable([]);

/** @type {import('svelte/store').Writable<ReplState['selected_index']>} */
export const selected_index = writable(-1);

/** @type {import('svelte/store').Readable<import('./types').File | null>} */
export const selected = derived([files, selected_index], ([$files, $selected_index]) => {
	return $selected_index !== -1 ? $files?.[$selected_index] ?? null : null;
});

/** @type {import('svelte/store').Writable<ReplState['bundle']>} */
export const bundle = writable(null);

/** @type {import('svelte/store').Writable<ReplState['compile_options']>} */
export const compile_options = writable(DEFAULT_COMPILE_OPTIONS);

/** @type {import('svelte/store').Writable<ReplState['cursor_pos']>} */
export const cursor_pos = writable(0);

/** @type {import('svelte/store').Writable<ReplState['module_editor']>} */
export const module_editor = writable(null);

/** @type {import('svelte/store').Writable<ReplState['output']>} */
export const output = writable(null);

/** @type {import('svelte/store').Writable<ReplState['toggleable']>} */
export const toggleable = writable(false);

/** @type {import('svelte/store').Writable<import('./Bundler').default | null>} */
export const bundler = writable(null);
