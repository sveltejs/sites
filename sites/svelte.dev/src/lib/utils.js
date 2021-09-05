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

export function download_blob(blob, filename) {
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	link.style.display = 'none';
	document.body.appendChild(link);
	link.click();
	URL.revokeObjectURL(url);
	link.remove();
}

export function key_event(code) {
	return function(node, callback) {
		node.addEventListener('keydown', handleKeydown);

		function handleKeydown(event) {
			if (event.keyCode === code) {
				callback.call(this, event);
			}
		}

		return {
			destroy() {
				node.removeEventListener('keydown', handleKeydown);
			}
		};
	};
}

export const enter_key = key_event(13);

export const is_mac = typeof navigator !== 'undefined' && navigator.platform === 'MacIntel';
