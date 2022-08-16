<script lang="ts">
  import {contents} from './contents'
  export let pageID: string;

  $: topicString = pageID.slice(0,2);
  $: questions = contents[Number(topicString)-1];
</script>

<footer class="p-4 mt-2 bg-goldenrod dark:bg-zinc-800 dark:text-zinc-200">
	<div class="max-w-prose mx-auto text-lg">
		<h2 class="mt-0 dark:text-goldenrod">
			More questions
		</h2>
		<h3 class="dark:text-zinc-100">
			Core concepts
		</h3>
		<!--core concepts-->
		{#each questions.basic as questionSet}
		<div class="flex flex-wrap gap-x-2 gap-y-1 my-4">
			{#each questionSet as question}
			{#if question.slug===pageID}
			<div class="text-red-700 dark:text-red-400 font-semibold">
				{question.text}
			</div>
			{:else}
			<a sveltekit:prefetch href={`/questions/${topicString}/${question.slug}`} class="dark:text-zinc-400">
				{question.text}
			</a>
			{/if}
			{/each}
		</div>
		{/each}
		<!--topics-->
		<h3 class="dark:text-zinc-100">
			Exam-style practice
		</h3>
		<div class="grid responsive-grid gap-1 justify-start">
			{#each questions.exam as q}
				{#if q===pageID}
				<div class="text-red-700 dark:text-red-400 font-semibold">
					{q}
				</div>
				{:else}
				<a sveltekit:prefetch href={`/questions/${topicString}/${q}`} class="dark:text-zinc-400">
					{q}
				</a>
				{/if}
			{/each}
		</div>
	</div>
</footer>

<style>
	footer {
		width: 100vw;
		margin-left: 50%;
		transform: translateX(-50%);
	}
	.responsive-grid {
		grid-template-columns: repeat(auto-fit, minmax(5ch, 1fr));
		column-gap: 0.5em;
	}
</style>