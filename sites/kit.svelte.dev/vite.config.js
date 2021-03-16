import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const pkg_file = fileURLToPath(new URL('./package.json', import.meta.url));
const pkg = JSON.parse(readFileSync(pkg_file), 'utf-8');

export default {
	resolve: {
		alias: {
			$components: resolve('src/components')
		}
	},
	ssr: {
		noExternal: ['@sveltejs/site-kit', ...Object.keys(pkg.dependencies)]
	}
};
