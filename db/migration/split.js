import fs from 'fs';

const pad = num => {
	let str = String(num);
	while (str.length < 3) str = `0${str}`;
	return str;
};

const fields = ['ignore', 'id', 'userid', 'name', 'files', 'created_at', 'updated_at'].join(',');

const stream = fs.createReadStream(new URL('../data/gists.csv', import.meta.url), 'utf-8');

let buffer = '';
let i = 1;

try {
	fs.mkdirSync(new URL('../data/gists', import.meta.url));
} catch {
	// ignore
}

const flush = () => {
	const index = buffer.lastIndexOf('\n');

	fs.writeFileSync(
		new URL(`../data/gists/${pad(i++)}.csv`, import.meta.url),
		`${fields}\n${buffer.slice(0, index)}`
	);

	buffer = buffer.slice(index + 1);
};

stream.on('data', chunk => {
	buffer += chunk;
	if (buffer.length > 5 * 1e7) flush();
});

stream.on('end', () => {
	flush();
});
