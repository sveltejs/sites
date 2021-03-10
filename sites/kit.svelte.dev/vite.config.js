import { resolve } from 'path';

export default {
	resolve: {
		alias: {
			$components: resolve('src/components')
		}
	},
	ssr: {
		noExternal: ['@sveltejs/site-kit']
	}
};
