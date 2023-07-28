import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// new projects use adapter-auto by default
		// we use adapter-vercel here to use more efficient edge serving
		adapter: adapter({ runtime: 'edge' }),

		inlineStyleThreshold: 5000
	}
};

export default config;
