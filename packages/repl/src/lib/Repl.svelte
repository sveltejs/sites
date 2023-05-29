<script>
	import { SplitPane } from '@rich_harris/svelte-split-pane';
	import { BROWSER } from 'esm-env';
	import { createEventDispatcher } from 'svelte';
	import { derived, writable } from 'svelte/store';
	import Bundler from './Bundler.js';
	import ComponentSelector from './Input/ComponentSelector.svelte';
	import ModuleEditor from './Input/ModuleEditor.svelte';
	import InputOutputToggle from './InputOutputToggle.svelte';
	import Output from './Output/Output.svelte';
	import { set_repl_context } from './context.js';
	import { get_full_filename, sleep } from './utils.js';

	export let packagesUrl = 'https://unpkg.com';
	export let svelteUrl = `${packagesUrl}/svelte`;
	export let embedded = false;
	/** @type {'columns' | 'rows'} */
	export let orientation = 'columns';
	export let relaxed = false;
	export let fixed = false;
	export let fixedPos = 50;
	export let injectedJS = '';
	export let injectedCSS = '';
	/** @type {'light' | 'dark'} */
	export let previewTheme = 'light';
	export let showModified = false;
	export let showAst = false;
	export let autocomplete = true;

	export function toJSON() {
		return {
			imports: $bundle?.imports ?? [],
			files: $files
		};
	}

	/**
	 * @param {{ files: import('./types').File[], css?: string }} data
	 */
	export async function set(data) {
		$files = data.files;
		$selected_index = 0;

		rebundle();

		// Wait for editors to be ready
		await $module_editor?.isReady;

		await $module_editor?.set({ code: data.files[0].source, lang: data.files[0].type });

		injectedCSS = data.css || '';

		await sleep(50);

		EDITOR_STATE_MAP.set(get_full_filename(data.files[0]), $module_editor?.getEditorState());
	}

	export function markSaved() {
		$files = $files.map((val) => ({ ...val, modified: false }));

		if (!$selected) return;

		$files[$selected_index].modified = false;
	}

	/** @param {{ files: import('./types').File[], css?: string }} data */
	export function update(data) {
		if (!$selected) return;

		const { name, type } = $selected;

		$files = data.files;

		const matched_component_index = data.files.findIndex(
			(file) => file.name === name && file.type === type
		);

		$selected_index = matched_component_index === -1 ? 0 : matched_component_index;

		injectedCSS = data.css ?? '';

		if (matched_component_index) {
			$module_editor?.update({
				code: $files[matched_component_index].source,
				lang: $files[matched_component_index].type
			});

			$output?.update?.($files[matched_component_index], $compile_options);

			$module_editor?.clearEditorState();
		}
	}

	/** @type {ReturnType<typeof createEventDispatcher<{ change: { files: import('./types').File[] } }>>} */
	const dispatch = createEventDispatcher();

	/**
	 * @typedef {import('./types').ReplContext} ReplContext
	 */

	/** @type {import('svelte/types/compiler').CompileOptions} */
	const DEFAULT_COMPILE_OPTIONS = {
		generate: 'dom',
		dev: false,
		css: 'injected',
		hydratable: false,
		customElement: false,
		immutable: false,
		legacy: false
	};

	/** @type {Map<string, import('@codemirror/state').EditorState>} */
	const EDITOR_STATE_MAP = new Map();

	/** @type {ReplContext['files']} */
	const files = writable([]);

	/** @type {ReplContext['selected_index']} */
	const selected_index = writable(-1);

	/** @type {ReplContext['selected']} */
	const selected = derived([files, selected_index], ([$files, $selected_index]) => {
		return $selected_index !== -1 ? $files?.[$selected_index] ?? null : null;
	});

	/** @type {ReplContext['bundle']} */
	const bundle = writable(null);

	/** @type {ReplContext['compile_options']} */
	const compile_options = writable(DEFAULT_COMPILE_OPTIONS);

	/** @type {ReplContext['cursor_pos']} */
	const cursor_pos = writable(0);

	/** @type {ReplContext['module_editor']} */
	const module_editor = writable(null);

	/** @type {ReplContext['output']} */
	const output = writable(null);

	/** @type {ReplContext['toggleable']} */
	const toggleable = writable(false);

	/** @type {ReplContext['bundler']} */
	const bundler = writable(null);

	set_repl_context({
		files,
		selected_index,
		selected,
		bundle,
		bundler,
		compile_options,
		cursor_pos,
		module_editor,
		output,
		toggleable,

		EDITOR_STATE_MAP,

		rebundle,
		clear_state,
		go_to_warning_pos,
		handle_change,
		handle_select
	});

	/** @type {Symbol}  */
	let current_token;
	async function rebundle() {
		const token = (current_token = Symbol());
		const result = await $bundler?.bundle($files);
		if (result && token === current_token) $bundle = result;
	}

	let is_select_changing = false;

	/**
	 * @param {number} index
	 */
	async function handle_select(index) {
		is_select_changing = true;

		$selected_index = index;

		if (!$selected) return;

		await $module_editor?.set({ code: $selected.source, lang: $selected.type });

		if (EDITOR_STATE_MAP.has(get_full_filename($selected))) {
			$module_editor?.setEditorState(EDITOR_STATE_MAP.get(get_full_filename($selected)));
		} else {
			$module_editor?.clearEditorState();
		}

		EDITOR_STATE_MAP.set(get_full_filename($selected), $module_editor?.getEditorState());

		$output?.set($selected, $compile_options);

		is_select_changing = false;
	}

	/**
	 * @param {CustomEvent<{ value: string }>} event
	 */
	async function handle_change(event) {
		if (is_select_changing) return;

		files.update(($files) => {
			const file = { ...$selected };

			file.source = event.detail.value;
			file.modified = true;

			// @ts-ignore
			$files[$selected_index] = file;

			return $files;
		});

		if (!$selected) return;

		EDITOR_STATE_MAP.set(get_full_filename($selected), $module_editor?.getEditorState());

		dispatch('change', {
			files: $files
		});

		rebundle();
	}

	/** @param {import('./types').MessageDetails | undefined} item */
	async function go_to_warning_pos(item) {
		if (!item) return;

		const match = /^(.+)\.(\w+)$/.exec(item.filename);
		if (!match) return; // ???

		const [, name, type] = match;
		const file_index = $files.findIndex((file) => file.name === name && file.type === type);

		if (file_index === -1) return;

		await handle_select(file_index);

		$module_editor?.focus();
		$module_editor?.setCursor(item.start.character);
	}

	/** Deletes all editor state */
	function clear_state() {
		$module_editor?.clearEditorState();

		EDITOR_STATE_MAP.clear();
	}

	$: if ($output && $selected) {
		$output?.update?.($selected, $compile_options);
	}

	$: mobile = width < 540;

	$: $toggleable = mobile && orientation === 'columns';

	/** @type {import('./types').StartOrEnd} */
	let sourceErrorLoc;
	let width = 0;
	let show_output = false;

	/** @type {string | null} */
	let status = null;
	let status_visible = false;

	/** @type {NodeJS.Timeout | undefined} */
	let status_timeout = undefined;

	$bundler = BROWSER
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

	/**
	 * @param {BeforeUnloadEvent} event
	 */
	function before_unload(event) {
		if (showModified && $files.find((file) => file.modified)) {
			event.preventDefault();
			event.returnValue = '';
		}
	}
</script>

<svelte:window on:beforeunload={before_unload} />

<div class="container" class:toggleable={$toggleable} bind:clientWidth={width}>
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
				<ComponentSelector show_modified={showModified} on:add on:remove />
				<ModuleEditor errorLoc={sourceErrorLoc} {autocomplete} />
			</section>

			<section slot="b" style="height: 100%;">
				<Output
					bind:this={$output}
					{svelteUrl}
					status={status_visible ? status : null}
					{embedded}
					{relaxed}
					{injectedJS}
					{injectedCSS}
					{showAst}
					{previewTheme}
				/>
			</section>
		</SplitPane>
	</div>

	{#if $toggleable}
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
