<script>
	import { page } from '$app/stores';
	import { getFragment, onNavigate } from '../utils/navigation';
	import '../code.css';

	export let path;

	let container;

	onNavigate(() => {
		// don't update `selected` for headings above level 4, see _sections.js
		const headings = container.querySelectorAll('[id]:not([data-scrollignore])');

		for (const heading of headings) {
			if (heading.nodeName.startsWith('H') && !heading.querySelector('a.anchor')) {
				const a = document.createElement('a');
				a.className = 'anchor';
				a.href = `${$page.url.pathname}#${heading.id}`;
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
				if (positions[i] + top < 40) {
					const heading = headings[i];
					const { id } = heading;

					if (id !== last_id) {
						path = `${$page.url.pathname}#${id}`;
						last_id = id;
					}

					return;
				}
			}

			path = $page.url.pathname;
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

<div bind:this={container} class="content listify">
	<slot />
</div>

<style>
	.content {
		inline-size: 100%;
		margin: 0;
		padding-inline: var(--side-nav);
		padding-block: var(--top-offset);
		tab-size: 2;
		-moz-tab-size: 2;
	}

	@media (min-width: 832px) {
		/* can't use vars in @media :( */
		.content {
			padding-inline-start: calc(var(--sidebar-w) + var(--side-nav));
		}
	}

	.content :global(h1) {
		font-size: 3.2rem;
		margin-block-end: 0.5em;
	}

	.content :global(h2) {
		margin-block-start: 8rem;
		padding-inline: 0.2rem 1.6rem;
		padding-block: 2rem 4rem;
		border-block-start: 2px solid #ddd;
		line-height: 1;
		font-size: var(--h3);
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.content :global(section):first-of-type > :global(h2) {
		margin-block-start: 0;
	}

	.content :global(h4) {
		margin-block: 2em 1em;
	}

	.content :global(.offset-anchor) {
		position: relative;
		display: block;
		inset-block-start: calc(-1 * var(--top-offset));
		inline-size: 0;
		block-size: 0;
	}

	.content :global(.anchor) {
		position: absolute;
		display: block;
		background: url(../icons/link.svg) 0 50% no-repeat;
		background-size: 1em 1em;
		inline-size: 1.4em;
		block-size: 1em;
		inset-inline-start: -1.3em;
		inset-block-end: 0.3rem;
		opacity: 0;
		transition: opacity 0.2s;
	}

	.content :global(h2) :global(.anchor) {
		inset-block-end: 4rem;
	}

	.content :global(h3) :global(.anchor) {
		inset-block-end: 1rem;
	}

	@media (min-width: 400px) {
		.content :global(h1) {
			font-size: 4.2rem;
		}
	}

	@media (min-width: 768px) {
		.content :global(h1) {
			font-size: 5.4rem;
		}

		.content :global(.anchor:focus),
		.content :global(h2):hover :global(.anchor),
		.content :global(h3):hover :global(.anchor),
		.content :global(h4):hover :global(.anchor),
		.content :global(h5):hover :global(.anchor),
		.content :global(h6):hover :global(.anchor) {
			opacity: 1;
		}
	}

	.content :global(h3),
	.content :global(h3 > code) {
		margin-inline: 0;
		margin-block: 6.4rem 1rem;
		padding-block-end: 1rem;
		color: var(--text);
		max-inline-size: var(--linemax);
		border-block-end: 1px solid #ddd;
		background: transparent;
		line-height: 1;
	}

	.content :global(h3):first-child {
		border: none;
		margin: 0;
	}

	/* avoid doubled border-top */
	.content :global(h3 > code) {
		border-radius: 0 0 0 0;
		border: none;
		font-size: inherit;
	}

	.content :global(h4),
	.content :global(h4 > code) {
		font-family: inherit;
		font-weight: 600;
		font-size: 2.4rem;
		color: var(--second);
		margin-inline: 0;
		margin-block: 6.4rem 1.6rem;
		padding-inline-start: 0;
		background: transparent;
		line-height: 1;
		padding-block-start: 0;
		inset-block-start: 0;
	}

	.content :global(h4::before) {
		display: block;
		content: ' ';
		block-size: var(--nav-h);
		margin-block-start: calc(-1 * var(--nav-h));
	}

	.content :global(h4 > em) {
		opacity: 0.7;
	}

	.content :global(h5) {
		font-size: 2.4rem;
		margin-block: 2em 0.5em;
	}

	.content :global(code) {
		padding: 0.4rem;
		margin-inline: 0.2rem;
		margin-block: 0;
		inset-block-start: -0.1rem;
		background: var(--back-api);
	}

	.content :global(pre) :global(code) {
		padding: 0;
		margin: 0;
		inset-block-start: 0;
		background: transparent;
	}

	.content :global(pre) {
		margin: 0;
		margin-block-end: 2rem;
		inline-size: 100%;
		max-inline-size: var(--linemax);
		padding: 1rem;
		box-shadow: inset 1px 1px 6px hsla(205.7, 63.6%, 30.8%, 0.06);
	}

	.content :global(.icon) {
		inline-size: 2rem;
		block-size: 2rem;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
		fill: none;
	}

	.content :global(table) {
		margin: 0;
		margin-block-end: 2em;
	}

	.content :global(section) :global(p) {
		max-inline-size: var(--linemax);
		margin-block: 1em;
	}

	.content :global(small) {
		font-size: var(--h5);
		float: inline-end;
		pointer-events: all;
		color: var(--prime);
		cursor: pointer;
	}

	.content :global(blockquote) {
		color: rgba(0, 0, 0, 0.7);
		background-color: rgba(255, 62, 0, 0.1);
		border-inline-start: 4px solid #ff3e00;
		padding: 1rem;
	}

	.content :global(blockquote) :global(:first-child) {
		margin-block-start: 0;
	}

	.content :global(blockquote) :global(:last-child) {
		margin-block-end: 0;
	}

	.content :global(blockquote) :global(code) {
		background: #d5e2ea;
	}

	.content :global(section) :global(a):hover {
		text-decoration: underline;
	}

	.content :global(section) :global(a) :global(code) {
		color: inherit;
		background: rgba(255, 62, 0, 0.1) !important;
	}

	/* this replaces the offset-anchor hack, which we should remove from this CSS
	   once https://github.com/sveltejs/action-deploy-docs/issues/1 is closed */
	.content :global(h2[id]),
	.content :global(h3[id]) {
		padding-block-start: 10rem;
		margin-block-start: -2rem;
		border-block-start: none;
	}

	.content :global(h2[id])::after {
		content: '';
		position: absolute;
		inline-size: 100%;
		inset-inline-start: 0;
		inset-block-start: 8rem;
		block-size: 2px;
		background: #ddd;
	}
</style>
