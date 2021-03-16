import fs from 'fs';
import path from 'path';
import { dev } from '$app/env';
import generate_docs from '../../utils/generate_docs.js';

let body;

console.log('>>> here', process.cwd(), fs.readdirSync(process.cwd()));
console.log('>>> src', fs.readdirSync('src'));

export function get() {
	if (!body || dev) {
		body = JSON.stringify(generate_docs('docs')); // TODO it errors if I send the non-stringified value
	}

	return {
		body
	};
}
