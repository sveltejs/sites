const c = [
	() => import("../../../src/routes/$layout.svelte"),
	() => import("../../../src/routes/$error.svelte"),
	() => import("../../../src/routes/index.svelte"),
	() => import("../../../src/routes/migrating/index.svelte"),
	() => import("../../../src/routes/docs/index.svelte"),
	() => import("../../../src/routes/faq/index.svelte")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/index.svelte
	[/^\/$/, [c[0], c[2]], [c[1]]],

	// src/routes/migrating/index.svelte
	[/^\/migrating\/?$/, [c[0], c[3]], [c[1]]],

	// src/routes/docs/index.svelte
	[/^\/docs\/?$/, [c[0], c[4]], [c[1]]],

	// src/routes/faq/index.svelte
	[/^\/faq\/?$/, [c[0], c[5]], [c[1]]]
];

export const fallback = [c[0](), c[1]()];