<script lang="ts">
	import type { Answer } from './types';
	export let answer: Answer;
	import {numberToGreek} from './greek';

	// add in part and subpart number counts
	if (answer.parts !== undefined){
		let partCounter = 0;
		answer.parts.forEach((part) => {
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

{#key answer}
<section aria-label="question">
	<!--qn body-->
	{#if answer['body'] !== undefined}
		<div class="col-span-2">
			{@html answer.body}
		</div>
	{/if}
	<!--parts-->
	{#if answer['parts'] !== undefined}
		{#each answer.parts as part,i}
			<!--uplevel-->
			{#if part['uplevel'] !== undefined}
				<div class="col-span-2">
					{@html part.uplevel}
				</div>
			{/if}
			<!--part body-->
			{#if part['body'] !== undefined}
				<div class="font-semibold text-center">
					({String.fromCharCode(96 + (part.partNo||i))})
				</div>
				<div>
					{@html part.body}
				</div>
			{/if}
			<!--subparts-->
			{#if part['subparts'] !== undefined}
				{#each part.subparts as subpart,j}
					<!--uplevel-->
					{#if subpart['uplevel'] !== undefined}
						<div class="col-span-2">
							{@html subpart.uplevel}
						</div>
					{/if}
					<!--subpart body-->
					{#if subpart['body'] !== undefined}
						<div class="font-semibold text-center">
							({String.fromCharCode(96 + (part.partNo||i))}{numberToGreek(subpart.subpartNo||j)})
						</div>
						<div>
							{@html subpart.body}
						</div>
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
		grid-template-columns: 5ch calc(100% - 5ch);
		row-gap: 1em;
		margin-block: 1em;
	}
</style>