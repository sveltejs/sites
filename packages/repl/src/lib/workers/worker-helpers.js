/**
 * Loads the svelte compiler
 * @param {string} svelte_url
 */
export async function load_svelte_compiler(svelte_url) {
	const { version } = await fetch(`${svelte_url}/package.json`).then((r) => r.json());
	console.log(`Using Svelte compiler version ${version}`);

	if (version.startsWith('4')) {
		// unpkg doesn't set the correct MIME type for .cjs files
		// https://github.com/mjackson/unpkg/issues/355
		const compiler = await fetch(`${svelte_url}/compiler.cjs`).then((r) => r.text());
		(0, eval)(compiler + '\n//# sourceURL=compiler.cjs@' + version);

		// @ts-ignore
		return self.svelte;
	} else {
		// @ts-ignore
		return (self.svelte = await import(/* @vite-ignore */ `${svelte_url}/compiler.mjs`));
	}
}
