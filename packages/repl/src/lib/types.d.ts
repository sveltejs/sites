import type { EditorState } from '@codemirror/state';
import { OutputChunk } from '@rollup/browser';
import type { Readable, Writable } from 'svelte/store';
import { CompileOptions } from 'svelte/compiler';

export type Lang = 'js' | 'svelte' | 'json' | 'md' | 'css' | (string & Record<never, never>);

type StartOrEnd = {
	line: number;
	column: number;
	character: number;
};

export type MessageDetails = {
	start: StartOrEnd;
	end: StartOrEnd;
	filename: string;
	message: string;
};

export type Warning = MessageDetails;

export type Error = MessageDetails & {
	name: string;
	code: string;
	pos: number;
	frame: string;
	pluginCode: string;
	plugin: string;
	hook: string;
	id: string;
	watchFiles?: string[] | null;
	stack: string;
};

export type Bundle = {
	uid: number;
	dom: OutputChunk | null;
	error: Error | null;
	ssr: OutputChunk | null;
	imports: string[];
	warnings: Warning[];
};

export type File = {
	name: string;
	source: string;
	type: Lang;
	modified?: boolean;
};
