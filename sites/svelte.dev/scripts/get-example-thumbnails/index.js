import fs from 'fs';
import puppeteer from 'puppeteer';
import Jimp from 'jimp';
import c from 'kleur';
import fetch from 'node-fetch';

async function main() {
	const browser = await puppeteer.launch({
		defaultViewport: {
			width: (400 * 10) / 4,
			height: 400 + 42,
			deviceScaleFactor: 2
		}
	});

	const page = await browser.newPage();

	for (const slug of slugs) {
		try {
			const output_file = `static/examples/thumbnails/${slug}.jpg`;
			if (fs.existsSync(output_file)) {
				console.log(c.gray(`skipping ${slug}`));
				continue;
			}

			console.log(slug);
			await page.goto(`http://localhost:3000/repl/embed?example=${slug}`);

			await page.waitForSelector('iframe.inited[title=Result]');
			await page.waitFor(1500);
			const iframe = await page.$('iframe.inited[title=Result]');
			const buffer = await iframe.screenshot();

			const image = await Jimp.read(buffer);
			console.log(image.bitmap.width, image.bitmap.height);
			image.crop(3, 3, image.bitmap.width - 6, image.bitmap.height - 6);
			image.autocrop();
			// image.scale(0.25);

			if (image.bitmap.width > 200 || image.bitmap.height > 200) {
				const scale = Math.min(200 / image.bitmap.width, 200 / image.bitmap.height);

				image.scale(scale);
			}

			await image.quality(75).write(output_file);
		} catch (err) {
			console.log(c.bold().red(`failed to screenshot ${slug}`));
			console.log(err);
		}
	}

	await browser.close();
}

// main();

// const slugs = [];

// fs.readdirSync(`content/examples`).forEach(group_dir => {
// 	fs.readdirSync(`content/examples/${group_dir}`)
// 		.filter(file => file !== 'meta.json')
// 		.map(example_dir => {
// 			const slug = example_dir.replace(/^\d+-/, '');
// 			slugs.push(slug);
// 		});
// });

async function get_examples() {
	const slugs = [];
	const example_sections = await (
		await fetch('https://api.svelte.dev/docs/svelte/examples')
	).json();

	for (let i = 0; i < example_sections.length; i++) {
		if (!example_sections[i].name) continue;

		const examples = example_sections[i].examples;

		for (let j = 0; j < examples.length; j++) {
			slugs.push(examples[j].slug);
		}
	}
	return slugs;
}

get_examples();
