import netlify from '@sveltejs/adapter-netlify';

const API_BASE = process.env.DOCS_PREVIEW ? 'http://localhost:3456' : 'https://api.svelte.dev';

export default {
	kit: {
		adapter: netlify(),
		target: '#svelte',
		vite: () => ({
			define: {
				'process.env.API_BASE': JSON.stringify(API_BASE)
			}
		})
	}
};
