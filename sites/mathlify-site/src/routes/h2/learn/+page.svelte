<script lang="ts">
	import Nav from '$lib/components/mathlified/Nav.svelte';
	import type { PageData } from './$types';

	const links = [
		{ title: 'Functions', slug: '/h2/learn/functions/concepts/intervals/theory' },
		{
			title: 'Graphs',
			slug: '/h2/learn/graphs-and-transformations/standard-graphs/asymptotes/theory'
		}
	];
	let { data }: { data: PageData } = $props();
</script>

<div class="main-container">
	<nav class="sidebar">
		<Nav nav={data.nav ?? []} />
	</nav>
	<main>
		{#each links as link}
			<a href={link.slug}>{link.title}</a>
		{/each}
	</main>
</div>

<style>
	.main-container {
		display: grid;
		height: calc(100vh - 3.5rem);
		height: calc(100dvh - 3.5rem);
	}
	nav,
	main {
		height: 100%;
		overflow: hidden;
	}
	main {
		margin: 1.5rem;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1rem;
	}
	nav {
		overflow-y: auto;
	}
	.sidebar {
		display: none;
	}
	@media (min-width: 40rem) {
		.main-container {
			grid-template-columns: 18rem 1fr;
		}
		.sidebar {
			display: block;
			padding-inline: 1rem;
			width: 100%;
			overflow-y: auto;
			background-color: var(--surface, hsl(60, 5%, 96%));
			border-inline-end: 1px solid var(--content, black);
		}
	}
	@media (min-width: 60rem) {
		.sidebar {
			padding-block-start: 1rem;
		}
	}
</style>
