import url from 'url';
import path from 'path';

export function get_dirname(pathname) {
	return path.dirname(url.fileURLToPath(pathname));
}
