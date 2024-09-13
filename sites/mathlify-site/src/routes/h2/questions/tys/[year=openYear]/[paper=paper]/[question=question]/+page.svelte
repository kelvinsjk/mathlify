<script lang="ts">
	/**
	 * Mathlified Custom Page version 0.0.1
	 * generated on 9/4/2024, 9:34:40 PM
	 */
	import { invalidate } from '$app/navigation';
	import Question from '$lib/components/Question.svelte';

	const { data } = $props();
	$effect(() => {
		if (import.meta.hot) {
			import.meta.hot.on('md-update', () => {
				invalidate('md');
			});
		}
	});

	// get copy of module (contentFile.ts);
	//const modules = import.meta.glob('/src/content/h2-2_h2_solutions/**/[^_]*.ts');
	//const module = $derived(modules[data.filePath]());
</script>

<svelte:head>
	<title>{data.data.year} Paper {data.data.paper} Question {data.data.questionNo}</title>
</svelte:head>

<Question data={data.data} />
