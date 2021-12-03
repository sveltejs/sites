import * as uvu from 'uvu';
import * as assert from 'uvu/assert';
import {urlsafeSlugProcessor, unicodeSafeProcessor} from '../../src/utils/slug.js';
import {SLUG_SEPARATOR as _} from '../../config.js';

function run(name, func) {
	const suite = uvu.suite(name);
	func(suite);
	suite.run();
}

run('urlsafeSlugProcessor -> ascii', it => {
	it('space separated words', () => {
		assert.equal(
			urlsafeSlugProcessor('Text expressions'),
			`Text${_}expressions`
		);
	});
	it('numbered text', () => {
		assert.equal(
			urlsafeSlugProcessor('1. export creates'),
			`1${_}export${_}creates`
		);
	});
	it('punctuated text', () => {
		assert.equal(
			urlsafeSlugProcessor('svelte.VERSION'),
			`svelte${_}VERSION`
		);
	});
	it('text starting with the dollar sign', () => {
		assert.equal(
			urlsafeSlugProcessor('$destroy method'),
			`$destroy${_}method`
		);
	});
	it('numbered text containing the dollar sign', () => {
		assert.equal(
			urlsafeSlugProcessor('1. export $destroy'),
			`1${_}export${_}$destroy`
		);
	});
	it('text containing the equal char', () => {
		assert.equal(
			urlsafeSlugProcessor('script context=module'),
			`script${_}context${_}module`
		);
	});
	it('text containing the colon char', () => {
		assert.equal(
			urlsafeSlugProcessor('svelte:body'),
			`svelte${_}body`
		);
	});
	it('text containing the slash char', () => {
		assert.equal(
			urlsafeSlugProcessor('svelte/motion'),
			`svelte${_}motion`
		);
	});
	it('text containing the comma char', () => {
		assert.equal(
			urlsafeSlugProcessor('svelte, motion'),
			`svelte${_}motion`
		);
	});
});

run('urlsafeSlugProcessor - unicode', it => {
	it('should translate symbols to English', () => {
		assert.equal(
			urlsafeSlugProcessor('Ich ♥ Deutsch'),
			`Ich${_}love${_}Deutsch`
		);
	});
	it('should remove emoji', () => {
		assert.equal(
			urlsafeSlugProcessor('Ich 😍 Deutsch'),
			`Ich${_}Deutsch`
		);
	});
});

run('urlsafeSlugProcessor -> cyrillic', it => {
	it('space separated words', () => {
		assert.equal(
			urlsafeSlugProcessor('Всплытие и перехват событий'),
			`Vsplytie${_}i${_}perehvat${_}sobytij`
		);
	});
	it('numbered text', () => {
		assert.equal(
			urlsafeSlugProcessor('1 Всплытие и перехват событий'),
			`1${_}Vsplytie${_}i${_}perehvat${_}sobytij`
		);
	});
	it('punctuated text', () => {
		assert.equal(
			urlsafeSlugProcessor('.Всплытие.и.перехват событий'),
			`Vsplytie${_}i${_}perehvat${_}sobytij`
		);
	});
	it('text starting with the dollar sign', () => {
		assert.equal(
			urlsafeSlugProcessor('$Всплытие $ перехват событий'),
			`$Vsplytie${_}$${_}perehvat${_}sobytij`
		);
	});
	it('text containing the dollar sign', () => {
		assert.equal(
			urlsafeSlugProcessor('Всплытие$перехват'),
			`Vsplytie$perehvat`
		);
	});
	it('text containing the equal char', () => {
		assert.equal(
			urlsafeSlugProcessor('Всплытие = перехват=событий'),
			`Vsplytie${_}perehvat${_}sobytij`
		);
	});
	it('text containing the colon char', () => {
		assert.equal(
			urlsafeSlugProcessor('Всплытие : перехват:событий'),
			`Vsplytie${_}perehvat${_}sobytij`
		);
	});
	it('text containing the slash char', () => {
		assert.equal(
			urlsafeSlugProcessor('Всплытие / перехват/событий'),
			`Vsplytie${_}perehvat${_}sobytij`
		);
	});
	it('text containing the comma char', () => {
		assert.equal(
			urlsafeSlugProcessor('Всплытие, перехват'),
			`Vsplytie${_}perehvat`
		);
	});
});

run('urlsafeSlugProcessor -> ascii + cyrillic', it => {
	it('space separated words', () => {
		assert.equal(
			urlsafeSlugProcessor('Всплытие и export перехват событий'),
			`Vsplytie${_}i${_}export${_}perehvat${_}sobytij`
		);
	});
	it('ascii word concatenated to a cyrillic word', () => {
		assert.equal(
			urlsafeSlugProcessor('exportВсплытие'),
			'exportVsplytie'
		);
	});
	it('cyrillic word concatenated to an ascii word', () => {
		assert.equal(
			urlsafeSlugProcessor('Всплытиеexport'),
			`Vsplytieexport`
		);
	});
	it('numbered text', () => {
		assert.equal(
			urlsafeSlugProcessor('1 export Всплытие и перехват событий'),
			`1${_}export${_}Vsplytie${_}i${_}perehvat${_}sobytij`
		);
	});
	it('punctuated text', () => {
		assert.equal(
			urlsafeSlugProcessor('.Всплытие.export.и.перехват событий'),
			`Vsplytie${_}export${_}i${_}perehvat${_}sobytij`
		);
	});
	it('text starting with the dollar sign, followed by ascii char', () => {
		assert.equal(
			urlsafeSlugProcessor('$exportВсплытие перехват событий'),
			`$exportVsplytie${_}perehvat${_}sobytij`
		);
	});
	it('text starting with the dollar sign, followed by unicode char', () => {
		assert.equal(
			urlsafeSlugProcessor('$Всплытие export перехват событий'),
			`$Vsplytie${_}export${_}perehvat${_}sobytij`
		);
	});
	it('text containing the dollar sign, followed by ascii char', () => {
		assert.equal(
			urlsafeSlugProcessor('export $destroy a component prop Всплытие и перехват событий'),
			`export${_}$destroy${_}a${_}component${_}prop${_}Vsplytie${_}i${_}perehvat${_}sobytij`
		);
	});
	it('text containing the dollar sign, followed by unicode char', () => {
		assert.equal(
			urlsafeSlugProcessor('Всплытие export $Всплытие a component prop Всплытие и перехват событий'),
			`Vsplytie${_}export${_}$Vsplytie${_}a${_}component${_}prop${_}Vsplytie${_}i${_}perehvat${_}sobytij`
		);
	});
	it('text containing the equal char', () => {
		assert.equal(
			urlsafeSlugProcessor('script context=module Всплытие=и перехват событий'),
			`script${_}context${_}module${_}Vsplytie${_}i${_}perehvat${_}sobytij`
		);
	});
	it('text containing the colon char', () => {
		assert.equal(
			urlsafeSlugProcessor('svelte:body Всплытие и:перехват событий'),
			`svelte${_}body${_}Vsplytie${_}i${_}perehvat${_}sobytij`
		);
	});
	it('text containing the slash char', () => {
		assert.equal(
			urlsafeSlugProcessor('svelte/motion Всплытие и / перехват/событий'),
			`svelte${_}motion${_}Vsplytie${_}i${_}perehvat${_}sobytij`
		);
	});
	it('text containing the comma char', () => {
		assert.equal(
			urlsafeSlugProcessor('Всплытие, export'),
			`Vsplytie${_}export`
		);
	});
});

run('unicodeSafeProcessor (preserve unicode) -> ascii', it => {
	it('space separated words', () => {
		assert.equal(
			unicodeSafeProcessor('Text expressions'),
			`Text${_}expressions`
		);
	});
	it('numbered text', () => {
		assert.equal(
			unicodeSafeProcessor('1. export creates'),
			`1${_}export${_}creates`
		);
	});
	it('punctuated text', () => {
		assert.equal(
			unicodeSafeProcessor('svelte.VERSION'),
			`svelte${_}VERSION`
		);
	});
	it('text starting with the dollar sign', () => {
		assert.equal(
			unicodeSafeProcessor('$destroy method'),
			`$destroy${_}method`
		);
	});
	it('numbered text containing the dollar sign', () => {
		assert.equal(
			unicodeSafeProcessor('1. export $destroy'),
			`1${_}export${_}$destroy`
		);
	});
	it('text containing the equal char', () => {
		assert.equal(
			unicodeSafeProcessor('script context=module'),
			`script${_}context${_}module`
		);
	});
	it('text containing the colon char', () => {
		assert.equal(
			unicodeSafeProcessor('svelte:body'),
			`svelte${_}body`
		);
	});
	it('text containing the slash char', () => {
		assert.equal(
			unicodeSafeProcessor('svelte/motion'),
			`svelte${_}motion`
		);
	});
	it('text containing the comma char', () => {
		assert.equal(
			unicodeSafeProcessor('svelte, motion'),
			`svelte${_}motion`
		);
	});
});

run('unicodeSafeProcessor (preserve unicode) -> unicode', it => {
	it('should preserve symbols', () => {
		assert.equal(
			unicodeSafeProcessor('Ich ♥ Deutsch'),
			`Ich${_}love${_}Deutsch`
		);
	});
	it('should remove emoji', () => {
		assert.equal(
			unicodeSafeProcessor('Ich 😍 Deutsch'),
			`Ich${_}Deutsch`
		);
	});
});

run('unicodeSafeProcessor (preserve unicode) -> cyrillic', it => {
	it('space separated words', () => {
		assert.equal(
			unicodeSafeProcessor('Всплытие и перехват событий'),
			`Всплытие${_}и${_}перехват${_}событий`
		);
	});
	it('numbered text', () => {
		assert.equal(
			unicodeSafeProcessor('1 Всплытие и перехват событий'),
			`1${_}Всплытие${_}и${_}перехват${_}событий`
		);
	});
	it('punctuated text', () => {
		assert.equal(
			unicodeSafeProcessor('.Всплытие.и.перехват событий'),
			`Всплытие${_}и${_}перехват${_}событий`
		);
	});
	it('text starting with the dollar sign', () => {
		assert.equal(
			unicodeSafeProcessor('$Всплытие $ перехват событий'),
			`$${_}Всплытие${_}$${_}перехват${_}событий`
		);
	});
	it('text containing the dollar sign', () => {
		assert.equal(
			unicodeSafeProcessor('Всплытие$перехват'),
			`Всплытие${_}$${_}перехват`
		);
	});
	it('text containing the equal char', () => {
		assert.equal(
			unicodeSafeProcessor('Всплытие = перехват=событий'),
			`Всплытие${_}перехват${_}событий`
		);
	});
	it('text containing the colon char', () => {
		assert.equal(
			unicodeSafeProcessor('Всплытие : перехват:событий'),
			`Всплытие${_}перехват${_}событий`
		);
	});
	it('text containing the slash char', () => {
		assert.equal(
			unicodeSafeProcessor('Всплытие / перехват/событий'),
			`Всплытие${_}перехват${_}событий`
		);
	});
	it('text containing the comma char', () => {
		assert.equal(
			unicodeSafeProcessor('Всплытие, перехват'),
			`Всплытие${_}перехват`
		);
	});
});

run('unicodeSafeProcessor (preserve unicode) -> ascii + cyrillic', it => {
	it('space separated words', () => {
		assert.equal(
			unicodeSafeProcessor('Всплытие и export перехват событий'),
			`Всплытие${_}и${_}export${_}перехват${_}событий`
		);
	});
	it('ascii word concatenated to a cyrillic word', () => {
		assert.equal(
			unicodeSafeProcessor('exportВсплытие'),
			`export${_}Всплытие`
		);
	});
	it('cyrillic word concatenated to an ascii word', () => {
		assert.equal(
			unicodeSafeProcessor('Всплытиеexport'),
			`Всплытие${_}export`
		);
	});
	it('numbered text', () => {
		assert.equal(
			unicodeSafeProcessor('1 export Всплытие и перехват событий'),
			`1${_}export${_}Всплытие${_}и${_}перехват${_}событий`
		);
	});
	it('punctuated text', () => {
		assert.equal(
			unicodeSafeProcessor('.Всплытие.export.и.перехват событий'),
			`Всплытие${_}export${_}и${_}перехват${_}событий`
		);
	});
	it('text starting with the dollar sign, followed by ascii char', () => {
		assert.equal(
			unicodeSafeProcessor('$exportВсплытие перехват событий'),
			`$export${_}Всплытие${_}перехват${_}событий`
		);
	});
	it('text starting with the dollar sign, followed by unicode char', () => {
		assert.equal(
			unicodeSafeProcessor('$Всплытие export перехват событий'),
			`$${_}Всплытие${_}export${_}перехват${_}событий`
		);
	});
	it('text containing the dollar sign, followed by ascii char', () => {
		assert.equal(
			unicodeSafeProcessor('export $destroy a component prop Всплытие и перехват событий'),
			`export${_}$destroy${_}a${_}component${_}prop${_}Всплытие${_}и${_}перехват${_}событий`
		);
	});
	it('text containing the dollar sign, followed by unicode char', () => {
		assert.equal(
			unicodeSafeProcessor('Всплытие export $Всплытие a component prop Всплытие и перехват событий'),
			`Всплытие${_}export${_}$${_}Всплытие${_}a${_}component${_}prop${_}Всплытие${_}и${_}перехват${_}событий`
		);
	});
	it('text containing the equal char', () => {
		assert.equal(
			unicodeSafeProcessor('script context=module Всплытие=и перехват событий'),
			`script${_}context${_}module${_}Всплытие${_}и${_}перехват${_}событий`
		);
	});
	it('text containing the colon char', () => {
		assert.equal(
			unicodeSafeProcessor('svelte:body Всплытие и:перехват событий'),
			`svelte${_}body${_}Всплытие${_}и${_}перехват${_}событий`
		);
	});
	it('text containing the slash char', () => {
		assert.equal(
			unicodeSafeProcessor('svelte/motion Всплытие и / перехват/событий'),
			`svelte${_}motion${_}Всплытие${_}и${_}перехват${_}событий`
		);
	});
	it('text containing the comma char', () => {
		assert.equal(
			unicodeSafeProcessor('Всплытие, export'),
			`Всплытие${_}export`
		);
	});
});
