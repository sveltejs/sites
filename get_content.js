const { cd, echo, exec, exit, ln, mkdir, test } = require('shelljs');

function run(cmd) {
	if (exec(cmd).code !== 0) {
		echo(`Error: ${cmd} failed`);
		exit(1);
	}
}

// Ensure content directory exists
mkdir('-p', 'content');
cd('content')

// Ensure kit repo is cloned and up-to-date

if (!test('-d', 'kit')) {
	run('git clone --depth 1 git@github.com:sveltejs/kit.git');
};
cd('kit');
run('git pull');

// Link content directory
cd('../..')
if (!test('-d', 'sites/kit.svelte.dev/content')) {
	ln('-s', '../../content/kit/documentation', 'sites/kit.svelte.dev/content');
}
