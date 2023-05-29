import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	resolve: {
		dedupe: ['@codemirror/state']
	},
	server: {
		fs: {
			strict: false
		}
	}
};

export default config;
