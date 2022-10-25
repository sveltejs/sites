import * as path from 'path';
import { sveltekit } from '@sveltejs/kit/vite';
import { imagetools } from 'vite-imagetools';

process.env.VITE_API_BASE = process.env.DOCS_PREVIEW
	? 'http://localhost:8787'
	: 'https://api.svelte.dev';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [imagetools(), sveltekit()],
	resolve: {
		alias: {
			'@sveltejs/repl': path.resolve('../../packages/repl/src/lib'),
			'@sveltejs/site-kit': path.resolve('../../packages/site-kit/src/lib')
		}
	},
	server: {
		fs: {
			strict: false
		}
	}
};

export default config;
