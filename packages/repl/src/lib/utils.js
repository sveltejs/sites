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
