const { cd, echo, exec, exit, ln, mkdir, test } = require('shelljs');

function run(cmd) {
	if (exec(cmd).code !== 0) {
		echo(`Error: ${cmd} failed`);
		exit(1);
	}
}

// Ensure content directory exists
cd('sites/kit.svelte.dev')

// Ensure kit repo is cloned and up-to-date
if (!test('-d', 'content')) {
	run('git clone --depth 1 git@github.com:sveltejs/kit.git content');
};
cd('content');
run('git pull');
