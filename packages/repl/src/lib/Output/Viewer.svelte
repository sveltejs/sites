<script>
	import { get_repl_context } from '$lib/state.svelte.js';
	import { BROWSER } from 'esm-env';
	import { onMount } from 'svelte';
	import Message from '../Message.svelte';
	import PaneWithPanel from './PaneWithPanel.svelte';
	import ReplProxy from './ReplProxy.js';
	import Console from './console/Console.svelte';
	import getLocationFromStack from './get-location-from-stack.js';
	import srcdoc from './srcdoc/index.html?raw';

	/**
	 * @type {{
	 * 	error: import('$lib/types').MessageDetails | null;
	 * 	status: string | null;
	 * 	relaxed: boolean;
	 * 	injected_js: string;
	 * 	injected_css: string;
	 *  theme: 'light' | 'dark';
	 * }}
	 */
	let {
		error = $bindable(),
		status,
		relaxed = false,
		injected_js = '',
		injected_css = '',
		theme
	} = $props();

	const repl_state = get_repl_context();

	/** @type {import('./console/console').Log[]} */
	let logs = $state([]);

	/** @type {import('./console/console').Log[][]} */
	let log_group_stack = $state([]);

	/** @type {import('./console/console').Log[]} */
	let current_log_group = $state([]);

	let iframe = /** @type {HTMLIFrameElement} */ ($state());
	let pending_imports = $state(0);
	let pending = $state(false);

	/** @type {ReplProxy | null} */
	let proxy = $state(null);

	let ready = $state(false);
	let inited = $state(false);

	let log_height = $state(90);

	let prev_height = /** @type {number} */ ($state());

	/** @type {import('./console/console').Log} */
	let last_console_event;

	onMount(() => {
		proxy = new ReplProxy(iframe, {
			on_fetch_progress: (progress) => {
				pending_imports = progress;
			},
			on_error: (event) => {
				push_logs({ level: 'error', args: [event.value] });
			},
			on_unhandled_rejection: (event) => {
				let error = event.value;
				if (typeof error === 'string') error = { message: error };
				error.message = 'Uncaught (in promise): ' + error.message;
				push_logs({ level: 'error', args: [error] });
			},
			on_console: (log) => {
				if (log.level === 'clear') {
					clear_logs();
					push_logs(log);
				} else if (log.duplicate) {
					increment_duplicate_log();
				} else {
					push_logs(log);
				}
			},
			on_console_group: (action) => {
				group_logs(action.label, false);
			},
			on_console_group_end: () => {
				ungroup_logs();
			},
			on_console_group_collapsed: (action) => {
				group_logs(action.label, true);
			}
		});

		iframe.addEventListener('load', () => {
			proxy?.handle_links();
			ready = true;
		});

		return () => {
			proxy?.destroy();
		};
	});

	$effect(() => {
		if (ready) proxy?.iframe_command('set_theme', { theme });
	});

	/**
	 * @param {import('$lib/types').Bundle | null} $bundle
	 */
	async function apply_bundle($bundle) {
		if (!$bundle || $bundle.error) return;

		try {
			clear_logs();

			await proxy?.eval(`
				${injected_js}

				${styles}

				const styles = document.querySelectorAll('style[id^=svelte-]');

				let i = styles.length;
				while (i--) styles[i].parentNode.removeChild(styles[i]);

				if (window.component) {
					try {
						window.component.$destroy();
					} catch (err) {
						console.error(err);
					}
				}

				document.body.innerHTML = '';
				window.location.hash = '';
				window._svelteTransitionManager = null;

				${$bundle.dom?.code}

				window.component = new SvelteComponent.default({
					target: document.body
				});
			`);

			error = null;
		} catch (e) {
			// @ts-ignore
			show_error(e);
		}

		inited = true;
	}

	$effect(() => {
		if (ready) apply_bundle(repl_state.bundle);
	});

	const styles = $derived(
		injected_css &&
			`{
		const style = document.createElement('style');
		style.textContent = ${JSON.stringify(injected_css)};
		document.head.appendChild(style);
	}`
	);

	/**
	 * @param {import('$lib/types').Error & { loc: { line: number; column: number } }} e
	 */
	function show_error(e) {
		const map = repl_state.bundle?.dom?.map;
		if (!map) return;

		// @ts-ignore INVESTIGATE
		const loc = getLocationFromStack(e.stack, map);
		if (loc) {
			e.filename = loc.source;
			e.loc = { line: loc.line, column: loc.column ?? 0 };
		}

		error = e;
	}

	/**
	 * @param {import('./console/console').Log} log
	 */
	function push_logs(log) {
		current_log_group.push((last_console_event = log));
		logs = logs;
	}

	/**
	 * @param {string} label
	 * @param {boolean} collapsed
	 */
	function group_logs(label, collapsed) {
		/** @type {import('./console/console').Log} */
		const group_log = { level: 'group', label, collapsed, logs: [] };
		current_log_group.push({ level: 'group', label, collapsed, logs: [] });
		// TODO: Investigate
		log_group_stack.push(current_log_group);
		current_log_group = group_log.logs ?? [];
		logs = logs;
	}

	function ungroup_logs() {
		const last = log_group_stack.pop();

		if (last) current_log_group = last;
	}

	function increment_duplicate_log() {
		const last_log = current_log_group[current_log_group.length - 1];

		if (last_log) {
			last_log.count = (last_log.count || 1) + 1;
			logs = logs;
		} else {
			last_console_event.count = 1;
			push_logs(last_console_event);
		}
	}

	function on_toggle_console() {
		if (log_height < 90) {
			prev_height = log_height;
			log_height = 90;
		} else {
			log_height = prev_height || 45;
		}
	}

	function clear_logs() {
		current_log_group = logs = [];
	}
</script>

<!-- svelte-ignore state_referenced_locally -->
<!-- svelte-ignore state_referenced_locally -->
<div class="iframe-container">
	<PaneWithPanel pos="90%" panel="Console">
		{#snippet main()}
			<div>
				<iframe
					title="Result"
					class:inited
					bind:this={iframe}
					sandbox={[
						'allow-popups-to-escape-sandbox',
						'allow-scripts',
						'allow-popups',
						'allow-forms',
						'allow-pointer-lock',
						'allow-top-navigation',
						'allow-modals',
						relaxed ? 'allow-same-origin' : ''
					].join(' ')}
					class={error || pending || pending_imports ? 'greyed-out' : ''}
					srcdoc={BROWSER ? srcdoc : ''}
				></iframe>
			</div>
		{/snippet}

		{#snippet panel_header()}
			<div>
				<button
					onclick={(e) => {
						e.stopPropagation();
						clear_logs();
					}}
				>
					{#if logs.length > 0}
						({logs.length})
					{/if}
					Clear
				</button>
			</div>
		{/snippet}

		{#snippet panel_body()}
			<section>
				<Console {logs} {theme} onclear={clear_logs} />
			</section>
		{/snippet}
	</PaneWithPanel>

	<div class="overlay">
		{#if error}
			<Message kind="error" details={error} />
		{:else if status || !repl_state.bundle}
			<Message kind="info" truncate>{status || 'loading Svelte compiler...'}</Message>
		{/if}
	</div>
</div>

<style>
	.iframe-container {
		position: absolute;
		background-color: var(--sk-back-1, white);
		border: none;
		width: 100%;
		height: 100%;
	}

	iframe {
		width: 100%;
		height: 100%;
		border: none;
		display: block;
	}

	.greyed-out {
		filter: grayscale(50%) blur(1px);
		opacity: 0.25;
	}

	button {
		color: var(--sk-text-2, #999);
		font-size: 12px;
		text-transform: uppercase;
		display: block;
	}

	button:hover {
		color: var(--sk-text-1, #333);
	}

	.overlay {
		position: absolute;
		bottom: 0;
		width: 100%;
	}
</style>
