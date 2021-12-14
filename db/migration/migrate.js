import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { csvParse } from 'd3-dsv';
import { fileURLToPath } from 'url';

const { SUPABASE_URL, SUPABASE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_KEY) {
	throw new Error(`Must specify SUPABASE_URL and SUPABASE_KEY`);
}

const client = createClient(SUPABASE_URL, SUPABASE_KEY);

process.chdir(fileURLToPath(new URL('../..', import.meta.url)));

const read = file => fs.readFileSync(file, 'utf-8');

async function users() {
	const fields = [
		'id',
		'github_id',
		'github_name',
		'github_login',
		'github_avatar_url',
		'access_token',
		'created_at',
		'updated_at'
	].join(',');
	const users = csvParse(`${fields}\n${read('db/data/users.csv')}`);

	console.log(`migrating ${users.length} users`);

	const payload = users.map(u => ({
		id: Number(u.id),
		github_id: Number(u.github_id),
		github_name: u.github_name,
		github_login: u.github_login,
		github_avatar_url: u.github_avatar_url,
		created_at: new Date(u.created_at),
		updated_at: new Date(u.updated_at)
	}));

	await client.from('user').insert(payload, { upsert: true });
}

async function gists() {
	const batches = fs.readdirSync('db/data/gists');

	for (const batch of batches) {
		const csv = fs.readFileSync(`db/data/gists/${batch}`, 'utf-8');
		const gists = csvParse(csv);

		console.log(`${batch} migrating ${gists.length} gists`);

		const page_size = 100;

		for (let a = 0; a < gists.length; a += page_size) {
			const b = a + page_size;
			console.log(`${a} - ${b}`);

			const payload = gists
				.map(g => ({
					id: g.id,
					userid: Number(g.userid),
					created_at: new Date(g.created_at),
					updated_at: g.updated_at ? new Date(g.updated_at) : null,
					name: g.name,
					files: JSON.parse(g.files)
				}))
				.slice(a, b);

			const { error } = await client.from('gist').insert(payload, { upsert: true });

			if (error) {
				console.log(payload);
				throw new Error(error.message);
			}
		}
	}
}

// await users();
await gists();
