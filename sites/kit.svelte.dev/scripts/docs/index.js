import fs from 'fs';
import generate_docs from './generate_docs.js';

['docs', 'migrating'].forEach(page => {
	const data = generate_docs(page);

	fs.writeFileSync(`static/${page}.json`, JSON.stringify(data));
});