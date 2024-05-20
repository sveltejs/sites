/**
 * @param {number} min
 * @param {number} max
 * @param {number} value
 */
export const clamp = (min, max, value) => Math.max(min, Math.min(max, value));

/**
 * @param {number} ms
 */
export const sleep = (ms) => new Promise((f) => setTimeout(f, ms));

/** @param {import('./types').File} file */
export function get_full_filename(file) {
	return `${file.name}.${file.type}`;
}

export function create_deferred_promise() {
	/** @type {(...value: any) => void} */
	let resolve = () => {};

	/** @type {(...reason: any) => void} */
	let reject = () => {};

	const promise = new Promise((_resolve, _reject) => {
		resolve = _resolve;
		reject = _reject;
	});

	return { promise, resolve, reject };
}
