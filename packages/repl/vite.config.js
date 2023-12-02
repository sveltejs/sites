import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	resolve: {
		dedupe: ['@codemirror/state', '@codemirror/language', '@codemirror/view']
	},
	optimizeDeps: {
		exclude: ['@rollup/browser']
	},
	server: {
		fs: {
			strict: false
		}
	}
};

export default config;
