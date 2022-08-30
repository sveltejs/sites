const categories = new Set(['news', 'newest', 'show', 'ask', 'jobs']);

/** @type {import('@sveltejs/kit').ParamMatcher} */
export const match = (name) => categories.has(name);
