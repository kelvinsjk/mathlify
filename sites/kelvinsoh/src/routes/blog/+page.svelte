<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;

  // taken and modified from
  // https://github.com/sveltejs/svelte/blob/svelte-4/sites/svelte.dev/src/routes/blog/%2Bpage.svelte
  // on 2024-01-11

	//TODO: tags
	//TODO: pagination

	const first_post = data.posts[0];
</script>

<svelte:head>
	<title>Blog</title>
</svelte:head>

<div class="posts stretch prose">
	<h1 class="sr-only">Blog</h1>
	<h2>Latest post</h2>
	<article class="post" data-pubdate={first_post.date}>
		<a class="no-underline" href="/blog/{first_post.slug}" title="Read the article »">
			<h3 class="first-post-title">{first_post.title}</h3>
			<p class="date">{first_post.date_formatted}</p>
			<p>{first_post.description}</p>
		</a>
	</article>
	<div class="divider divider-secondary"></div>
	<h2>Older posts</h2>
	{#each data.posts.slice(1) as post}
		{#if !post.draft}
			<article class="post" data-pubdate={post.date}>
				<a class="no-underline" href="/blog/{post.slug}" title="Read the article »">
					<h3>{post.title}</h3>
					<p class="date">{post.date_formatted}</p>
					<p>{post.description}</p>
				</a>
			</article>
		{/if}
	{/each}
</div>

<style>
	.posts a:hover,
	.posts a:hover > h3 {
		color: oklch(var(--p));
	}

	.posts a > p {
		font-weight: 400;
	}

	.first-post-title {
		font-size: 2.25rem;
		margin-top: 2rem;
	}

	.posts a > h3 {
		margin-bottom: 0rem;
	}

	.date {
		margin-top: 0rem;
		font-size: 0.875rem;
	}

	h2 {
		text-decoration: underline;
		text-decoration-color: oklch(var(--a));
		text-underline-offset: 0.25rem;
		text-decoration-thickness: 0.125rem;
	}
</style>