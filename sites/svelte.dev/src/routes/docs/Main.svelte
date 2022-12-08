<script>
	import { getFragment, onNavigate } from '@sveltejs/site-kit/utils/navigation';

	export let path;

	let container;

	onNavigate(() => {
		// don't update `selected` for headings above level 4, see _sections.js
		const headings = container.querySelectorAll('[id]:not([data-scrollignore])');

		for (const heading of headings) {
			if (heading.nodeName.startsWith('H') && !heading.querySelector('a.anchor')) {
				const a = document.createElement('a');
				a.className = 'anchor';
				a.href = `${window.location.pathname}#${heading.id}`;
				const span = document.createElement('span');
				span.className = 'visually-hidden';
				span.innerHTML = 'permalink';
				a.appendChild(span);
				heading.appendChild(a);
			}
		}

		let positions;

		const onresize = () => {
			const { top } = container.getBoundingClientRect();
			positions = [].map.call(headings, (heading) => {
				return heading.getBoundingClientRect().top - top;
			});
		};

		let last_id = getFragment();

		const onscroll = () => {
			const { top } = container.getBoundingClientRect();

			let i = headings.length;
			while (i--) {
				if (positions[i] + top < 150) {
					const heading = headings[i];
					const { id } = heading;

					if (id !== last_id) {
						path = `${window.location.pathname}#${id}`;
						last_id = id;
					}

					return;
				}
			}

			path = window.location.pathname;
		};

		window.addEventListener('scroll', onscroll, true);
		window.addEventListener('resize', onresize, true);

		// wait for fonts to load...
		const timeouts = [setTimeout(onresize, 1000), setTimeout(onscroll, 5000)];

		onresize();
		onscroll();

		return () => {
			window.removeEventListener('scroll', onscroll, true);
			window.removeEventListener('resize', onresize, true);

			timeouts.forEach((timeout) => clearTimeout(timeout));
		};
	});
</script>

<div bind:this={container} class="content listify text">
	<slot />
</div>

<style>
	/* copied from text.css in site-kit and adjusted to the class in the docs */
	.text :global(.anchor) {
		position: absolute !important;
		display: block;
		background: url(@sveltejs/site-kit/icons/link.svg) 0 50% no-repeat;
		background-size: 1em 1em;
		width: 1.4em;
		height: 1em;
		left: -1.3em;
		opacity: 0;
		transition: opacity 0.2s;
		bottom: 0.25em;
	}

	@media (min-width: 768px) {
		.text :global(a.anchor:focus),
		.text :global(h2:hover a.anchor),
		.text :global(h3:hover a.anchor),
		.text :global(h4:hover a.anchor),
		.text :global(h5:hover a.anchor),
		.text :global(h6:hover a.anchor) {
			opacity: 1;
		}
	}

	@media (max-width: 768px) {
		.text :global(a.anchor) {
			transform: scale(0.6);
			opacity: 1;
			left: -1em;
		}
	}

	.content {
		width: 100%;
		margin: 0;
		padding: var(--top-offset) var(--side-nav);
		tab-size: 2;
		-moz-tab-size: 2;
	}

	@media (min-width: 832px) {
		/* can't use vars in @media :( */
		.content {
			padding-left: calc(var(--sidebar-w) + var(--side-nav));
		}
	}
</style>
