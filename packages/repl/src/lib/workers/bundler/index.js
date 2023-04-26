/// <reference lib="webworker" />
import { sleep } from '$lib/utils.js';
import { rollup } from '@rollup/browser';
import { DEV } from 'esm-env';
import * as resolve from 'resolve.exports';
import commonjs from './plugins/commonjs.js';
import glsl from './plugins/glsl.js';
import json from './plugins/json.js';
import replace from './plugins/replace.js';

self.window = self; // egregious hack to get magic-string to work in a worker

/** @type {string} */
var pkg_name;

/** @type {string} */
let packages_url;

/** @type {string} */
let svelte_url;

/** @type {number} */
let current_id;

/** @type {(...arg: never) => void} */
let fulfil_ready;
const ready = new Promise((f) => {
	fulfil_ready = f;
});

self.addEventListener(
	'message',
	/** @param {MessageEvent<import('../workers.js').BundleMessageData>} event */ async (event) => {
		switch (event.data.type) {
			case 'init':
				packages_url = event.data.packages_url;
				svelte_url = event.data.svelte_url;

				try {
					importScripts(`${svelte_url}/compiler.js`);
				} catch {
					self.svelte = await import(/* @vite-ignore */ `${svelte_url}/compiler.mjs`);
				}

				fulfil_ready();
				break;

			case 'bundle':
				await ready;
				const { uid, files } = event.data;

				if (files.length === 0) return;

				current_id = uid;

				setTimeout(async () => {
					if (current_id !== uid) return;

					const result = await bundle({ uid, files });

					if (JSON.stringify(result.error) === JSON.stringify(ABORT)) return;
					if (result && uid === current_id) postMessage(result);
				});

				break;
		}
	}
);

/** @type {Record<'dom' | 'ssr', Map<string, { code: string, result: ReturnType<typeof import('svelte/compiler').compile> }>>} */
let cached = {
	dom: new Map(),
	ssr: new Map(),
};

const ABORT = { aborted: true };

/** @type {Map<string, Promise<{ url: string; body: string; }>>} */
const FETCH_CACHE = new Map();

/**
 * @param {string} url
 * @param {number} uid
 */
async function fetch_if_uncached(url, uid) {
	if (FETCH_CACHE.has(url)) {
		return FETCH_CACHE.get(url);
	}

	await sleep(200);
	if (uid !== current_id) throw ABORT;

	const promise = fetch(url)
		.then(async (r) => {
			if (!r.ok) throw new Error(await r.text());

			return {
				url: r.url,
				body: await r.text(),
			};
		})
		.catch((err) => {
			FETCH_CACHE.delete(url);
			throw err;
		});

	FETCH_CACHE.set(url, promise);
	return promise;
}

/**
 * @param {string} url
 * @param {number} uid
 */
async function follow_redirects(url, uid) {
	const res = await fetch_if_uncached(url, uid);
	return res?.url;
}

/**
 *
 * @param {number} major
 * @param {number} minor
 * @param {number} patch
 * @returns {number}
 */
function compare_to_version(major, minor, patch) {
	const v = self.svelte.VERSION.match(/^(\d+)\.(\d+)\.(\d+)/);

	// @ts-ignore
	return +v[1] - major || +v[2] - minor || +v[3] - patch;
}

function is_legacy_package_structure() {
	return compare_to_version(3, 4, 4) <= 0;
}

function has_loopGuardTimeout_feature() {
	return compare_to_version(3, 14, 0) >= 0;
}

/**
 *
 * @param {Record<string, unknown>} pkg
 * @param {string} subpath
 * @param {number} uid
 * @param {string} pkg_url_base
 */
async function resolve_from_pkg(pkg, subpath, uid, pkg_url_base) {
	// match legacy Rollup logic — pkg.svelte takes priority over pkg.exports
	if (typeof pkg.svelte === 'string' && subpath === '.') {
		return pkg.svelte;
	}

	// modern
	if (pkg.exports) {
		try {
			const [resolved] =
				resolve.exports(pkg, subpath, {
					browser: true,
					conditions: ['svelte', 'production'],
				}) ?? [];

			return resolved;
		} catch {
			throw `no matched export path was found in "${pkg_name}/package.json"`;
		}
	}

	// legacy
	if (subpath === '.') {
		const resolved_id = resolve.legacy(pkg, {
			fields: ['browser', 'module', 'main'],
		});

		if (!resolved_id) {
			// last ditch — try to match index.js/index.mjs
			for (const index_file of ['index.mjs', 'index.js']) {
				try {
					const indexUrl = new URL(index_file, `${pkg_url_base}/`).href;
					return (await follow_redirects(indexUrl, uid)) ?? '';
				} catch {
					// maybe the next option will be successful
				}
			}

			throw `could not find entry point in "${pkg_name}/package.json"`;
		}

		return resolved_id;
	}

	if (typeof pkg.browser === 'object') {
		// this will either return `pkg.browser[subpath]` or `subpath`
		return resolve.legacy(pkg, {
			browser: subpath,
		});
	}

	return subpath;
}

/**
 * @param {number} uid
 * @param {'dom' | 'ssr'} mode
 * @param {typeof cached['dom']} cache
 * @param {Map<string, import('$lib/types.js').File>} lookup
 */
async function get_bundle(uid, mode, cache, lookup) {
	let bundle;

	/** A set of package names (without subpaths) to include in pkg.devDependencies when downloading an app */
	/** @type {Set<string>} */
	const imports = new Set();

	/** @type {import('$lib/types.js').Warning[]} */
	const warnings = [];

	/** @type {{ message: string }[]} */
	const all_warnings = [];

	/** @type {typeof cache} */
	const new_cache = new Map();

	/** @type {import('@rollup/browser').Plugin} */
	const repl_plugin = {
		name: 'svelte-repl',
		async resolveId(importee, importer) {
			if (uid !== current_id) throw ABORT;

			// importing from Svelte
			if (importee === `svelte`) return `${svelte_url}/index.mjs`;
			if (importee.startsWith(`svelte/`)) {
				return is_legacy_package_structure()
					? `${svelte_url}/${importee.slice(7)}.mjs`
					: `${svelte_url}/${importee.slice(7)}/index.mjs`;
			}

			// importing one Svelte runtime module from another
			if (importer && importer.startsWith(svelte_url)) {
				const resolved = new URL(importee, importer).href;
				if (resolved.endsWith('.mjs')) return resolved;
				return is_legacy_package_structure() ? `${resolved}.mjs` : `${resolved}/index.mjs`;
			}

			// importing from another file in REPL
			if (lookup.has(importee) && (!importer || lookup.has(importer))) return importee;
			if (lookup.has(importee + '.js')) return importee + '.js';
			if (lookup.has(importee + '.json')) return importee + '.json';

			// remove trailing slash
			if (importee.endsWith('/')) importee = importee.slice(0, -1);

			// importing from a URL
			if (importee.startsWith('http:') || importee.startsWith('https:')) return importee;

			// importing from (probably) unpkg
			if (importee.startsWith('.')) {
				const url = new URL(importee, importer).href;
				self.postMessage({ type: 'status', uid, message: `resolving ${url}` });

				return await follow_redirects(url, uid);
			} else {
				// fetch from unpkg
				self.postMessage({ type: 'status', uid, message: `resolving ${importee}` });

				const match = /^((?:@[^/]+\/)?[^/]+)(\/.+)?$/.exec(importee);
				if (!match) {
					throw new Error(`Invalid import "${importee}"`);
				}

				const pkg_name = match[1];
				const subpath = `.${match[2] ?? ''}`;

				// if this was imported by one of our files, add it to the `imports` set
				if (importer && importer in lookup) {
					imports.add(pkg_name);
				}

				const fetch_package_info = async () => {
					try {
						const pkg_url = await follow_redirects(`${packages_url}/${pkg_name}/package.json`, uid);

						if (!pkg_url) throw new Error();

						const pkg_json = (await fetch_if_uncached(pkg_url, uid))?.body;
						const pkg = JSON.parse(pkg_json ?? '"');

						const pkg_url_base = pkg_url.replace(/\/package\.json$/, '');

						return {
							pkg,
							pkg_url_base,
						};
					} catch (_e) {
						throw new Error(`Error fetching "${pkg_name}" from unpkg. Does the package exist?`);
					}
				};

				const { pkg, pkg_url_base } = await fetch_package_info();

				try {
					const resolved_id = await resolve_from_pkg(pkg, subpath, uid, pkg_url_base);
					return new URL(resolved_id + '', `${pkg_url_base}/`).href;
				} catch (reason) {
					throw new Error(`Cannot import "${importee}": ${reason}.`);
				}
			}
		},
		async load(resolved) {
			if (uid !== current_id) throw ABORT;

			const cached_file = lookup.get(resolved);
			if (cached_file) return cached_file.source;

			if (!FETCH_CACHE.has(resolved)) {
				self.postMessage({ type: 'status', uid, message: `fetching ${resolved}` });
			}

			const res = await fetch_if_uncached(resolved, uid);
			return res?.body;
		},
		transform(code, id) {
			if (uid !== current_id) throw ABORT;

			self.postMessage({ type: 'status', uid, message: `bundling ${id}` });

			if (!/\.svelte$/.test(id)) return null;

			const name = id.split('/').pop()?.split('.')[0];

			const cached_id = cache.get(id);
			const result =
				cached_id && cached_id.code === code
					? cached_id.result
					: self.svelte.compile(code, {
							generate: mode,
							format: 'esm',
							dev: true,
							filename: name + '.svelte',
							...(has_loopGuardTimeout_feature() && {
								loopGuardTimeout: 100,
							}),
					  });

			new_cache.set(id, { code, result });

			(result.warnings || result.stats.warnings)?.forEach((warning) => {
				// This is required, otherwise postMessage won't work
				delete warning.toString;
				// TODO remove stats post-launch
				warnings.push(warning);
			});

			return result.js;
		},
	};

	try {
		bundle = await rollup({
			input: './App.svelte',
			plugins: [
				repl_plugin,
				commonjs,
				json,
				glsl,
				replace({
					'process.env.NODE_ENV': JSON.stringify('production'),
				}),
			],
			inlineDynamicImports: true,
			onwarn(warning) {
				all_warnings.push({
					message: warning.message,
				});
			},
		});

		return {
			bundle,
			imports: Array.from(imports),
			cache: new_cache,
			error: null,
			warnings,
			all_warnings,
		};
	} catch (error) {
		return { error, imports: null, bundle: null, cache: new_cache, warnings, all_warnings };
	}
}

/**
 * @param {{ uid: number; files: import('$lib/types.js').File[] }} param0
 * @returns
 */
async function bundle({ uid, files }) {
	if (!DEV) {
		console.clear();
		console.log(`running Svelte compiler version %c${self.svelte.VERSION}`, 'font-weight: bold');
	}

	/** @type {Map<string, import('$lib/types.js').File>} */
	const lookup = new Map();

	files.forEach((file) => {
		const path = `./${file.name}.${file.type}`;
		lookup.set(path, file);
	});

	/** @type {Awaited<ReturnType<typeof get_bundle>>} */
	let dom = await get_bundle(uid, 'dom', cached.dom, lookup);
	let error;

	try {
		if (dom.error) {
			throw dom.error;
		}

		cached.dom = dom.cache;

		const dom_result = (
			await dom.bundle?.generate({
				format: 'iife',
				name: 'SvelteComponent',
				exports: 'named',
				sourcemap: true,
			})
		)?.output[0];

		const ssr = false // TODO how can we do SSR?
			? await get_bundle(uid, 'ssr', cached.ssr, lookup)
			: null;

		if (ssr) {
			cached.ssr = ssr.cache;
			if (ssr.error) {
				throw ssr.error;
			}
		}

		const ssr_result = ssr
			? (
					await ssr.bundle?.generate({
						format: 'iife',
						name: 'SvelteComponent',
						exports: 'named',
						sourcemap: true,
					})
			  )?.output?.[0]
			: null;

		return {
			uid,
			dom: dom_result,
			ssr: ssr_result,
			imports: dom.imports,
			warnings: dom.warnings,
			error: null,
		};
	} catch (err) {
		console.error(err);

		/** @type {Error} */
		// @ts-ignore
		const e = error || err;

		// @ts-ignore
		delete e.toString;

		return {
			uid,
			dom: null,
			ssr: null,
			imports: null,
			warnings: dom.warnings,
			error: Object.assign({}, e, {
				message: e.message,
				stack: e.stack,
			}),
		};
	}
}
