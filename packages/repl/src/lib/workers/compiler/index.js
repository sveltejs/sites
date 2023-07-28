/// <reference lib="webworker" />
self.window = self; //TODO: still need?: egregious hack to get magic-string to work in a worker

// This is just for type-safety
/** @type {import('svelte/compiler')} */
var svelte;

/** @type {(...val: never) => void} */
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
				const { svelte_url } = event.data;
				const { version } = await fetch(`${svelte_url}/package.json`).then((r) => r.json());

				if (version.startsWith('4')) {
					// unpkg doesn't set the correct MIME type for .cjs files
					// https://github.com/mjackson/unpkg/issues/355
					const compiler = await fetch(`${svelte_url}/compiler.cjs`).then((r) => r.text());
					(0, eval)(compiler + '\n//# sourceURL=compiler.cjs@' + version);
				} else {
					try {
						importScripts(`${svelte_url}/compiler.js`);
					} catch {
						self.svelte = await import(/* @vite-ignore */ `${svelte_url}/compiler.mjs`);
					}
				}

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
		const { js, css, ast } = self.svelte.compile(
			source,
			Object.assign({}, common_options, options)
		);

		return {
			id,
			result: {
				js: js.code,
				css: css.code || `/* Add a <sty` + `le> tag to see compiled CSS */`,
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
