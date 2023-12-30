/**
 * Replaces export {} with svelte.EXPORT = EXPORT
 * @param {string} input
 */
function remove_exports(input) {
	const pattern = /export\{(.*?)\};/g;

	return input.replace(
		pattern,
		/**
			@param {string} _
			@param {string} exports
	 */ (_, exports) => {
			return exports
				.split(',')
				.map((e) => {
					const [original, alias] = e.split(' as ').map((s) => s.trim());
					return `svelte.${alias} = ${original};`;
				})
				.join('');
		}
	);
}

/**
 * @param {string} url
 */
export async function get_svelte_package_json(url) {
	if (url.includes('https://esm.run')) {
		// This will be an import, rather manually get the package.json
		url = url.replace('https://esm.run', 'https://cdn.jsdelivr.net/npm');
	}

	return await fetch(`${url}/package.json`).then((r) => r.json());
}

/**
 * Loads the compiler from the specified version
 * @param {string} version
 * @param {string} svelte_url
 */
export async function load_compiler(svelte_url, version) {
	if (version.startsWith('4') || version.startsWith('5')) {
		let compiler = await fetch(`${svelte_url}/compiler.cjs`).then((r) => r.text());

		if (svelte_url.includes('esm.run')) {
			// Remove all the exports
			compiler = remove_exports(compiler);
		}

		(0, eval)('var svelte = {};' + compiler + '\n//# sourceURL=compiler.js@' + version);
	} else {
		try {
			importScripts(`${svelte_url}/compiler.js`);
		} catch {
			self.svelte = await import(/* @vite-ignore */ `${svelte_url}/compiler.mjs`);
		}
	}
}
