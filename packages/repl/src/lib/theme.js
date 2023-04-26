import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { tags as t } from '@lezer/highlight';

export const svelteTheme = EditorView.theme(
	{
		'&': {
			color: 'var(--sk-code-base)',
			backgroundColor: 'transparent',
		},

		'.cm-content': {
			caretColor: 'var(--sk-theme-3)',
		},

		'.cm-cursor, .cm-dropCursor': { borderLeftColor: 'var(--sk-theme-3)' },
		'&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
			{ backgroundColor: 'var(--sk-selection-color)' },

		'.cm-panels': { backgroundColor: 'var(--sk-back-2)', color: 'var(--sk-text-2)' },
		'.cm-panels.cm-panels-top': { borderBottom: '2px solid black' },
		'.cm-panels.cm-panels-bottom': { borderTop: '2px solid black' },

		'.cm-searchMatch': {
			backgroundColor: 'var(--sk-theme-2)',
			// outline: '1px solid #457dff',
		},
		'.cm-searchMatch.cm-searchMatch-selected': {
			backgroundColor: '#6199ff2f',
		},

		'.cm-activeLine': { backgroundColor: '#6699ff0b' },
		'.cm-selectionMatch': { backgroundColor: '#aafe661a' },

		'&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
			backgroundColor: '#bad0f847',
		},

		'.cm-gutters': {
			backgroundColor: 'var(--sk-back-3)',
			border: 'none',
		},

		'.cm-activeLineGutter': {
			backgroundColor: 'var(--sk-back-4)',
		},

		'.cm-foldPlaceholder': {
			backgroundColor: 'transparent',
			border: 'none',
			color: '#ddd',
		},

		'.cm-tooltip': {
			border: 'none',
			backgroundColor: 'var(--sk-back-3)',
		},
		'.cm-tooltip .cm-tooltip-arrow:before': {
			borderTopColor: 'transparent',
			borderBottomColor: 'transparent',
		},
		'.cm-tooltip .cm-tooltip-arrow:after': {
			borderTopColor: 'var(--sk-back-3)',
			borderBottomColor: 'var(--sk-back-3)',
		},
		'.cm-tooltip-autocomplete': {
			color: 'var(--sk-text-2) !important',
			'& > ul > li[aria-selected]': {
				backgroundColor: 'var(--sk-back-4)',
				color: 'var(--sk-text-1) !important',
			},
		},
	},
	{ dark: true }
);

/// The highlighting style for code in the One Dark theme.
export const svelteHighlightStyle = HighlightStyle.define([
	{ tag: t.keyword, color: 'var(--sk-code-keyword)' },
	{
		tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
		color: 'var(--sk-code-base)',
	},
	{ tag: [t.function(t.variableName), t.labelName], color: 'var(--sk-code-tags)' },
	{ tag: [t.color, t.constant(t.name), t.standard(t.name)], color: 'var(--sk-code-base)' },
	{ tag: [t.definition(t.name), t.separator], color: 'var(--sk-code-base)' },
	{
		tag: [
			t.typeName,
			t.className,
			t.number,
			t.changed,
			t.annotation,
			t.modifier,
			t.self,
			t.namespace,
		],
		color: 'var(--sk-code-keyword)',
	},
	{
		tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)],
		color: 'var(--sk-code-base)',
	},
	{ tag: [t.meta, t.comment], color: 'var(--sk-code-comment)' },
	{ tag: t.strong, fontWeight: 'bold' },
	{ tag: t.emphasis, fontStyle: 'italic' },
	{ tag: t.strikethrough, textDecoration: 'line-through' },
	{ tag: t.link, color: 'var(--sk-code-base)', textDecoration: 'underline' },
	{ tag: t.heading, fontWeight: 'bold', color: 'var(--sk-text-1)' },
	{ tag: [t.atom, t.bool], color: 'var(--sk-code-atom)' },
	{ tag: [t.processingInstruction, t.string, t.inserted], color: 'var(--sk-code-string)' },
	{ tag: t.invalid, color: '#ff008c' },
]);

/// Extension to enable the One Dark theme (both the editor theme and
/// the highlight style).
export const svelte = [svelteTheme, syntaxHighlighting(svelteHighlightStyle)];
