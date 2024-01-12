<script lang="ts">
	import type { PageData } from './$types.js';
	export let data: PageData;
</script>

<svelte:head>
	<title>{data.post.title}</title>
</svelte:head>

<div class="prose">
	<article class="post">
		<header class="border-b-accent border-b-2">
			<h1 class="mb-0">{data.post.title}</h1>
			<p class="date">
				{data.post.date_formatted}
			</p>
		</header>
		{@html data.post.content}
	</article>
</div>

<style>
	:global(.prose > .post blockquote > p::before) {
		content: '';
	}
	.date {
		margin-block: 0rem;
		font-size: 0.75rem;
	}
</style>