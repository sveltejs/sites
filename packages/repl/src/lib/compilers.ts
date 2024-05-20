// type CssHashGetter = (args: {
// 	name: string;
// 	filename: string | undefined;
// 	css: string;
// 	hash: (input: string) => string;
// }) => string;

// type V3_ModuleFormat = 'esm' | 'cjs';

export type Compilers = {
	V3: {
		// format?: V3_ModuleFormat;
		name?: string;
		filename?: string;
		generate?: 'dom' | 'ssr' | false;
		// errorMode?: 'throw' | 'warn';
		// varsReport?: 'full' | 'strict' | false;
		// sourcemap?: object | string;
		// enableSourcemap?: EnableSourcemap;
		// outputFilename?: string;
		// cssOutputFilename?: string;
		// sveltePath?: string;
		dev?: boolean;
		accessors?: boolean;
		immutable?: boolean;
		hydratable?: boolean;
		legacy?: boolean;
		customElement?: boolean;
		// tag?: string;
		css?: 'injected' | 'external' | 'none' | boolean;
		// loopGuardTimeout?: number;
		// namespace?: string;
		// cssHash?: CssHashGetter;
		// preserveComments?: boolean;
		// preserveWhitespace?: boolean;
	};
	V4: {
		name?: string;
		filename?: string;
		generate?: 'dom' | 'ssr' | false;
		// errorMode?: 'throw' | 'warn';
		// varsReport?: 'full' | 'strict' | false;
		// sourcemap?: object | string;
		// enableSourcemap?: EnableSourcemap;
		// outputFilename?: string;
		// cssOutputFilename?: string;
		// sveltePath?: string;
		dev?: boolean;
		accessors?: boolean;
		immutable?: boolean;
		hydratable?: boolean;
		legacy?: boolean;
		customElement?: boolean;
		// tag?: string;
		css?: 'injected' | 'external' | 'none' | boolean;
		// loopGuardTimeout?: number;
		// namespace?: string;
		// cssHash?: CssHashGetter;
		// preserveComments?: boolean;
		// preserveWhitespace?: boolean;
		// discloseVersion?: boolean;
	};
	V5: {
		name?: string;
		customElement?: boolean;
		accessors?: boolean;
		// namespace?: Namespace;
		immutable?: boolean;
		css?: 'injected' | 'external';
		// cssHash?: CssHashGetter;
		// preserveComments?: boolean;
		// preserveWhitespace?: boolean;
		runes?: boolean | undefined;
		// discloseVersion?: boolean;
		// legacy?: {
		// 	componentApi?: boolean;
		// };
		// sourcemap?: object | string;
		// outputFilename?: string;
		// cssOutputFilename?: string;
		// hmr?: boolean;
		modernAst?: boolean;
	};
};
