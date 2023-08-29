<script lang="ts">
	import type { AnswerObject } from './interfaces';
	export let answers: AnswerObject[];
	export let questionMode = false;
	import { qnLabels } from './qnLabels';
	const answersName = questionMode ? 'question' : 'solutions';
</script>

<section class="flex flex-col gap-4" aria-labelledby="answers" class:leading-6={questionMode}>
	<div class="parts grid gap-y-4 answer-container">
		{#each answers as answer, i}
			<div class="font-semibold" id={`qn-${i + 1}`}>
				{i + 1}
				{#if !('parts' in answer)}
					.
				{/if}
			</div>
			{#if answer['body'] !== undefined}
				<div class="pl-2 col-span-2">
					{@html answer.body}
				</div>
			{/if}
			<!--parts-->
			{#if answer['parts'] !== undefined}
				{#each answer.parts as part, i}
					{#if part['body'] !== undefined}
						{#if i !== 0 || answer['body'] !== undefined}
							<div class="spacer-part" />
						{/if}
						{#if !questionMode}
							<div class="font-semibold text-center dark:text-zinc-300">
								({qnLabels[answer['partLabelType'] ?? 'alpha'][part['partNo'] ?? i + 1]})
							</div>
						{:else}
							<a
								class="font-semibold text-center dark:text-zinc-300"
								href={`#solutions-part-${part['partNo'] ?? i + 1}`}
							>
								({qnLabels[answer['partLabelType'] ?? 'alpha'][part['partNo'] ?? i + 1]})
							</a>
						{/if}
						<div class="pl-2" id={`${answersName}-part-${part['partNo'] ?? i + 1}`}>
							{@html part.body}
						</div>
					{/if}
					<!--subparts-->
					{#if part['parts'] !== undefined}
						{#each part.parts as subpart, j}
							{#if i !== 0 || j !== 0}
								<div class="spacer-subpart" />
							{/if}
							{#if !questionMode}
								<div class="font-semibold text-center dark:text-zinc-300">
									({qnLabels[answer['partLabelType'] ?? 'alpha'][part['partNo'] ?? i + 1]}{qnLabels[
										part['partLabelType'] ?? 'roman'
									][subpart['partNo'] ?? j + 1]})
								</div>
							{:else}
								<a
									class="font-semibold text-center dark:text-zinc-300"
									href={`#solutions-subpart-${subpart['partNo'] ?? j + 1}`}
								>
									({qnLabels[answer['partLabelType'] ?? 'alpha'][part['partNo'] ?? i + 1]}{qnLabels[
										part['partLabelType'] ?? 'roman'
									][subpart['partNo'] ?? j + 1]})
								</a>
							{/if}
							<div class="pl-2" id={`${answersName}-subpart-${subpart['partNo'] ?? j + 1}`}>
								{@html subpart.body}
							</div>
						{/each}
					{/if}
				{/each}
			{/if}
		{/each}
	</div>
	<slot />
</section>

<style>
	.parts {
		grid-template-columns: 3ch 4ch calc(100% - 7ch);
	}
	section {
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 1rem;
	}
</style>
