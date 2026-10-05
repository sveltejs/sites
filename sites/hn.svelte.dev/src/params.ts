import { defineParams } from '@sveltejs/kit/params';

const categories = new Set(['top', 'new', 'best', 'show', 'ask', 'jobs']);
const matchCategory = (name: string): name is 'top' | 'new' | 'best' | 'show' | 'ask' | 'jobs' =>
	categories.has(name);

const matchNumeric = (numeric: string): numeric is `${number}` => /^\d+$/.test(numeric);

export const params = defineParams({
	category: (param) => (matchCategory(param) ? param : undefined),
	numeric: (param) => (matchNumeric(param) ? param : undefined)
});
