<script lang="ts">
	import SubsetHTML from '#lib/SubsetHTML.svelte';
	import CommentElement from './Comment.svelte';
	import { resolve } from '$app/paths';
	import { timeAgo } from '#lib/utils.js';

	type Props = { comment: AlgoliaComment; now: number };
	const { comment, now }: Props = $props();
</script>

{#if typeof comment !== null}
	<article id={`${comment.id}`} class="comment">
		<details open>
			<summary>
				<div class="meta-bar" role="button" tabindex="0">
					<span class="meta">
						<a href={resolve('/user/[name]', { name: comment.author })}>{comment.author}</a>
						{timeAgo(now - comment.created_at_i)}
					</span>
				</div>
			</summary>

			<div class="body">
				<SubsetHTML content={comment.text} />
			</div>

			{#if comment.children && comment.children.length > 0}
				<ul class="children">
					{#each comment.children as child (child.id)}
						<li>
							<CommentElement comment={child} {now} />
						</li>
					{/each}
				</ul>
			{/if}
		</details>
	</article>
{/if}

<style>
	.comment {
		border-top: 1px solid rgba(0, 0, 0, 0.1);
	}

	:global(html.dark) .comment {
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.meta-bar {
		padding: 1em 0;
		cursor: pointer;
		background: 100% 50% no-repeat url(./unfold.svg);
		background-size: 1em 1em;
	}

	.comment details[open] > summary > .meta-bar {
		background-image: url(./fold.svg);
	}

	.comment details > summary {
		list-style-type: none;
	}

	.comment details > summary::marker,
	.comment details > summary::-webkit-details-marker {
		display: none;
	}

	.comment .children {
		padding: 0 0 0 1em;
		margin: 0;
	}

	@media (min-width: 720px) {
		.comment .children {
			padding: 0 0 0 2em;
		}
	}

	li {
		list-style: none;
	}

	.meta {
		display: block;
		font-size: 14px;
		color: var(--fg-light);
	}

	a {
		color: var(--fg-light);
	}

	/* prevent crazy overflow layout bug on mobile */
	.body :global(*) {
		overflow-wrap: break-word;
	}

	.comment :global(pre) {
		overflow-x: auto;
	}
</style>
