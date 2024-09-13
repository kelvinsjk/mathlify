<script lang="ts">
	const links = [
		{ title: 'Learn', slug: '/h2/learn/functions/concepts/intervals/theory' },
		{ title: 'Solutions', slug: '/h2/solutions/2023/p1/q7' },
		{ title: 'Questions', slug: '/h2/questions/tys/2007/p1/q2' }
	];
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<main>
	{#each links as link}
		<a href={link.slug}>{link.title}</a>
	{/each}
</main>

<style>
	main {
		margin: 1.5rem;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1rem;
	}
</style>
