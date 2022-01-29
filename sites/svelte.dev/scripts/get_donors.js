import 'dotenv/config';
import fs from 'fs';
import fetch from 'node-fetch';
import Jimp from 'jimp';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const force = process.env.FORCE_UPDATE === 'true';

const __dirname = dirname(fileURLToPath(import.meta.url));
process.chdir(__dirname);

const outputFile = `../src/routes/_components/Supporters/donors.js`;
if (!force && fs.existsSync(outputFile)) {
	console.info(`[update/donors] ${outputFile} exists. Skipping`);
	process.exit(0);
}

const MAX = 24;
const SIZE = 128;

async function main() {
	const res = await fetch('https://opencollective.com/svelte/members/all.json');
	const donors = await res.json();

	const unique = new Map();
	donors.forEach((d) => unique.set(d.profile, d));

	let backers = [...unique.values()]
		.filter(({ role }) => role === 'BACKER')
		.sort((a, b) => b.totalAmountDonated - a.totalAmountDonated)
		.slice(0, 3 * MAX);

	const included = [];
	for (let i = 0; included.length < MAX; i += 1) {
		const backer = backers[i];
		console.log(`${included.length + 1} / ${MAX}: ${backer.name}`);

		try {
			const image_data = await fetch(backer.image);
			const buffer = await image_data.arrayBuffer();
			const image = await Jimp.read(buffer);
			image.resize(SIZE, SIZE);
			included.push({ backer, image });
		} catch (err) {
			console.log(`Skipping ${backer.name}: no image data`);
		}
	}

	const sprite = new Jimp(SIZE * included.length, SIZE);
	for (let i = 0; i < included.length; i += 1) {
		sprite.composite(included[i].image, i * SIZE, 0);
	}

	await sprite.quality(80).write(`../src/routes/_components/Supporters/donors.jpg`);
	// TODO: Optimizing the static/donors.jpg image should probably get automated as well
	console.log(
		'remember to additionally optimize the resulting /static/donors.jpg image file via e.g. https://squoosh.app '
	);

	const str = `[\n\t${included.map((a) => `${JSON.stringify(a.backer.name)}`).join(',\n\t')}\n]`;

	fs.writeFileSync(outputFile, `export default ${str};`);
}

main();
