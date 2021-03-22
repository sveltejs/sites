// TODO put this in site-kit? svelte.dev uses Prism instead of hljs
import fs from 'fs';
import {
	extract_frontmatter,
	extract_metadata,
	langs,
	link_renderer
} from '@sveltejs/site-kit/utils/markdown.js';
import marked from 'marked';
import hljs from 'highlight.js';

const block_types = [
	'blockquote',
	'html',
	'heading',
	'hr',
	'list',
	'listitem',
	'paragraph',
	'table',
	'tablerow',
	'tablecell'
];

const basedir = 'content/documentation';

export default function generate_docs(dir) {
	const seen = new Set();

	const make_slug = string => {
		const slug = string
			.replace(/[^a-z0-9-]/gi, '-')
			.replace(/-{2,}/g, '-')
			.replace(/^-/, '')
			.replace(/-$/, '')
			.toLowerCase();

		if (seen.has(slug)) throw new Error(`Duplicate slug ${slug}`);
		seen.add(slug);

		return slug;
	};

	return fs
		.readdirSync(`${basedir}/${dir}`)
		.filter(file => /^\d{2}-.+\.md$/.test(file))
		.map(file => {
			const markdown = fs.readFileSync(`${basedir}/${dir}/${file}`, 'utf-8');

			const { content, metadata } = extract_frontmatter(markdown);

			const section_slug = make_slug(metadata.title);
			let subsection_slug = null;

			const subsections = [];

			const renderer = new marked.Renderer();

			let block_open = false;

			renderer.link = link_renderer;

			renderer.hr = () => {
				block_open = true;

				return '<div class="side-by-side"><div class="copy">';
			};

			renderer.code = (source, lang) => {
				source = source.replace(/^ +/gm, match => match.split('    ').join('\t'));

				const lines = source.split('\n');

				const meta = extract_metadata(lines[0], lang);

				let prefix = '';
				// let class_name = 'code-block';
				let class_name = '';

				if (meta) {
					source = lines.slice(1).join('\n');
					const filename = meta.filename || (lang === 'html' && 'App.svelte');
					if (filename) {
						prefix = `<span class='filename'>${prefix} ${filename}</span>`;
						class_name += ' named';
					}
				}

				if (meta && meta.hidden) {
					return '';
				}

				const plang = langs[lang];
				const { value: highlighted } = hljs.highlight(lang, source);
				// const highlighted = PrismJS.highlight(
				// 	source,
				// 	PrismJS.languages[plang],
				// 	lang
				// );

				const html = `<div class='${class_name}'>${prefix}<pre class='language-${plang}'><code>${highlighted}</code></pre></div>`;

				if (block_open) {
					block_open = false;
					return `</div><div class="code">${html}</div></div>`;
				}

				return html;
			};

			renderer.heading = (text, level, rawtext) => {
				if (level === 3 || level === 4) {
					if (level === 3) {
						subsection_slug = rawtext;
					}

					const slug = make_slug(
						level === 3
							? [section_slug, subsection_slug].join('-')
							: [section_slug, subsection_slug, rawtext].filter(Boolean).join('-')
					);

					const title = text
						.replace(/<\/?code>/g, '')
						.replace(/\.(\w+)(\((.+)?\))?/, (m, $1, $2, $3) => {
							if ($3) return `.${$1}(...)`;
							if ($2) return `.${$1}()`;
							return `.${$1}`;
						});

					subsections.push({ slug, title, level });

					return `
						<h${level}>
							<span id="${slug}" class="offset-anchor" ${level > 4 ? 'data-scrollignore' : ''}></span>
							<a href="${dir}#${slug}" class="anchor" aria-hidden="true"></a>
							${text}
						</h${level}>`;
				} else {
					console.log({ rawtext });
					throw new Error(`headings must be level 3 or 4`);
				}
			};

			block_types.forEach(type => {
				const fn = renderer[type];
				renderer[type] = function() {
					return fn.apply(this, arguments);
				};
			});

			const html = marked(content, { renderer });

			const hashes = {};

			return {
				html: html.replace(/@@(\d+)/g, (m, id) => hashes[id] || m),
				metadata,
				subsections,
				slug: section_slug,
				file
			};
		});
}
