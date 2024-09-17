<script lang="ts">
	import { invalidate } from '$app/navigation';
	import H2_solutions from '$lib/components/H2_solutions.svelte';

	const { data } = $props();
	$effect(() => {
		if (import.meta.hot) {
			import.meta.hot.on('md-update', () => {
				invalidate('md');
			});
		}
	});

	const title = `${data.data.year} Paper ${data.data.paperNo} Question ${data.data.questionNo}`;
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<H2_solutions data={data.data} />
