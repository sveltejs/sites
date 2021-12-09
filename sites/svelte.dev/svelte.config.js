import adapter from '@sveltejs/adapter-node';
import * as path from 'path';
import { imagetools } from 'vite-imagetools';

const API_BASE = process.env.DOCS_PREVIEW ? 'http://localhost:8787' : 'https://api.svelte.dev';
process.env.VITE_API_BASE = API_BASE;

/** @type {import('@sveltejs/kit').Config} */
export default {
	kit: {
		adapter: adapter(),
		target: '#svelte',
		prerender: {
			enabled: false
		},
		vite: () => ({
			// https://github.com/sveltejs/kit/issues/1632#issuecomment-854056053
			build: {
				rollupOptions: {
					output: {
						manualChunks: undefined
					}
				}
			},
			optimizeDeps: {
				include: [
					'codemirror',
					'codemirror/mode/javascript/javascript.js',
					'codemirror/mode/handlebars/handlebars.js',
					'codemirror/mode/htmlmixed/htmlmixed.js',
					'codemirror/mode/xml/xml.js',
					'codemirror/mode/css/css.js',
					'codemirror/mode/markdown/markdown.js',
					'codemirror/addon/edit/closebrackets.js',
					'codemirror/addon/edit/closetag.js',
					'codemirror/addon/edit/continuelist.js',
					'codemirror/addon/comment/comment.js',
					'codemirror/addon/fold/foldcode.js',
					'codemirror/addon/fold/foldgutter.js',
					'codemirror/addon/fold/brace-fold.js',
					'codemirror/addon/fold/xml-fold.js',
					'codemirror/addon/fold/indent-fold.js',
					'codemirror/addon/fold/markdown-fold.js',
					'codemirror/addon/fold/comment-fold.js'
				]
			},
			plugins: [imagetools()],
			resolve: {
				alias: {
					$img: path.resolve('src/images'),
					'@sveltejs/repl': path.resolve('../../packages/repl/src/lib/index.svelte')
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
