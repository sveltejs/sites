const netlify = require('@sveltejs/adapter-netlify');

const API_BASE = process.env.DOCS_PREVIEW ? 'http://localhost:3456' : 'https://api.svelte.dev';

module.exports = {
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
