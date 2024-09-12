<script lang="ts">
	const links = [
		{ title: 'Learn', slug: '/h2/learn/functions/concepts/intervals/theory' },
		{ title: 'Solutions', slug: '/h2/solutions/2023/p1/q7' },
		{ title: 'Register', slug: '/auth/register' },
		{ title: 'Login', slug: '/auth/login' }
	];
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

{#if data.session}
	Logged in
{:else}
	Logged out
{/if}
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
