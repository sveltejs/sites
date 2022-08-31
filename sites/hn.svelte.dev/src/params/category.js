const categories = new Set(['top', 'new', 'show', 'ask', 'jobs']);

/** @type {import('@sveltejs/kit').ParamMatcher} */
export const match = (name) => categories.has(name);
