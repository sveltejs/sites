<script context="module">
	export const cursorIndex = writable(0);
</script>

<script>
	import { historyField } from '@codemirror/commands';
	import { EditorState, Range, StateEffect, StateEffectType, StateField } from '@codemirror/state';
	import { Decoration, EditorView } from '@codemirror/view';
	import { codemirror, withCodemirrorInstance } from '@neocodemirror/svelte';
	import { writable } from 'svelte/store';
	import Message from './Message.svelte';
	import { svelteTheme } from './theme.js';
	import { tick, untrack } from 'svelte';
	import { create_deferred_promise } from './utils';
	import { theme } from '@sveltejs/site-kit/stores';

	/**
	 * @type {{
	 * errorLoc?: import('./types').StartOrEnd | null;
	 * diagnostics?: import('@codemirror/lint').LintSource | undefined;
	 * readonly?: boolean;
	 * tab?: boolean;
	 * autocomplete?: boolean;
	 * vim?: boolean;
	 * filename?: string;
	 * onchange?: ({value}: {value: string}) => void;
	 * }}
	 */
	const {
		autocomplete = true,
		errorLoc = null,
		diagnostics = undefined,
		readonly = false,
		tab = true,
		vim = false,
		filename,

		onchange
	} = $props();

	// $inspect(filename);

	let code = $state('');

	/** @type {import('./types').Lang} */
	let lang = $state('svelte');

	/**
	 * @param {{ code: string; lang: import('./types').Lang }} options
	 */
	export async function set(options) {
		update(options);
	}

	/**
	 * @param {{ code?: string; lang?: import('./types').Lang }} options
	 */
	export async function update(options) {
		if (!$cmInstance.view) return;

		await tick();

		if (options.lang && options.lang !== lang) {
			// This will trigger change_mode
			lang = options.lang;
		}

		if (options.code !== undefined) {
			updating_externally = true;

			const { scrollLeft: left, scrollTop: top } = $cmInstance.view.scrollDOM;

			code = options.code;

			updating_externally = false;

			$cmInstance.view.scrollDOM.scrollTop = top;
			$cmInstance.view.scrollDOM.scrollLeft = left;
		}
	}

	/**
	 * @param {number} pos
	 */
	export function setCursor(pos) {
		cursor_pos = pos;
	}

	const is_ready_promise = create_deferred_promise();
	export const isReady = is_ready_promise.promise;

	export function resize() {
		$cmInstance.view?.requestMeasure();
	}

	export function focus() {
		$cmInstance.view?.focus();
	}

	export function getEditorState() {
		return $cmInstance.view?.state.toJSON({ history: historyField });
	}

	/**
	 * @param {any} state
	 */
	export function setEditorState(state) {
		if (!$cmInstance.view) return;

		$cmInstance.view.setState(
			EditorState.fromJSON(state, { extensions, doc: state.doc }, { history: historyField })
		);
		$cmInstance.view?.dispatch({
			changes: { from: 0, to: $cmInstance.view.state.doc.length, insert: state.doc },
			effects: [StateEffect.reconfigure.of($cmInstance.extensions ?? [])]
		});
	}

	export async function clearEditorState() {
		await tick();

		$cmInstance.view?.setState(EditorState.create({ extensions, doc: '' }));
		$cmInstance.view?.dispatch({
			changes: { from: 0, to: $cmInstance.view.state.doc.length, insert: '' },
			effects: [StateEffect.reconfigure.of($cmInstance.extensions ?? [])]
		});
	}

	/** @type {StateEffectType<Range<Decoration>[]>} */
	const addMarksDecoration = StateEffect.define();

	// This value must be added to the set of extensions to enable this
	const markField = StateField.define({
		// Start with an empty set of decorations
		create() {
			return Decoration.none;
		},
		// This is called whenever the editor updates—it computes the new set
		update(value, tr) {
			// Move the decorations to account for document changes
			value = value.map(tr.changes);
			// If this transaction adds or removes decorations, apply those changes
			for (let eff of tr.effects) {
				if (eff.is(addMarksDecoration)) value = value.update({ add: eff.value, sort: true });
			}
			return value;
		},
		// Indicate that this field provides a set of decorations
		provide: (f) => EditorView.decorations.from(f)
	});

	/**
	 * @param {object} param0
	 * @param {number} param0.from
	 * @param {number} param0.to
	 * @param {string} [param0.className]
	 */
	export function markText({ from, to, className = 'mark-text' }) {
		const executedMark = Decoration.mark({
			class: className
		});

		$cmInstance.view?.dispatch({
			effects: [
				StateEffect.appendConfig.of(markField),
				addMarksDecoration.of([executedMark.range(from, to)])
			]
		});
	}

	export function unmarkText() {
		$cmInstance.view?.dispatch({
			effects: StateEffect.reconfigure.of($cmInstance.extensions ?? [])
		});
	}

	const cmInstance = withCodemirrorInstance();

	/** @type {number} */
	let w;
	/** @type {number} */
	let h;

	let marked = false;

	/** @type {number | null}*/
	let error_line = null;

	let updating_externally = false;

	/** @type {import('@codemirror/state').Extension[]} */
	let extensions = $state([]);

	$effect(() => {
		getExtensions(vim).then((resolvedExtensions) => {
			untrack(() => (extensions = resolvedExtensions));
		});
	});

	/**
	 * update the extension if and when vim changes
	 * @param {boolean} vimEnabled if vim it's included in the set of extensions
	 */
	async function getExtensions(vimEnabled) {
		let extensions = [watcher];
		if (vimEnabled) {
			const { vim } = await import('@replit/codemirror-vim').then((vimModule) => ({
				vim: vimModule.vim
			}));

			extensions.unshift(
				vim({
					status: true
				})
			);
		}
		return extensions;
	}

	let cursor_pos = $state(0);

	$effect(() => {
		if ($cmInstance.view) {
			is_ready_promise.resolve();
		}
	});

	$effect(() => {
		if ($cmInstance.view && w && h) resize();
	});

	$effect(() => {
		if (marked) {
			unmarkText();
			untrack(() => (marked = false));
		}

		if (errorLoc) {
			markText({ from: errorLoc.character, to: errorLoc.character + 1, className: 'error-loc' });

			untrack(() => (error_line = errorLoc.line));
		} else {
			untrack(() => (error_line = null));
		}
	});

	// $inspect($cmInstance);

	const watcher = EditorView.updateListener.of((viewUpdate) => {
		if (viewUpdate.selectionSet) {
			cursorIndex.set(viewUpdate.state.selection.main.head);
		}
	});
</script>

<!-- svelte-ignore attribute_illegal_colon -->
<div
	class="codemirror-container"
	class:dark={$theme.current === 'dark'}
	use:codemirror={{
		value: code,
		setup: 'basic',
		useTabs: tab,
		tabSize: 2,
		theme: svelteTheme,
		readonly,
		documentId: filename,
		cursorPos: cursor_pos,
		lang,
		langMap: {
			js: () => import('@codemirror/lang-javascript').then((m) => m.javascript()),
			json: () => import('@codemirror/lang-json').then((m) => m.json()),
			md: () => import('@codemirror/lang-markdown').then((m) => m.markdown()),
			css: () => import('@codemirror/lang-css').then((m) => m.css()),
			svelte: () => import('@replit/codemirror-lang-svelte').then((m) => m.svelte())
		},
		lint: diagnostics,
		lintOptions: { delay: 200 },
		autocomplete,
		extensions,
		instanceStore: cmInstance
	}}
	oncodemirror:textChange={(e) => {
		// @ts-ignore
		code = e.detail;
		onchange?.({ value: code });
	}}
>
	{#if !$cmInstance.view}
		<pre style="position: absolute; left: 0; top: 0">{code}</pre>

		<div style="position: absolute; width: 100%; bottom: 0">
			<Message kind="info">loading editor...</Message>
		</div>
	{/if}
</div>

<style>
	.codemirror-container {
		position: relative;
		width: 100%;
		height: 100%;
		border: none;
		line-height: 1.5;
		overflow: hidden;
	}

	.codemirror-container :global(*) {
		transition: none !important;
	}

	.codemirror-container :global(.mark-text) {
		background-color: #304f66;
		backdrop-filter: opacity(40%);
	}

	.codemirror-container.dark :global(.mark-text) {
		background-color: #94c4e8;
	}

	.codemirror-container :global(.cm-editor) {
		height: 100%;
	}

	.codemirror-container :global(*) {
		font: 400 var(--sk-text-xs) / 1.7 var(--sk-font-mono) !important;
	}

	.codemirror-container :global(.error-loc) {
		position: relative;
		border-bottom: 2px solid #da106e;
	}

	.codemirror-container :global(.error-line) {
		background-color: rgba(200, 0, 0, 0.05);
	}

	pre {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		border: none;
		padding: 4px 4px 4px 60px;
		resize: none;
		font-family: var(--sk-font-mono);
		font-size: 13px;
		line-height: 1.7;
		user-select: none;
		pointer-events: none;
		color: #ccc;
		tab-size: 2;
		-moz-tab-size: 2;
	}
</style>
