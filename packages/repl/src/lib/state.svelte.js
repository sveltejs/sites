import { EditorState } from '@codemirror/state';
import { get_full_filename } from './utils';
import { getContext, setContext } from 'svelte';
import { get } from 'svelte/store';

const key = Symbol('repl');

/** @type {import('./compilers.d.ts').Compilers['V4']} */
const DEFAULT_COMPILE_OPTIONS = {
	generate: 'dom',
	dev: false,
	css: 'injected',
	customElement: false,
	immutable: false
};

/**
 * @param {object} param0
 * @param {(({ files }: {files: import('./types').File[]}) => void) | undefined} param0.onchange
 * @param {ReturnType<typeof import('@neocodemirror/svelte').withCodemirrorInstance>} param0.cm_instance
 */
export function create_repl_state({ onchange, cm_instance }) {
	/** @type {import("./types").File[]} */
	let files = $state([]);

	let selected_name = $state('App.svelte');

	/** @type {import("./types").File | null} */
	const selected = $derived(
		files.find((val) => get_full_filename(val) === selected_name) ?? {
			name: '',
			type: '',
			source: '',
			modified: false
		}
	);

	let bundle = /** @type {import("./types").Bundle | null} */ ($state(null));

	/** @type {Promise<void>} */
	let bundling = $state(Promise.resolve());

	let bundler = /** @type {import('./Bundler').default | null} */ ($state(null));

	/** @type {import('./compilers').Compilers['V4']} */
	let compile_options = $state(DEFAULT_COMPILE_OPTIONS);

	let cursor_pos = $state(0);

	let toggleable = $state(false);

	let module_editor = /** @type {import('./CodeMirror.svelte').default | null} */ ($state(null));

	let output = /** @type {import('./Output/Output.svelte').default | null} */ ($state(null));

	let is_select_changing = false;

	/** @type {Symbol}  */
	let current_token;
	async function rebundle() {
		const token = (current_token = Symbol());
		let resolver = () => {};
		bundling = new Promise((resolve) => {
			resolver = resolve;
		});
		const result = await bundler?.bundle($state.snapshot(files));
		if (result && token === current_token) bundle = result;
		resolver();
	}

	/**
	 * @param {string} filename
	 */
	async function handle_select(filename) {
		is_select_changing = true;

		selected_name = filename;

		if (!selected) return;

		await module_editor?.set({ code: selected.source, lang: selected.type });

		// if (editor_state_map.has(filename)) {
		// 	module_editor?.setEditorState(editor_state_map.get(filename));
		// } else {
		// 	module_editor?.clearEditorState();
		// }

		output?.set(selected, compile_options);

		is_select_changing = false;
	}

	/**
	 * @param {{ value: string }} event
	 */
	async function handle_change(event) {
		if (is_select_changing) return;

		const file = selected
			? { ...$state.snapshot(selected) }
			: { name: '', type: '', source: '', modified: false };

		file.source = event.value ?? '';
		file.modified = true;

		const idx = files.findIndex((val) => get_full_filename(val) === selected_name);

		files[idx] = file;

		if (!selected) return;

		// editor_state_map.set(get_full_filename(selected), module_editor?.getEditorState());

		onchange?.({ files });

		rebundle();
	}

	/** @param {import('./types').MessageDetails | undefined} item */
	async function go_to_warning_pos(item) {
		if (!item) return;

		// If its a bundler error, can't do anything about it
		if (!item.filename) return;

		await handle_select(item.filename);

		module_editor?.focus();
		module_editor?.setCursor(item.start.character);
	}

	/** Deletes all editor state */
	function clear_state() {
		module_editor?.clearEditorState();

		get(cm_instance).documents.clear();
	}

	return {
		get files() {
			return files;
		},
		set files(value) {
			files = value;
		},
		get selected_name() {
			return selected_name;
		},
		set selected_name(value) {
			selected_name = value;
		},
		get selected() {
			return selected;
		},
		get bundle() {
			return bundle;
		},
		set bundle(value) {
			bundle = value;
		},
		get bundling() {
			return bundling;
		},
		set bundling(value) {
			bundling = value;
		},
		get bundler() {
			return bundler;
		},
		set bundler(value) {
			bundler = value;
		},
		get compile_options() {
			return compile_options;
		},
		set compile_options(value) {
			compile_options = value;
		},
		get cursor_pos() {
			return cursor_pos;
		},
		set cursor_pos(value) {
			cursor_pos = value;
		},
		get toggleable() {
			return toggleable;
		},
		set toggleable(value) {
			toggleable = value;
		},
		get module_editor() {
			return module_editor;
		},
		set module_editor(value) {
			module_editor = value;
		},
		get output() {
			return output;
		},
		set output(value) {
			output = value;
		},
		get editor_state_map() {
			return get(cm_instance).documents;
		},
		set editor_state_map(value) {
			cm_instance.setKey('documents', value);
		},

		rebundle,
		handle_select,
		handle_change,
		go_to_warning_pos,
		clear_state
	};
}

/** @returns {ReturnType<typeof create_repl_state>} */
export function get_repl_context() {
	return getContext(key);
}

/** @param {ReturnType<typeof create_repl_state>} value */
export function set_repl_context(value) {
	setContext(key, value);
}
