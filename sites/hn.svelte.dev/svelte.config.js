import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		runes: true
	},
	kit: {
		// new projects use adapter-auto by default
		// we use adapter-vercel here to use more efficient edge serving
		adapter: adapter({
			isr: {
				allowQuery: [], // we don't use any query params
				expiration: 60
			}
		}),

		inlineStyleThreshold: 5000
	}
};

export default config;
