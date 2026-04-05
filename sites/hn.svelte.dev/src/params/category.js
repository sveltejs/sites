const categories = new Set(['top', 'new', 'best', 'show', 'ask', 'jobs']);

/**
 * @param {string} name
 * @return {name is ('top' | 'new' | 'best' | 'show' | 'ask' | 'jobs')}
 * @satisfies {import('@sveltejs/kit').ParamMatcher}
 **/
export const match = (name) => categories.has(name);
