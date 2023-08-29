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
			<a
				class="font-semibold"
				id={questionMode ? `qn-${i + 1}` : `solutions-${i + 1}`}
				href={questionMode ? `#solutions-${i + 1}` : `#qn-${i + 1}`}
			>
				{i + 1}.
			</a>
			{#if answer['body'] !== undefined}
				<div class="pl-2 col-span-2">
					{@html answer.body}
				</div>
			{/if}
			<!--parts-->
			{#if answer['parts'] !== undefined}
				{#each answer.parts as part, j}
					{#if part['body'] !== undefined}
						{#if j !== 0 || answer['body'] !== undefined}
							<div class="spacer-part" />
						{/if}

						<a
							class="font-semibold text-center dark:text-zinc-300"
							id={`${questionMode ? 'qn' : 'solutions'}-${i + 1}-part-${part['partNo'] ?? j + 1}`}
							href={`#${questionMode ? 'solutions' : 'qn'}-${i + 1}-part-${
								part['partNo'] ?? j + 1
							}`}
						>
							({qnLabels[answer['partLabelType'] ?? 'alpha'][part['partNo'] ?? j + 1]})
						</a>
						<div class="pl-2">
							{@html part.body}
						</div>
					{/if}
					<!--subparts-->
					{#if part['parts'] !== undefined}
						{#each part.parts as subpart, k}
							{#if j !== 0 || k !== 0}
								<div class="spacer-subpart" />
							{/if}
							<a
								class="font-semibold text-center dark:text-zinc-300"
								id={`#${questionMode ? 'qn' : 'solutions'}-${i + 1}-subpart-${
									subpart['partNo'] ?? k + 1
								}`}
								href={`#${questionMode ? 'solutions' : 'qn'}-${i + 1}-subpart-${
									subpart['partNo'] ?? k + 1
								}`}
							>
								({qnLabels[answer['partLabelType'] ?? 'alpha'][part['partNo'] ?? j + 1]}{qnLabels[
									part['partLabelType'] ?? 'roman'
								][subpart['partNo'] ?? k + 1]})
							</a>
							<div class="pl-2">
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
