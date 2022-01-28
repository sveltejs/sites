import * as path from 'path';
import adapter from '@sveltejs/adapter-auto';
import { imagetools } from 'vite-imagetools';

const API_BASE = process.env.DOCS_PREVIEW ? 'http://localhost:3456' : 'https://api.svelte.dev';

export default {
	kit: {
		adapter: adapter(),
		target: '#svelte',
		vite: () => ({
			define: {
				'process.env.API_BASE': JSON.stringify(API_BASE)
			},
			plugins: [imagetools()],
			resolve: {
				alias: {
					$img: path.resolve('src/images'),
					'@sveltejs/site-kit': path.resolve('../../packages/site-kit/src/lib')
				}
			},
			server: {
				fs: {
					strict: false
				}
			}
		})
	}
};
