import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		runes: true
	},
	kit: {
		preprocess: vitePreprocess(),
		// new projects use adapter-auto by default
		// we use adapter-vercel here to use more efficient edge serving
		adapter: adapter({ runtime: 'edge' }),

		inlineStyleThreshold: 5000
	}
};

export default config;
