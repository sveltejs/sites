<script>
	import { SplitPane } from '@rich_harris/svelte-split-pane';
	import { BROWSER } from 'esm-env';
	import { untrack } from 'svelte';
	import Bundler from './Bundler.js';
	import ComponentSelector from './Input/ComponentSelector.svelte';
	import ModuleEditor from './Input/ModuleEditor.svelte';
	import InputOutputToggle from './InputOutputToggle.svelte';
	import Output from './Output/Output.svelte';
	import { create_repl_state, set_repl_context } from './state.svelte.js';
	import { get_full_filename } from './utils.js';
	import { withCodemirrorInstance } from '@neocodemirror/svelte';

	const cm_instance = withCodemirrorInstance();

	/** @type {{
	 * packagesUrl?: string;
	 * svelteUrl?: string;
	 * embedded?: boolean;
	 * orientation?: 'columns' | 'rows';
	 * relaxed?: boolean;
	 * fixed?: boolean;
	 * fixedPos?: number;
	 * injectedJS?: string;
	 * injectedCSS?: string;
	 * previewTheme?: 'light' | 'dark';
	 * showModified?: boolean;
	 * showAst?: boolean;
	 * autocomplete?: boolean;
	 * vim?: boolean;
	 * onchange?: ({ files}: { files: import('./types').File[] }) => void;
	 * onadd?: (data: {files: import('./types').File[], diff: import('./types').File}) => void;
	 * onremove?: (data: {files: import('./types').File[], diff: import('./types').File}) => void;
	 * }} */
	let {
		autocomplete = true,
		embedded = false,
		fixed = false,
		fixedPos = 50,
		injectedCSS = $bindable(''),
		injectedJS = $bindable(''),
		orientation = 'columns',
		packagesUrl = `https://unpkg.com`,
		previewTheme = 'light',
		relaxed = false,
		showAst = false,
		showModified = false,
		svelteUrl = `https://unpkg.com/svelte`,
		vim = false,

		onchange,
		onadd,
		onremove
	} = $props();

	const repl_state = create_repl_state({ onchange, cm_instance });

	set_repl_context(repl_state);

	export function toJSON() {
		return {
			imports: repl_state.bundle?.imports ?? [],
			files: repl_state.files
		};
	}

	/**
	 * @param {{ files: import('./types').File[], css?: string }} data
	 */
	export async function set(data) {
		repl_state.files = data.files;
		repl_state.selected_name = 'App.svelte';

		repl_state.rebundle();

		// Wait for editors to be ready
		await repl_state.module_editor?.isReady;

		await repl_state.module_editor?.set({ code: data.files[0].source, lang: data.files[0].type });

		injectedCSS = data.css || '';

		onchange?.({ files: repl_state.files });
	}

	export function markSaved() {
		repl_state.files = repl_state.files.map((val) => ({ ...val, modified: false }));
	}

	/** @param {{ files: import('./types').File[], css?: string }} data */
	export function update(data) {
		repl_state.files = data.files;

		const matched_file = data.files.find(
			(file) => get_full_filename(file) === repl_state.selected_name
		);

		repl_state.selected_name = matched_file ? get_full_filename(matched_file) : 'App.svelte';

		injectedCSS = data.css ?? '';

		if (matched_file) {
			repl_state.module_editor?.update({
				code: matched_file.source,
				lang: matched_file.type
			});

			repl_state.output?.update?.(matched_file, repl_state.compile_options);

			repl_state.module_editor?.clearEditorState();
		}

		onchange?.({ files: repl_state.files });
	}

	/** @type {import('./types').StartOrEnd} */
	let source_error_loc;
	let show_output = $state(false);

	let status = /** @type {string | null} */ ($state(null));
	let status_visible = $state(false);

	/** @type {NodeJS.Timeout | undefined} */
	let status_timeout = undefined;
	let width = $state(0);

	const mobile = $derived(width < 540);

	repl_state.bundler = BROWSER
		? new Bundler({
				packages_url: packagesUrl,
				svelte_url: svelteUrl,
				onstatus: (message) => {
					if (message) {
						// show bundler status, but only after time has elapsed, to
						// prevent the banner flickering
						if (!status_visible && !status_timeout) {
							status_timeout = setTimeout(() => {
								status_visible = true;
							}, 400);
						}
					} else {
						clearTimeout(status_timeout);
						status_visible = false;
						status_timeout = undefined;
					}

					status = message;
				}
			})
		: null;

	$effect(() => {
		if (repl_state.output && repl_state.selected) {
			repl_state.output?.update?.(repl_state.selected, repl_state.compile_options);
		}
	});

	$effect(() => {
		mobile;
		orientation;

		untrack(() => (repl_state.toggleable = mobile && orientation === 'columns'));
	});

	/**
	 * @param {BeforeUnloadEvent} event
	 */
	function before_unload(event) {
		if (showModified && repl_state.files.find((file) => file.modified)) {
			event.preventDefault();
			event.returnValue = '';
		}
	}
</script>

<svelte:window onbeforeunload={before_unload} />

<div class="container" class:toggleable={repl_state.toggleable} bind:clientWidth={width}>
	<div class="viewport" class:output={show_output}>
		<SplitPane
			--color="var(--sk-text-4)"
			id="main"
			type={orientation === 'rows' ? 'vertical' : 'horizontal'}
			pos="{mobile || fixed ? fixedPos : orientation === 'rows' ? 60 : 50}%"
			min="100px"
			max="-4.1rem"
		>
			<section slot="a">
				<ComponentSelector show_modified={showModified} {onadd} {onremove} />
				<ModuleEditor errorLoc={source_error_loc} {autocomplete} {vim} />
			</section>

			<section slot="b" style="height: 100%;">
				<Output
					bind:this={repl_state.output}
					svelte_url={svelteUrl}
					status={status_visible ? status : null}
					{embedded}
					{relaxed}
					injected_js={injectedJS}
					injected_css={injectedCSS}
					show_ast={showAst}
					preview_theme={previewTheme}
				/>
			</section>
		</SplitPane>
	</div>

	{#if repl_state.toggleable}
		<InputOutputToggle bind:checked={show_output} />
	{/if}
</div>

<style>
	.container {
		position: relative;
		width: 100%;
		height: 100%;
		background: var(--sk-back-1);
	}

	.container :global(section) {
		position: relative;
		padding: 42px 0 0 0;
		height: 100%;
		box-sizing: border-box;
	}

	.container :global(section) > :global(*):first-child {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 42px;
		box-sizing: border-box;
	}

	.container :global(section) > :global(*):last-child {
		width: 100%;
		height: 100%;
	}

	.viewport {
		height: 100%;
	}

	.toggleable .viewport {
		width: 200%;
		height: calc(100% - 42px);
		transition: transform 0.3s;
	}

	.toggleable .viewport.output {
		transform: translate(-50%);
	}

	/* on mobile, override the <SplitPane> controls */
	@media (max-width: 799px) {
		:global([data-pane='main']) {
			--pos: 50% !important;
		}

		:global([data-pane='editor']) {
			--pos: 5.4rem !important;
		}

		:global([data-pane]) :global(.divider) {
			cursor: default;
		}
	}
</style>
