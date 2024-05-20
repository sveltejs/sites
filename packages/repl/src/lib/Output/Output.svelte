<script>
	import { get_repl_context } from '$lib/state.svelte.js';
	import { BROWSER } from 'esm-env';
	import { marked } from 'marked';
	import CodeMirror from '../CodeMirror.svelte';
	import AstView from './AstView.svelte';
	import Compiler from './Compiler.js';
	import CompilerOptions from './CompilerOptions.svelte';
	import PaneWithPanel from './PaneWithPanel.svelte';
	import Viewer from './Viewer.svelte';

	/**
	 * @type {{
	 * 	svelte_url: string;
	 * 	status: string | null;
	 * 	source_error_loc?: import('$lib/types').StartOrEnd | null;
	 * 	runtime_error?: import('$lib/types').MessageDetails | null;
	 * 	embedded: boolean;
	 * 	relaxed: boolean;
	 * 	injected_js: string;
	 * 	injected_css: string;
	 * 	preview_theme: 'light' | 'dark';
	 * 	show_ast: boolean;
	 * }}
	 */
	let {
		svelte_url,
		status,
		source_error_loc = null,
		runtime_error = $bindable(null),
		embedded = false,
		relaxed = false,
		injected_js,
		injected_css,
		preview_theme,
		show_ast = false
	} = $props();

	/**
	 * @param {import('$lib/types').File} file
	 * @param {import('svelte/compiler').CompileOptions} options
	 */
	export async function set(file, options) {
		selected_type = file.type;

		if (file.type === 'js' || file.type === 'json') {
			js_editor.set({ code: `/* Select a component to see its compiled code */`, lang: 'js' });
			css_editor.set({ code: `/* Select a component to see its compiled code */`, lang: 'css' });
			return;
		}

		if (file.type === 'md') {
			markdown = await marked(file.source);
			return;
		}

		if (!compiler) return console.error('Compiler not initialized.');

		const compiled = await compiler.compile(file, options, show_ast);
		if (!js_editor) return; // unmounted

		js_editor.set({ code: compiled.js, lang: 'js' });
		css_editor.set({ code: compiled.css, lang: 'css' });
		ast = compiled.ast;
	}

	/**
	 * @param {import('$lib/types').File} selected
	 * @param {import('svelte/compiler').CompileOptions} options
	 */
	export async function update(selected, options) {
		if (/(js|json)/.test(selected.type)) return;

		if (selected.type === 'md') {
			markdown = await marked(selected.source);
			return;
		}

		if (!compiler) return console.error('Compiler not initialized.');

		const compiled = await compiler.compile(selected, options, show_ast);

		js_editor.update({ code: compiled.js, lang: 'js' });
		css_editor.update({ code: compiled.css, lang: 'css' });
		ast = compiled.ast;
	}

	const repl_state = get_repl_context();

	const compiler = BROWSER ? new Compiler(svelte_url) : null;

	let js_editor = /** @type {CodeMirror} */ ($state());

	/** @type {CodeMirror} */
	let css_editor;

	/** @type {'result' | 'js' | 'css' | 'ast'} */
	let view = $state('result');
	let selected_type = $state('');
	let markdown = $state('');

	let ast = /** @type {import('estree-walker').Node} */ ($state());
</script>

<div class="view-toggle">
	{#if selected_type === 'md'}
		<button class="active">Markdown</button>
	{:else}
		<button class:active={view === 'result'} onclick={() => (view = 'result')}>Result</button>
		<button class:active={view === 'js'} onclick={() => (view = 'js')}>JS output</button>
		<button class:active={view === 'css'} onclick={() => (view = 'css')}>CSS output</button>
		{#if show_ast}
			<button class:active={view === 'ast'} onclick={() => (view = 'ast')}>AST output</button>
		{/if}
	{/if}
</div>

<!-- component viewer -->
<div class="tab-content" class:visible={selected_type !== 'md' && view === 'result'}>
	<Viewer
		bind:error={runtime_error}
		{status}
		{relaxed}
		{injected_js}
		{injected_css}
		theme={preview_theme}
	/>
</div>

<!-- js output -->
<div class="tab-content" class:visible={selected_type !== 'md' && view === 'js'}>
	{#if embedded}
		<CodeMirror bind:this={js_editor} errorLoc={source_error_loc} readonly filename="js-viewer" />
	{:else}
		<PaneWithPanel pos="50%" panel="Compiler options">
			{#snippet main()}
				<div style="height: 100%">
					<CodeMirror
						bind:this={js_editor}
						errorLoc={source_error_loc}
						readonly
						filename="js-viewer"
					/>
				</div>
			{/snippet}

			{#snippet panel_body()}
				<div style="height: 100%">
					<CompilerOptions />
				</div>
			{/snippet}
		</PaneWithPanel>
	{/if}
</div>

<!-- css output -->
<div class="tab-content" class:visible={selected_type !== 'md' && view === 'css'}>
	<CodeMirror bind:this={css_editor} errorLoc={source_error_loc} readonly filename="css-viewer" />
</div>

<!-- ast output -->
{#if show_ast}
	<div class="tab-content" class:visible={selected_type !== 'md' && view === 'ast'}>
		<!-- ast view interacts with the module editor, wait for it first -->
		{#if repl_state.module_editor}
			<AstView {ast} autoscroll={selected_type !== 'md' && view === 'ast'} />
		{/if}
	</div>
{/if}

<!-- markdown output -->
<div class="tab-content" class:visible={selected_type === 'md'}>
	<iframe title="Markdown" srcdoc={markdown}></iframe>
</div>

<style>
	.view-toggle {
		height: 4.2rem;
		border-bottom: 1px solid var(--sk-text-4);
		white-space: nowrap;
		box-sizing: border-box;
	}

	button {
		/* width: 50%;
		height: 100%; */
		background: var(--sk-back-1, white);
		text-align: left;
		position: relative;
		font: 400 12px/1.5 var(--sk-font);
		border: none;
		border-bottom: 3px solid transparent;
		padding: 12px 12px 8px 12px;
		color: var(--sk-text-2, #999);
		border-radius: 0;
	}

	button.active {
		border-bottom: 3px solid var(--sk-theme-1, --prime);
		color: var(--sk-text-1, #333);
	}

	.tab-content {
		position: absolute;
		width: 100%;
		height: calc(100% - 42px) !important;
		visibility: hidden;
		pointer-events: none;
	}

	.tab-content.visible {
		visibility: visible;
		pointer-events: all;
	}
	iframe {
		width: 100%;
		height: 100%;
		border: none;
		display: block;
	}
</style>
