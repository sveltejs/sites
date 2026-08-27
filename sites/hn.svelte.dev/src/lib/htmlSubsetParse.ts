/// Types used by the parser

export type Inline =
	| { type: 'text'; text: string }
	| { type: 'link'; href: string; text: string }
	| { type: 'italic'; children: Inline[] };
type Block = { type: 'paragraph'; children: Inline[] } | { type: 'code'; text: string };
type ScanHit = { marker: string; index: number };
type InlineResult = { node: Inline; rest: string };
type BlockResult = { node: Block; rest: string };

/// HTML Entities (most of them anyway)

function decodeEntities(s: string) {
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

function scan(text: string, markers: string[]): ScanHit | null {
	let best: ScanHit | null = null;
	for (const marker of markers) {
		const i = text.indexOf(marker);
		if (i !== -1 && (best === null || i < best.index)) {
			best = { marker, index: i };
		}
	}
	return best;
}

const OPEN_ITALIC = '<i>';
const CLOSE_ITALIC = '</i>';
const OPEN_CODE = '<pre><code>';
const CLOSE_CODE = '</code></pre>';
const OPEN_ANCHOR = '<a ';
const CLOSE_ANCHOR = '</a>';
const PARAGRAPH_BREAK = '<p>';

/// Inline elements
/// plain text, <a>, <i>
/// <i> elements can contain plain text and <a>

function parseInlines(html: string): Inline[] {
	const nodes: Inline[] = [];
	let rest = html;

	while (rest) {
		const hit = scan(rest, [OPEN_ANCHOR, OPEN_ITALIC]);

		if (!hit) {
			addText(nodes, rest);
			break;
		}

		if (hit.index > 0) addText(nodes, rest.slice(0, hit.index));

		if (hit.marker === OPEN_ANCHOR) {
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

function consumeLink(text: string, openIdx: number): InlineResult {
	const closeIdx = text.indexOf(CLOSE_ANCHOR, openIdx);
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
		rest: text.slice(closeIdx + CLOSE_ANCHOR.length)
	};
}

function consumeItalic(text: string, openIdx: number): InlineResult {
	const closeIdx = text.indexOf(CLOSE_ITALIC, openIdx);
	if (closeIdx === -1) {
		return {
			node: { type: 'text', text: decodeEntities(text.slice(openIdx + OPEN_ITALIC.length)) },
			rest: ''
		};
	}

	return {
		node: {
			type: 'italic',
			children: parseInlines(text.slice(openIdx + OPEN_ITALIC.length, closeIdx))
		},
		rest: text.slice(closeIdx + CLOSE_ITALIC.length)
	};
}

function addText(nodes: Inline[], raw: string): void {
	const text = decodeEntities(raw);
	if (text) nodes.push({ type: 'text', text });
}

/// Block elements
/// <p> or <pre><code> (never separated)

/**
 * Parse HN comment HTML into structured blocks.
 */
export function parse(html: string): Block[] {
	const blocks: Block[] = [];
	let rest = html;

	while (rest) {
		const hit = scan(rest, [PARAGRAPH_BREAK, OPEN_CODE]);

		if (!hit) {
			pushParagraph(blocks, rest);
			break;
		}

		if (hit.index > 0) pushParagraph(blocks, rest.slice(0, hit.index));

		if (hit.marker === OPEN_CODE) {
			const result = consumeCode(rest, hit.index);
			blocks.push(result.node);
			rest = result.rest;
		} else {
			rest = rest.slice(hit.index + PARAGRAPH_BREAK.length);
		}
	}

	return blocks;
}

function consumeCode(text: string, openIdx: number): BlockResult {
	const closeIdx = text.indexOf(CLOSE_CODE, openIdx);
	if (closeIdx === -1) {
		return {
			node: { type: 'code', text: decodeEntities(text.slice(openIdx + OPEN_CODE.length)) },
			rest: ''
		};
	}

	return {
		node: {
			type: 'code',
			text: decodeEntities(text.slice(openIdx + OPEN_CODE.length, closeIdx))
		},
		rest: text.slice(closeIdx + CLOSE_CODE.length)
	};
}

function pushParagraph(blocks: Block[], raw: string): void {
	const children = parseInlines(raw);
	if (children.length) blocks.push({ type: 'paragraph', children });
}
