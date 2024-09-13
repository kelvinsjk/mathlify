<script lang="ts">
	import Question from '$lib/components/Question.svelte';

	const { data } = $props();
</script>

<svelte:head>
	<title>{data.data.year} Paper {data.data.paper} Question {data.data.questionNo}</title>
</svelte:head>

<Question data={data.data} />
