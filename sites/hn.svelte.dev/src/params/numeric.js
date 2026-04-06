/**
 * @param {string} numeric
 * @return {numeric is `${number}`}
 * @satisfies {import('@sveltejs/kit').ParamMatcher}
 **/
export const match = (numeric) => /^\d+$/.test(numeric);
