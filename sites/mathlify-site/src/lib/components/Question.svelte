<script lang="ts">
	import { Djot } from 'svelte-djot-math';
	import SequentialNav from './mathlified/SequentialNav.svelte';
	import type { QuestionObject } from '$lib/classes/question';
	let {
		data
	}: {
		data: {
			isMd?: false;
			year: string;
			paper: string;
			questionNo: string;
			question: QuestionObject;
			sequential: { prev?: { name: string; slug: string }; next?: { name: string; slug: string } };
		};
		//module: null | Promise<unknown>;
	} = $props();
	let question = $derived(data.isMd ? {} : data.question);

	function toRoman(k: number): string {
		return ['i', 'ii', 'iii', 'iv', 'v'][k];
	}

	function texToDjot(tex: string) {
		return tex
			.replace(/(?<!\\)\$\$(?!`)([^]+?)\$\$/g, (_, match) => `$$\`${match}\``)
			.replace(/(?<!\\)\$(?!`)(.+?)(?<!\\)\$/g, (_, match) => `$\`${match}\``)
			.replace(/(?<!\$)(\$`)([^`]+)`([.,?!])/g, '$1$2$3`')
			.replace(/ ?(\|) (-+|:-+|-+:|:-+:) (\|) ?/g, '$1$2$3')
			.replaceAll('&dollar;', '$');
	}
</script>

<div class="main-container">
	<div class="prose-container">
		<div class="bleed-left"></div>
		<div class="paper-and-question">
			<h1>{data.year} H2 Mathematics</h1>
			<div class="h2-container">
				<h2>
					Paper {data.paper}
					Question {data.questionNo}
				</h2>
				<div>
					<a class="button" href={`/h2/solutions/${data.year}/p${data.paper}/q${data.questionNo}`}
						>Solutions</a
					>
				</div>
			</div>
		</div>
		<div class="bleed-right"></div>
		<section id="question-section" aria-label="question">
			<div class="question-grid">
				{#if question.body}
					<div class="span-three body-content" class:no-marks={question.marks === undefined}>
						<Djot djot={texToDjot(question.body)} />
					</div>
				{/if}
				{#if question.marks !== undefined}
					<div class="marks">[{question.marks}]</div>
				{/if}
				{#if question.parts}
					{#each question.parts as part, i}
						<div class="part-label" id={`qn-${i + 1}`}>({String.fromCharCode(i + 97)})</div>
						{#if part.body}
							<div class="span-two body-content" class:no-marks={part.marks === undefined}>
								<Djot djot={texToDjot(part.body)} />
							</div>
						{/if}
						{#if part.marks !== undefined}
							<div class="marks">[{part.marks}]</div>
						{/if}
						{#if part.parts}
							{#each part.parts as subpart, j}
								<div id={`qn-${i + 1}-${j + 1}`} class="part-label">
									({toRoman(j)})
								</div>
								<div class="body-content" class:no-marks={subpart.marks !== undefined}>
									<Djot djot={texToDjot(subpart.body ?? '')} />
								</div>
								{#if subpart.marks !== undefined}
									<div class="marks">[{subpart.marks}]</div>
								{/if}
							{/each}
						{/if}
					{/each}
				{/if}
			</div>
		</section>
		<div>
			<SequentialNav sequential={data.sequential} />
		</div>
	</div>
</div>

<style>
	.main-container {
		width: 100%;
		height: 100%;
		overflow-y: auto;
		scroll-behavior: smooth;
	}
	.prose-container {
		display: grid;
		grid-template-columns: 1fr min(65ch, 100%) 1fr;
	}
	.prose-container > * {
		grid-column: 2;
	}
	.question-grid {
		display: grid;
		grid-template-columns: auto auto 1fr auto;
		align-items: flex-start;
		row-gap: 0.5rem;
	}
	.body-content {
		max-width: 65ch;
		line-height: 1.75;
	}
	.part-label ~ .body-content {
		padding-inline-start: 0.5rem;
	}
	.marks {
		align-self: flex-end;
	}
	.part-label {
		line-height: 1.75;
	}
	.body-content.no-marks,
	.body-content.span-two {
		grid-column: span 2;
	}
	.body-content.span-two.no-marks {
		grid-column: span 3;
	}
	.body-content.span-three {
		grid-column: span 3;
	}
	.body-content.span-three.no-marks {
		grid-column: span 4;
	}
	:global(.body-content > p:first-child) {
		margin-block-start: 0;
	}
	:global(.body-content:not(.no-marks) > p:last-child) {
		margin-block-end: 0;
	}
	section {
		padding-inline: 1rem;
	}
	h1 {
		font-weight: 800;
		font-size: 2.25em;
		padding-inline: 1rem;
		line-height: 1.1111111;
	}
	@media (min-width: 40rem) {
		h1 {
			margin-block-start: 0.5rem;
		}
	}
	@media (min-width: 60rem) {
		h1 {
			margin-block-start: 1.5rem;
		}
	}
	.h2-container {
		padding-inline: 1rem;
		display: flex;
		column-gap: 1rem;
		align-items: center;
		flex-wrap: wrap;
		padding-block-end: 1rem;
	}
	.paper-and-question {
		background-color: hsla(var(--secondary-hsl), 0.25);
		display: grid;
	}
	#question-section {
		margin-block: 1rem;
	}
	div.bleed-left {
		background-color: hsla(var(--secondary-hsl), 0.25);
		grid-column: 1;
	}
	div.bleed-right {
		background-color: hsla(var(--secondary-hsl), 0.25);
		grid-column: 3;
	}
	/** center images */
	:global(.body-content svg) {
		margin-inline: auto;
		display: block;
		max-width: min(100%, 100vw, 65ch);
		max-width: min(100%, 100dvw, 65ch);
		max-height: 40vh;
	}
	.button {
		background-color: var(--secondary);
		cursor: pointer;
		transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 0.15s;
		font-weight: 500;
		line-height: 1.5rem;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		height: 2.5rem;
		border: none;
		text-decoration: none;
		color: inherit;

		&:hover {
			background-color: hsla(var(--secondary-hsl), 0.9);
		}
	}
	/** make content font size larger for wider viewport.   */
	@media (min-width: 72rem) {
		.prose-container,
		:global(.prose-container math) {
			font-size: clamp(1rem, 1vw + 0.25rem, 1.5rem);
		}
	}
</style>
