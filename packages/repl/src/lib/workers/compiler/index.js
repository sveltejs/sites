/// <reference lib="webworker" />

import { get_svelte_package_json, load_compiler } from '../worker-helpers';

self.window = self; //TODO: still need?: egregious hack to get magic-string to work in a worker

/** @type {(...val: never[]) => void} */
let fulfil_ready;
const ready = new Promise((f) => {
	fulfil_ready = f;
});

self.addEventListener(
	'message',
	/** @param {MessageEvent<import("../workers").CompileMessageData>} event */
	async (event) => {
		switch (event.data.type) {
			case 'init':
				const { svelte_url = '' } = event.data;
				const { version } = await get_svelte_package_json(svelte_url);

				await load_compiler(svelte_url, version);

				fulfil_ready();
				break;

			case 'compile':
				await ready;
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
		const css = `/* Select a component to see compiled CSS */`;

		if (options.filename.endsWith('.svelte')) {
			const compiled = svelte.compile(source, {
				filename: options.filename,
				generate: options.generate,
				dev: options.dev
			});

			const { js, css, warnings, metadata } = compiled;

			const ast = return_ast ? svelte.parse(source, { modern: true }) : undefined;

			return {
				id,
				result: {
					js: js.code,
					css: css?.code || `/* Add a <sty` + `le> tag to see compiled CSS */`,
					error: null,
					warnings,
					metadata,
					ast
				}
			};
		} else if (options.filename.endsWith('.svelte.js')) {
			const compiled = svelte.compileModule(source, {
				filename: options.filename,
				generate: options.generate,
				dev: options.dev
			});

			if (compiled) {
				return {
					id,
					result: {
						js: compiled.js.code,
						css,
						error: null,
						warnings: compiled.warnings,
						metadata: compiled.metadata
					}
				};
			}
		}

		return {
			id,
			result: {
				js: `// Select a component, or a '.svelte.js' module that uses runes, to see compiled output`,
				css,
				error: null,
				warnings: [],
				metadata: null
			}
		};
	} catch (err) {
		// @ts-ignore
		let message = `/*\nError compiling ${err.filename ?? 'component'}:\n${err.message}\n*/`;

		return {
			id,
			result: {
				js: message,
				css: message,
				error: {
					message: err.message,
					position: err.position
				},
				warnings: [],
				metadata: null
			}
		};
	}
}
