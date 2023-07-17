import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({ runtime: 'edge' }),

		inlineStyleThreshold: 5000
	}
};

export default config;
