<script context="module">
	export const cursorIndex = writable(0);
</script>

<script>
	import { autocompletion, closeBrackets } from '@codemirror/autocomplete';
	import { defaultKeymap, history, historyField, indentWithTab } from '@codemirror/commands';
	import { bracketMatching, codeFolding, indentUnit } from '@codemirror/language';
	import { EditorState, Range, StateEffect, StateEffectType, StateField } from '@codemirror/state';
	import { Decoration, EditorView, keymap } from '@codemirror/view';
	import { basicSetup } from 'codemirror';
	import { createEventDispatcher, onMount, tick } from 'svelte';
	import { writable } from 'svelte/store';
	import Message from './Message.svelte';
	import { svelte as svelteTheme } from './theme';

	/** @type {import('./types').StartOrEnd | null} */
	export let errorLoc = null;

	/** @type {ReturnType<typeof createEventDispatcher<{ change: { value: string } }>>} */
	const dispatch = createEventDispatcher();

	let code = '';

	/** @type {import('./types').Lang} */
	let lang = 'svelte';

	export let readonly = false;
	export let tab = true;

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
		if (!editor) return;

		await tick();

		if (options.lang && options.lang !== lang) {
			// This will trigger change_mode
			change_mode((lang = options.lang));
		}

		if (options.code) {
			updating_externally = true;

			const { scrollLeft: left, scrollTop: top } = editor.scrollDOM;

			change_code((code = options.code));

			updating_externally = false;

			editor.scrollDOM.scrollTop = top;
			editor.scrollDOM.scrollLeft = left;
		}
	}

	/**
	 * @param {number} pos
	 */
	export function setCursor(pos) {
		editor?.dispatch({ selection: { anchor: pos, head: pos } });
	}

	/** @type {(...val: any) => void} */
	let fulfil_module_editor_ready;
	export const isReady = new Promise((f) => (fulfil_module_editor_ready = f));

	export function resize() {
		editor?.requestMeasure();
	}

	export function focus() {
		editor?.focus();
	}

	export function getEditorState() {
		return editor?.state.toJSON({ history: historyField });
	}

	/**
	 * @param {any} state
	 */
	export function setEditorState(state) {
		if (!editor) return;

		editor.setState(
			EditorState.fromJSON(state, { extensions, doc: state.doc }, { history: historyField })
		);
		editor?.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: state.doc } });
	}

	export async function clearEditorState() {
		await tick();

		editor?.setState(EditorState.create({ extensions, doc: '' }));
		editor?.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: '' } });
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
			for (let effect of tr.effects) {
				if (effect.is(addMarksDecoration)) value = value.update({ add: effect.value, sort: true });
			}
			return value;
		},
		// Indicate that this field provides a set of decorations
		provide: (f) => EditorView.decorations.from(f),
	});

	/**
	 * @param {object} param0
	 * @param {number} param0.from
	 * @param {number} param0.to
	 * @param {string} [param0.className]
	 */
	export function markText({ from, to, className = 'mark-text' }) {
		const executedMark = Decoration.mark({
			class: className,
		});

		editor.dispatch({
			effects: [
				StateEffect.appendConfig.of(markField),
				addMarksDecoration.of([executedMark.range(from, to)]),
			],
		});
	}

	export function unmarkText() {
		editor.dispatch({
			effects: StateEffect.reconfigure.of(extensions),
		});
	}

	/** @type {EditorView} */
	let editor;

	/** @type {number} */
	let w;
	/** @type {number} */
	let h;

	let marked = false;
	let destroyed = false;

	/** @type {number | null}*/
	let error_line = null;

	let updating_externally = false;

	/** @type {import('@codemirror/state').Extension[]} */
	let extensions = [];

	$: if (editor && w && h) resize();

	$: {
		if (marked) {
			unmarkText();
			marked = false;
		}

		if (errorLoc) {
			markText({ from: errorLoc.character, to: errorLoc.character + 1, className: 'error-loc' });

			error_line = errorLoc.line;
		} else {
			error_line = null;
		}
	}

	// /** @type {number | null} */
	// let previous_error_line;
	// $: if (editor) {
	// 	if (previous_error_line != null) {
	// 		editor.removeLineClass(previous_error_line, 'wrap', 'error-line');
	// 	}

	// 	if (error_line && error_line !== previous_error_line) {
	// 		editor.addLineClass(error_line, 'wrap', 'error-line');
	// 		previous_error_line = error_line;
	// 	}
	// }

	/**
	 * @param {string} mode
	 */
	async function get_lang_plugin(mode) {
		switch (mode) {
			case 'js':
				return (await import('@codemirror/lang-javascript')).javascript();
			case 'json':
				return (await import('@codemirror/lang-json')).json();
			case 'md':
				return (await import('@codemirror/lang-markdown')).markdown();
			case 'css':
				return (await import('@codemirror/lang-css')).css();
			default:
				return (await import('@replit/codemirror-lang-svelte')).svelte();
		}
	}

	/**
	 * @param {import('./types').Lang} new_mode
	 */
	async function change_mode(new_mode) {
		editor.dispatch({
			effects: StateEffect.reconfigure.of(await make_extensions({ mode: new_mode })),
		});
	}

	/**
	 * @param {string} new_value
	 */
	function change_code(new_value) {
		const transaction = editor.state.update({
			changes: { from: 0, to: editor.state.doc.length, insert: new_value },
		});
		editor.dispatch(transaction);
	}

	const watcher = EditorView.updateListener.of((viewUpdate) => {
		if (viewUpdate.selectionSet) {
			cursorIndex.set(viewUpdate.state.selection.main.head);
		}

		if (!viewUpdate.changes.empty) {
			dispatch('change', { value: viewUpdate.state.doc.toString() });
		}
	});

	/**
	 * @param {object} param0
	 * @param {import('./types').Lang} param0.mode
	 */
	async function make_extensions({ mode }) {
		extensions = [
			basicSetup,
			watcher,
			await get_lang_plugin(mode || 'svelte'),
			autocompletion({ closeOnBlur: false }),
			EditorState.tabSize.of(2),
			keymap.of([...defaultKeymap, indentWithTab]),
			indentUnit.of(tab ? '\t' : '  '),
			closeBrackets(),
			bracketMatching(),
			codeFolding(),
			history(),
			svelteTheme,
		];

		extensions.push(EditorState.readOnly.of(readonly));

		return (extensions = extensions);
	}

	/**
	 * @type {import('svelte/action').Action<HTMLDivElement>}
	 */
	async function codemirror(node) {
		(async () => {
			if (!destroyed) {
				editor = new EditorView({
					parent: node,
					extensions: await make_extensions({ mode: lang }),
					doc: '',
					selection: { anchor: 0, head: 0 },
				});

				fulfil_module_editor_ready();
			}
		})();

		return {
			destroy: () => {
				destroyed = true;
				editor.destroy();
			},
		};
	}
</script>

<div class="codemirror-container" use:codemirror>
	{#if !editor}
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
