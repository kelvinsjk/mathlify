<script lang="ts">
  export let qn: string;
  export let subtitle: string = undefined;

  import { topics } from '$lib/topics';

  $: topicNo = Number(qn.slice(0,2))-1;
  $: topic = topics[topicNo];
</script>

<header class="p-4 pb-8 sm:text-center bg-goldenrod dark:bg-zinc-800">
	<h1 class="font-serif text-zinc-900 dark:text-goldenrod" id="top">
		{#if topic === undefined}
		{qn}
		{:else}
		Question {qn}
		{/if}
	</h1>
	{#if topic !== undefined}
	<div class="font-serif pb-4 text-3xl font-bold subtitle text-zinc-900 dark:text-goldenrod">
		{topic}
	</div>
	{/if}
	{#if subtitle !== undefined}
	<div class="font-serif text-2xl font-bold subtitle text-zinc-900 dark:text-goldenrod">
		{subtitle}
	</div>
	{/if}
</header>

<style>
	header {
		width: 100vw;
		margin-left: 50%;
		transform: translateX(-50%);
	}
</style>