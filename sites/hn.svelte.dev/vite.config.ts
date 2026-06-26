import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import adapter from '@sveltejs/adapter-vercel';

export default defineConfig({
	plugins: [
		sveltekit({
			adapter: adapter({
				isr: {
					allowQuery: [], // we don't use any query params
					expiration: 60
				}
			}),
			inlineStyleThreshold: 5000,
			compilerOptions: {
				runes: true
			}
		})
	]
});
