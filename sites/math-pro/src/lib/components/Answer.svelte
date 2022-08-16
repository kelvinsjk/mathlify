<script lang="ts">
	import type { AnswerObject } from '../interfaces';
	export let answer: AnswerObject;
	export let questionMode = false;

	import { qnLabels } from '$lib/qnLabels';
	import {slide,scale,fade} from 'svelte/transition';
	const answersName = questionMode ? 'question' : 'answer';

	export let checked = questionMode;
	const transitionType = questionMode ? scale : slide;
	const transitionTypeOut = questionMode ? scale : slide;
</script>

<section class="flex flex-col" aria-labelledby={answersName} class:leading-6={questionMode}>
	<div class="flex items-center gap-2">
		<h2 id={answersName} class:inline-block={!questionMode} class="dark:text-zinc-300">
			{questionMode ? 'Question' : 'Answer'}
		</h2>
		<div class="ml-2 margin-special h-full">
			<slot />
		</div>
		<!--Reveal answer toggle-->
		{#if !questionMode}
			<div class="h-full mt-8">
				<input type="checkbox" class="toggle toggle-accent" bind:checked >
			</div>
		{/if}
	</div>
	{#if checked}
	{#key answer}
	<div class="parts grid gap-y-4 mb-4" class:mt-4={questionMode} in:transitionType out:transitionTypeOut|local={{duration: questionMode ? 0 : 400}}>
		{#if answer['body'] !== undefined}
			<div class="pl-2 col-span-2" class:col-span-2={answer['marks']!==undefined} class:col-span-3={answer['marks']===undefined}>
				{@html answer.body}
			</div>
			{#if answer['marks'] !== undefined}
				<div class="text-right dark:text-zinc-300 self-end">
					[{answer.marks}]
				</div>
			{/if}
		{/if}
		<!--parts-->
		{#if answer['parts'] !== undefined}
			{#each answer.parts as part, i}
				{#if part['body'] !== undefined}
					{#if part['uplevel'] !== undefined}
						<div class="col-span-3 pl-2">
							{@html part.uplevel}
						</div>
					{/if}
					<div class="font-semibold text-right dark:text-zinc-300">
						({qnLabels[answer['partLabelType'] ?? 'alpha'][part['partNo'] ?? i + 1]})
					</div>
					<div class="pl-2" id={`${answersName}-part-${part['partNo'] ?? i + 1}`} class:col-span-2={part['marks']===undefined}>
						{@html part.body}
					</div>
					{#if part['marks'] !== undefined}
						<div class="text-right dark:text-zinc-300 self-end">
						[{part.marks}]
						</div>
					{/if}
				{/if}
				<!--subparts-->
				{#if part['parts'] !== undefined}
					{#each part.parts as subpart, j}
						{#if subpart['uplevel'] !== undefined}
							<div class="col-span-3">
								{@html subpart.uplevel}
							</div>
						{/if}					
						<div class="font-semibold text-right dark:text-zinc-300">
							({qnLabels[answer['partLabelType'] ?? 'alpha'][part['partNo'] ?? i + 1]}{qnLabels[part['partLabelType'] ?? 'roman'][subpart['partNo'] ?? j + 1]})
						</div>
						<div class="pl-2" id={`${answersName}-subpart-${subpart['partNo'] ?? j + 1}`} class:col-span-2={subpart['marks']===undefined}>
							{@html subpart.body}
						</div>
						{#if subpart['marks'] !== undefined}
							<div class="text-right dark:text-zinc-300 self-end">
								[{subpart.marks}]
							</div>
						{/if}
					{/each}
				{/if}
			{/each}
		{/if}
	</div>
	{/key}
	{/if}
	{#if !questionMode}
	<div>
		<a href="#top" class="dark:text-zinc-100">Back to top &#9650;</a>
	</div>
	{/if}
</section>

<style>
	.parts {
		grid-template-columns: 4ch calc(100% - 7.5ch) 3.5ch;
	}
	section {
		margin-left: auto;
		margin-right: auto;
	}
	.margin-special {
		margin-top: 3rem;
		margin-bottom: 1.5rem;
	}
</style>
