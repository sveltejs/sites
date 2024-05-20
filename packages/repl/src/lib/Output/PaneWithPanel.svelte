<script>
	import { spring } from 'svelte/motion';
	import { SplitPane } from '@rich_harris/svelte-split-pane';
	import { untrack } from 'svelte';

	const UNIT_REGEX = /(\d+)(?:(px|rem|%|em))/i;

	/** @type {{
	 * 	panel: string;
	 * 	pos: Exclude<import('svelte').ComponentProps<SplitPane>['pos'], undefined>;
	 * 	main?: import('svelte').Snippet;
	 * 	panel_header?: import('svelte').Snippet;
	 * 	panel_body?: import('svelte').Snippet;
	 * }} */
	let { panel, pos = '90%', main, panel_header, panel_body } = $props();

	let previous_pos = $state();
	$effect(() => {
		pos;
		untrack(() => (previous_pos = Math.min(+pos.replace(UNIT_REGEX, '$1'), 70)));
	});

	/** @type {Exclude<import('svelte').ComponentProps<SplitPane>['max'], undefined>} */
	let max = '90%';

	// we can't bind to the spring itself, but we
	// can still use the spring to drive `pos`
	const driver = spring(+pos.replace(UNIT_REGEX, '$1'), {
		stiffness: 0.2,
		damping: 0.5
	});

	$effect(() => {
		$driver;
		untrack(() => (pos = $driver + '%'));
	});

	const toggle = () => {
		const numeric_pos = +pos.replace(UNIT_REGEX, '$1');

		driver.set(numeric_pos, { hard: true });

		if (numeric_pos > 80) {
			driver.set(previous_pos);
		} else {
			previous_pos = numeric_pos;
			driver.set(+max.replace(UNIT_REGEX, '$1'));
		}
	};
</script>

<SplitPane {max} min="10%" type="vertical" bind:pos priority="max">
	<section slot="a">
		{@render main?.()}
	</section>

	<section slot="b">
		<button class="panel-header" onclick={toggle}>
			<span class="panel-heading">{panel}</span>
			{@render panel_header?.()}
		</button>

		<div class="panel-body">
			{@render panel_body?.()}
		</div>
	</section>
</SplitPane>

<style>
	.panel-header {
		height: 42px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 0.5em;
		cursor: pointer;
	}

	.panel-body {
		overflow: auto;
	}

	.panel-heading {
		font: 700 12px/1.5 var(--sk-font);
		color: var(--sk-text-1, #333);
	}

	section {
		overflow: hidden;
	}
</style>
