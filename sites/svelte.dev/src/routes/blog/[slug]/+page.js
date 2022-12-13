import { get_post } from './data.js';

export async function load({ params }) {
	return {
		post: await get_post(params.slug)
	};
}
