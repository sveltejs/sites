import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({ runtime: 'edge' }),

		inlineStyleThreshold: 5000
	},
	compilerOptions: {
		cssHash: ({ hash, css }) => `s-${hash(css)}`
	}
};

export default config;
