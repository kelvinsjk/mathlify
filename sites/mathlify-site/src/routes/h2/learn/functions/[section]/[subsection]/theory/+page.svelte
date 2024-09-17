<script lang="ts">
	/**
	 * Mathlified generic Page version 0.0.1
	 * generated on 9/4/2024, 9:34:40 PM
	 */
	import { invalidate } from '$app/navigation';
	import Content from '$lib/components/mathlified/Content.svelte';
	import { h2_learnSequential } from '$lib/components/nav';
	import { page } from '$app/stores';
	const i = h2_learnSequential.findIndex(
		(x) => x.slug === '/h2_learn/functions/concepts/intervals/theory'
	);
	// TODO: j for functions end
	const sequentialNav = h2_learnSequential.slice(i).map((x) => {
		return { name: x.name, slug: x.slug.replace('h2_learn', 'h2/learn') };
	});
	const index = $derived(sequentialNav.findIndex((x) => x.slug === $page.url.pathname));
	const prev = $derived(sequentialNav.slice(0, index).findLast((x) => x.name !== 'Practice'));
	const sequential = $derived({ prev, next: sequentialNav[index + 1] });

	if (i < 0) throw new Error('Starting sequential nav item not found');

	const { data } = $props();

	$effect(() => {
		if (import.meta.hot) {
			import.meta.hot.on('md-update', () => {
				invalidate('md');
			});
		}
	});
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<Content content={data.content} {sequential} />
