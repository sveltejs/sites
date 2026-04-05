/**
 * Types used by the parser
 *
 * @typedef {{ type: "text", text: string }
 *         | { type: "link", href: string, text: string }
 *         | { type: "italic", children: Inline[] }} Inline
 *
 * @typedef {{ type: "paragraph", children: Inline[] }
 *         | { type: "code", text: string }} Block
 *
 * @typedef {{ marker: string, index: number }} ScanHit
 *
 * @typedef {{ node: Inline, rest: string }} InlineResult
 *
 * @typedef {{ node: Block, rest: string }} BlockResult
 */

/// HTML Entities (most of them anyway)

/** @param {string} s */
function decodeEntities(s) {
	return s
		.replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
		.replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&apos;/g, "'")
		.replace(/&amp;/g, '&'); // last — prevents double-decode
}

/// Scanner

/**
 * Find the earliest occurrence of any of the given markers.
 * @param {string} text
 * @param {string[]} markers
 * @returns {ScanHit | null}
 */
function scan(text, markers) {
	/** @type {ScanHit | null} */
	let best = null;
	for (const marker of markers) {
		const i = text.indexOf(marker);
		if (i !== -1 && (best === null || i < best.index)) {
			best = { marker, index: i };
		}
	}
	return best;
}

/// Inline elements
/// plain text, <a>, <i>
/// <i> elements can contain plain text and <a>

/**
 * @param {string} html
 * @returns {Inline[]}
 */
function parseInlines(html) {
	/** @type {Inline[]} */
	const nodes = [];
	let rest = html;

	while (rest) {
		const hit = scan(rest, ['<a ', '<i>']);

		if (!hit) {
			addText(nodes, rest);
			break;
		}

		if (hit.index > 0) addText(nodes, rest.slice(0, hit.index));

		if (hit.marker === '<a ') {
			const result = consumeLink(rest, hit.index);
			nodes.push(result.node);
			rest = result.rest;
		} else {
			const result = consumeItalic(rest, hit.index);
			nodes.push(result.node);
			rest = result.rest;
		}
	}

	return nodes;
}

/**
 * @param {string} text
 * @param {number} openIdx
 * @returns {InlineResult}
 */
function consumeLink(text, openIdx) {
	const closeIdx = text.indexOf('</a>', openIdx);
	if (closeIdx === -1) {
		return { node: { type: 'text', text: decodeEntities(text.slice(openIdx)) }, rest: '' };
	}

	const hrefStart = text.indexOf('"', openIdx) + 1;
	const hrefEnd = text.indexOf('"', hrefStart);
	const bodyStart = text.indexOf('>', hrefEnd) + 1;

	return {
		node: {
			type: 'link',
			href: decodeEntities(text.slice(hrefStart, hrefEnd)),
			text: decodeEntities(text.slice(bodyStart, closeIdx))
		},
		rest: text.slice(closeIdx + 4)
	};
}

/**
 * @param {string} text
 * @param {number} openIdx
 * @returns {InlineResult}
 */
function consumeItalic(text, openIdx) {
	const closeIdx = text.indexOf('</i>', openIdx);
	if (closeIdx === -1) {
		return { node: { type: 'text', text: decodeEntities(text.slice(openIdx + 3)) }, rest: '' };
	}

	return {
		node: { type: 'italic', children: parseInlines(text.slice(openIdx + 3, closeIdx)) },
		rest: text.slice(closeIdx + 4)
	};
}

/**
 * @param {Inline[]} nodes
 * @param {string} raw
 */
function addText(nodes, raw) {
	const text = decodeEntities(raw);
	if (text) nodes.push({ type: 'text', text });
}

/// Block elements
/// <p> or <pre><code> (never separated)

/**
 * Parse HN comment HTML into structured blocks.
 * @param {string} html
 * @returns {Block[]}
 */
export function parse(html) {
	/** @type {Block[]} */
	const blocks = [];
	let rest = html;

	while (rest) {
		const hit = scan(rest, ['<p>', '<pre><code>']);

		if (!hit) {
			pushParagraph(blocks, rest);
			break;
		}

		if (hit.index > 0) pushParagraph(blocks, rest.slice(0, hit.index));

		if (hit.marker === '<pre><code>') {
			const result = consumeCode(rest, hit.index);
			blocks.push(result.node);
			rest = result.rest;
		} else {
			rest = rest.slice(hit.index + 3);
		}
	}

	return blocks;
}

/**
 * @param {string} text
 * @param {number} openIdx
 * @returns {BlockResult}
 */
function consumeCode(text, openIdx) {
	const closeIdx = text.indexOf('</code></pre>', openIdx);
	if (closeIdx === -1) {
		return { node: { type: 'code', text: decodeEntities(text.slice(openIdx + 11)) }, rest: '' };
	}

	return {
		node: { type: 'code', text: decodeEntities(text.slice(openIdx + 11, closeIdx)) },
		rest: text.slice(closeIdx + 13)
	};
}

/**
 * @param {Block[]} blocks
 * @param {string} raw
 */
function pushParagraph(blocks, raw) {
	const children = parseInlines(raw);
	if (children.length) blocks.push({ type: 'paragraph', children });
}
