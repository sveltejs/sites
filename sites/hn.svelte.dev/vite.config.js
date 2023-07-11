import { sveltekit } from '@sveltejs/kit/vite';
import browserslist from 'browserslist';
import { browserslistToTargets } from 'lightningcss';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	css: {
		transformer: 'lightningcss',
		lightningcss: {
			targets: browserslistToTargets(browserslist(['defaults', 'not dead']))
		}
	},
	build: {
		cssMinify: 'lightningcss'
	}
};

export default config;
