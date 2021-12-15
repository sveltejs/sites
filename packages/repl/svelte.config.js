import path from 'path';
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),

		package: {
			exports: file => file === 'index.js'
		},

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',

		vite: {
			resolve: {
				alias: {
					'@sveltejs/repl': path.resolve('src/lib/index.svelte')
				}
			}
		}
	}
};

export default config;
