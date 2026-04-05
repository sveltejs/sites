<script>
	import SubsetHTML from '$lib/SubsetHTML.svelte';
	import CommentElement from './Comment.svelte';
	import { resolve } from '$app/paths';
	import { timeAgo } from '$lib/utils';

	/** @type {{ comment: HNComment }} */
	const { comment } = $props();
</script>

{#if !comment.deleted}
	<article class="comment">
		<details open>
			<summary>
				<div class="meta-bar" role="button" tabindex="0">
					<span class="meta">
						<a href={resolve('/user/[name]', { name: comment.by })}>{comment.by}</a>
						{timeAgo(comment.time)}
					</span>
				</div>
			</summary>

			<div class="body">
				<SubsetHTML content={comment.text} />
			</div>

			{#if comment.kids && comment.kids.length > 0}
				<ul class="children">
					{#each comment.kids as childId (childId)}
						<li>
							{#await fetch(`https://hacker-news.firebaseio.com/v0/item/${childId}.json`).then((res) => /** @type {Promise<HNComment>} */ (res.json())) then comment}
								<CommentElement {comment} />
							{/await}
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
