/// <reference lib="webworker" />

import { create_deferred_promise } from '$lib/utils';
import { load_svelte_compiler } from '../worker-helpers';

self.window = self; //TODO: still need?: egregious hack to get magic-string to work in a worker

// This is just for type-safety
/** @type {import('svelte/compiler')} */
var svelte;

const ready = create_deferred_promise();

self.addEventListener(
	'message',
	/** @param {MessageEvent<import("../workers").CompileMessageData>} event */
	async (event) => {
		switch (event.data.type) {
			case 'init':
				const { svelte_url } = event.data;
				if (!svelte_url) {
					throw new Error('COMPILER: No svelte_url provided for worker initialization');
				}

				svelte = await load_svelte_compiler(svelte_url);

				ready.resolve();
				break;

			case 'compile':
				await ready.promise;
				postMessage(compile(event.data));
				break;
		}
	}
);

const common_options = {
	dev: false,
	css: false
};

/** @param {import("../workers").CompileMessageData} param0 */
function compile({ id, source, options, return_ast }) {
	try {
		const { js, css, ast } = svelte.compile(source, Object.assign({}, common_options, options));

		return {
			id,
			result: {
				js: js.code,
				css: css?.code || `/* Add a <sty` + `le> tag to see compiled CSS */`,
				ast: return_ast ? ast : null
			}
		};
	} catch (err) {
		// @ts-ignore
		let message = `/* Error compiling component\n\n${err.message}`;
		// @ts-ignore
		if (err.frame) message += `\n${err.frame}`;
		message += `\n\n*/`;

		return {
			id,
			result: {
				js: message,
				css: message
			}
		};
	}
}
