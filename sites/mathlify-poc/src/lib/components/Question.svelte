<script lang="ts">
	import type { Question } from './types';
	export let question: Question;
	import {numberToGreek} from './greek';

	// add in part and subpart number counts
	if (question.parts !== undefined){
		let partCounter = 0;
		question.parts.forEach((part) => {
			part.partNo ??= ++partCounter;
			partCounter = part.partNo;
			// subparts
			let subpartCounter = 0;
			if (part.subparts !== undefined){
				part.subparts.forEach((subpart) => {
					subpart.subpartNo ??= ++subpartCounter;
					subpartCounter = subpart.subpartNo;
				});
			}
		});
	}
</script>

{#key question}
<section aria-label="question">
	<!--qn body-->
	{#if question['body'] !== undefined}
		<div class:col-span-2={question['marks']!==undefined} class:col-span-3={question['marks']===undefined}>
			{@html question.body}
		</div>
		{#if question['marks'] !== undefined}
			<div class="text-right place-self-end">
				[{question.marks}]
			</div>
		{/if}
	{/if}
	<!--parts-->
	{#if question['parts'] !== undefined}
		{#each question.parts as part,i}
			<!--uplevel-->
			{#if part['uplevel'] !== undefined}
				<div class="col-span-3">
					{@html part.uplevel}
				</div>
			{/if}
			<!--part body-->
			{#if part['body'] !== undefined}
				<div class="font-semibold text-center">
					({String.fromCharCode(96 + (part.partNo||i))})
				</div>
				<div class:col-span-2={part['marks']===undefined}>
					{@html part.body}
				</div>
				{#if part['marks'] !== undefined}
					<div class="text-right place-self-end">
					[{part.marks}]
					</div>
				{/if}
			{/if}
			<!--subparts-->
			{#if part['subparts'] !== undefined}
				{#each part.subparts as subpart,j}
					<!--uplevel-->
					{#if subpart['uplevel'] !== undefined}
						<div class="col-span-3">
							{@html subpart.uplevel}
						</div>
					{/if}
					<!--subpart body-->
					{#if subpart['body'] !== undefined}
						<div class="font-semibold text-center">
							({String.fromCharCode(96 + (part.partNo||i))}{numberToGreek(subpart.subpartNo||j)})
						</div>
						<div class:col-span-2={subpart['marks']===undefined}>
							{@html subpart.body}
						</div>
						{#if subpart['marks'] !== undefined}
							<div class="text-right place-self-end">
								[{subpart.marks}]
							</div>
						{/if}
					{/if}
				{/each}
			{/if}
		{/each}
	{/if}
</section>
{/key}

<style>
	section {
		margin-inline: auto;
		display: grid;
		grid-template-columns: 5ch calc(100% - 8.5ch) 3.5ch;
		row-gap: 1em;
		margin-block: 1em;
	}
</style>