import fs from 'fs';
import { transform } from './marked';

/**
 * @returns {import('./types').BlogPostSummary[]}
 */
export function get_index() {
	return fs
		.readdirSync('content/blog')
		.reverse()
		.map((file) => {
			if (!file.endsWith('.md')) return;

			const { date, slug } = get_date_and_slug(file);

			const content = fs.readFileSync(`content/blog/${file}`, 'utf-8');
			const { metadata } = extract_frontmatter(content);

			return {
				slug,
				date,
				title: metadata.title,
				description: metadata.description,
				draft: !!metadata.draft
			};
		});
}

/**
 * @param {string} slug
 * @returns {import('./types').BlogPost}
 */
export function get_post(slug) {
	for (const file of fs.readdirSync('content/blog')) {
		if (!file.endsWith('.md')) continue;
		if (file.slice(11, -3) !== slug) continue;

		const { date, date_formatted } = get_date_and_slug(file);

		const content = fs.readFileSync(`content/blog/${file}`, 'utf-8');
		const { metadata, body } = extract_frontmatter(content);

		return {
			date,
			date_formatted,
			title: metadata.title,
			description: metadata.description,
			author: {
				name: metadata.author,
				url: metadata.authorURL
			},
			draft: !!metadata.draft,
			content: transform(body)
		};
	}
}

/** @param {string} filename */
function get_date_and_slug(filename) {
	const match = /^(\d{4}-\d{2}-\d{2})-(.+)\.md$/.exec(filename);
	if (!match) throw new Error(`Invalid filename for blog: '${filename}'`);

	const [, date, slug] = match;
	const [y, m, d] = date.split('-');
	const date_formatted = `${months[+m - 1]} ${+d} ${y}`;

	return { date, date_formatted, slug };
}

/** @param {string} markdown */
function extract_frontmatter(markdown) {
	const match = /---\r?\n([\s\S]+?)\r?\n---/.exec(markdown);
	const frontmatter = match[1];
	const body = markdown.slice(match[0].length);

	/** @type {Record<string, string>} */
	const metadata = {};
	frontmatter.split('\n').forEach((pair) => {
		const i = pair.indexOf(':');
		metadata[pair.slice(0, i).trim()] = strip_quotes(pair.slice(i + 1).trim());
	});

	return { metadata, body };
}

function strip_quotes(str) {
	if (str[0] === '"' && str[str.length - 1] === '"') return str.slice(1, -1);
	return str;
}

const months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');

function format_date(date) {}
