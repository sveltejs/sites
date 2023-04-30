<!-- svelte-ignore a11y-label-has-associated-control -->
<script>
	import { compile_options } from '$lib/state';
	import Checkbox from '../Checkbox.svelte';
</script>

<div class="options">
	result = svelte.compile(source, &#123;
	<div class="option">
		<span class="key">generate:</span>

		<input id="dom-input" type="radio" bind:group={$compile_options.generate} value="dom" />
		<label for="dom-input"><span class="string">"dom"</span></label>

		<input id="ssr-input" type="radio" bind:group={$compile_options.generate} value="ssr" />
		<label for="ssr-input"><span class="string">"ssr"</span>,</label>
	</div>

	<label class="option">
		<span class="key">dev:</span>
		<Checkbox bind:checked={$compile_options.dev} />
		<span class="boolean">{$compile_options.dev}</span>,
	</label>

	<div class="option">
		<span class="key">css:</span>

		<input id="injected-input" type="radio" bind:group={$compile_options.css} value="injected" />
		<label for="injected-input"><span class="string">"injected"</span></label>

		<input id="external-input" type="radio" bind:group={$compile_options.css} value="external" />
		<label for="external-input"><span class="string">"external"</span></label>

		<input id="none-input" type="radio" bind:group={$compile_options.css} value="none" />
		<label for="none-input"><span class="string">"none"</span>,</label>
	</div>

	<label class="option">
		<span class="key">hydratable:</span>
		<Checkbox bind:checked={$compile_options.hydratable} />
		<span class="boolean">{$compile_options.hydratable}</span>,
	</label>

	<label class="option">
		<span class="key">customElement:</span>
		<Checkbox bind:checked={$compile_options.customElement} />
		<span class="boolean">{$compile_options.customElement}</span>,
	</label>

	<label class="option">
		<span class="key">immutable:</span>
		<Checkbox bind:checked={$compile_options.immutable} />
		<span class="boolean">{$compile_options.immutable}</span>,
	</label>

	<label class="option">
		<span class="key">legacy:</span>
		<Checkbox bind:checked={$compile_options.legacy} />
		<span class="boolean">{$compile_options.legacy}</span>
	</label>
	});
</div>

<style>
	.options {
		padding: 0 10px;
		font-family: var(--sk-font-mono);
		font-size: 13px;
		color: var(--sk-text-2, #999);
		line-height: 1.8;
	}

	.option {
		display: block;
		padding: 0 0 0 1.25em;
		white-space: nowrap;
		color: var(--sk-text-3, #999);
		user-select: none;
	}

	.key {
		display: inline-block;
		width: 9em;
	}

	.string {
		color: hsl(41, 37%, 45%);
	}

	.boolean {
		color: hsl(45, 7%, 45%);
	}

	label {
		display: inline-block;
	}

	label[for] {
		color: var(--sk-code-string);
	}

	label :global(input[type='checkbox']) {
		top: -1px;
	}

	input[type='radio'] {
		position: absolute;
		top: auto;
		overflow: hidden;
		clip: rect(1px, 1px, 1px, 1px);
		width: 1px;
		height: 1px;
		white-space: nowrap;
	}

	input[type='radio'] + label {
		padding: 0 0 0 1.6em;
		margin: 0 0.6em 0 0;
		opacity: 0.7;
	}

	input[type='radio']:checked + label {
		opacity: 1;
	}

	/* input[type=radio]:focus + label {
		color: #00f;
		outline: 1px dotted #00f;
	} */

	input[type='radio'] + label:before {
		content: '';
		background: #eee;
		display: block;
		box-sizing: border-box;
		float: left;
		width: 15px;
		height: 15px;
		margin-left: -21px;
		margin-top: 4px;
		/* vertical-align: top; */
		cursor: pointer;
		text-align: center;
		transition: box-shadow 0.1s ease-out;
	}

	input[type='radio'] + label:before {
		background-color: var(--sk-theme-2);
		border-radius: 100%;
		box-shadow: inset 0 0 0 0.5em rgba(255, 255, 255, 0.95);
		border: 1px solid var(--sk-theme-2);
	}

	input[type='radio']:checked + label:before {
		background-color: var(--sk-theme-1);
		box-shadow: inset 0 0 0 0.15em rgba(255, 255, 255, 0.95);
		border: 1px solid var(--sk-theme-2);
		transition: box-shadow 0.2s ease-out;
	}
</style>
