export function process_example(files) {
	return files
		.map(file => {
			const [name, type] = file.name.split('.');
			return { name, type, source: file.content };
		})
		.sort((a, b) => {
			if (a.name === 'App.svelte' && a.type === 'svelte') return -1;
			if (b.name === 'App.svelte' && b.type === 'svelte') return 1;

			if (a.type === b.type) return a.name < b.name ? -1 : 1;

			if (a.type === 'svelte') return -1;
			if (b.type === 'svelte') return 1;
		});
}
