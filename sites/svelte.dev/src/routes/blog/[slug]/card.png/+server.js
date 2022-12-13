import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import OverpassRegular from './Overpass-Regular.ttf';
import { html as toReactNode } from 'satori-html';
import Card from './Card.svelte';
import { get_post } from '../data.js';

const height = 630;
const width = 1200;

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ params, url }) => {
	const post = await get_post(params.slug);

	const result = Card.render({ post, origin: url.origin });
	const element = toReactNode(`${result.html}<style>${result.css.code}</style>`);

	const svg = await satori(element, {
		fonts: [
			{
				name: 'Overpass',
				data: Buffer.from(OverpassRegular),
				style: 'normal',
				weight: 400
			}
		],
		height,
		width
	});

	const resvg = new Resvg(svg, {
		fitTo: {
			mode: 'width',
			value: width
		}
	});

	const image = resvg.render();

	return new Response(image.asPng(), {
		headers: {
			'content-type': 'image/png'
		}
	});
};
