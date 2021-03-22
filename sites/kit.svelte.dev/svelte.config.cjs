const netlify = require('@sveltejs/adapter-netlify');
const pkg = require('./package.json');

module.exports = {
	kit: {
		adapter: netlify(),
		target: '#svelte',
		vite: {
			ssr: {
				noExternal:
					process.env.NODE_ENV === 'development'
						? ['@sveltejs/site-kit']
						: ['@sveltejs/site-kit', ...Object.keys(pkg.dependencies || {})]
			}
		}
	}
};
