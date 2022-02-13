import path from 'path';
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),

		package: {
			exports: (file) => file === 'index.js'
		},

		vite: {
			resolve: {
				alias: {
					'@sveltejs/repl': path.resolve('src/lib'),
					'@sveltejs/site-kit': path.resolve('../site-kit/src/lib')
				}
			},
			server: {
				fs: {
					strict: false
				}
			}
		}
	}
};

export default config;
