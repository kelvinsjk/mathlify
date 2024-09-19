<script lang="ts">
	import { Djot } from 'svelte-djot-math';
	import SequentialNav from './mathlified/SequentialNav.svelte';
	import type { AnswerObject } from '$lib/classes/answer';
	import type { NavNodePlusColor } from './mathlified/Nav.svelte';
	import Nav from './mathlified/Nav.svelte';
	let {
		data
	}: {
		data: {
			year: number;
			paperNo: number;
			questionNo: number;
			answer: AnswerObject;
			solution: AnswerObject;
			topicalNav: NavNodePlusColor[];
			sequential: { prev?: { name: string; slug: string }; next?: { name: string; slug: string } };
		};
	} = $props();
	let [answer, solution] = $derived([data.answer, data.solution]);
	let nav = $derived(data.topicalNav);

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
	<nav class="toc-container">
		<details class="mobile-toc">
			<summary>
				<svg
					aria-hidden="true"
					class="caret"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="currentColor"
					style="--sl-icon-size: 1.25rem;"
					><path
						d="m14.83 11.29-4.24-4.24a1 1 0 1 0-1.42 1.41L12.71 12l-3.54 3.54a1 1 0 0 0 0 1.41 1 1 0 0 0 .71.29 1 1 0 0 0 .71-.29l4.24-4.24a1.002 1.002 0 0 0 0-1.42Z"
					></path></svg
				>
				Topical navigation
			</summary>
			<Nav {nav} hasColor={false} />
		</details>
		<div class="desktop-toc">
			<Nav {nav} hasColor={false} />
		</div>
	</nav>
	<div class="prose-container">
		<h1>
			{data.year}
			<span class="no-break">
				Paper {data.paperNo}
			</span>
			<span class="no-break">
				Question {data.questionNo}
			</span>
		</h1>
		<div class="bleed-left"></div>
		<section id="answers-section" aria-labelledby="answers">
			<h2 id="answers">Answers</h2>
			<div class="answer-grid">
				{#if answer.body}
					<div class="span-two qn-body">
						<Djot djot={texToDjot(answer.body)} />
					</div>
				{/if}
				{#if answer.parts}
					{#each answer.parts as part, i}
						{#if part.parts}
							{#each part.parts as subpart, j}
								<a id={`ans-${i + 1}-${j + 1}`} href={`#soln-${i + 1}-${j + 1}`} class="part-label"
									>({String.fromCharCode(i + 97)}{toRoman(j)})</a
								>
								<div class="body-content">
									<Djot djot={texToDjot(subpart.body ?? '')} />
								</div>
							{/each}
						{:else}
							<a id={`ans-${i + 1}`} href={`#soln-${i + 1}`} class="part-label"
								>({String.fromCharCode(i + 97)})</a
							>
							<div class="body-content">
								<Djot djot={texToDjot(part.body ?? '')} />
							</div>
						{/if}
					{/each}
				{/if}
			</div>
		</section>
		<div class="bleed-right"></div>
		<section aria-labelledby="solutions">
			<h2 id="solutions">Solutions</h2>
			<div class="answer-grid">
				{#if solution.body}
					<div class="span-two qn-body">
						<Djot djot={texToDjot(solution.body)} />
					</div>
				{/if}
				{#if solution.parts}
					{#each solution.parts as part, i}
						{#if part.parts}
							{#each part.parts as subpart, j}
								<a id={`soln-${i + 1}-${j + 1}`} href={`#ans-${i + 1}-${j + 1}`} class="part-label"
									>({String.fromCharCode(i + 97)}{toRoman(j)})</a
								>
								<div class="body-content">
									<Djot djot={texToDjot(subpart.body ?? '')} />
								</div>
							{/each}
						{:else}
							<a id={`soln-${i + 1}`} href={`#ans-${i + 1}`} class="part-label"
								>({String.fromCharCode(i + 97)})</a
							>
							<div class="body-content">
								<Djot djot={texToDjot(part.body ?? '')} />
							</div>
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
		height: 100%;
		display: grid;
	}
	.prose-container {
		height: 100%;
		overflow-y: auto;
		scroll-behavior: smooth;
		padding-block-start: 1rem;
	}
	.toc-container {
		background-color: var(--surface, hsl(60, 5%, 96%));
		padding-inline: 1rem;
		height: 100%;
		overflow-y: auto;
		scroll-behavior: smooth;
		border-block: 1px solid rgba(0, 0, 0, 0.25);
	}
	.desktop-toc {
		display: none;
	}
	@media (min-width: 40rem) {
		.toc-container {
			border-block: none;
		}
	}

	@media (min-width: 60rem) {
		.desktop-toc {
			display: block;
		}
		.mobile-toc {
			display: none;
		}
	}
	@media (min-width: 60rem) {
		.main-container {
			grid-template-columns: 1fr 15rem;
			align-content: stretch;
		}
		.toc-container {
			order: 2;
			padding-block-start: 1rem;
			height: 100%;
			overflow-y: auto;
			border-inline-start: 1px solid var(--content, black);
		}
	}
	.prose-container {
		display: grid;
		grid-template-columns: 1fr min(65ch, 100%) 1fr;
	}
	#answers-section {
		background-color: hsla(var(--secondary-hsl), 0.25);
		padding-block: 1.5em;
	}
	div.bleed-left {
		background-color: hsla(var(--secondary-hsl), 0.25);
		grid-column: 1;
	}
	div.bleed-right {
		background-color: hsla(var(--secondary-hsl), 0.25);
		grid-column: 3;
	}
	.prose-container > * {
		grid-column: 2;
	}
	.answer-grid {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: flex-start;
		row-gap: 0.5rem;
	}
	.body-content {
		max-width: 65ch;
		line-height: 1.75;
		padding-inline-start: 0.5rem;
	}
	.part-label {
		line-height: 1.75;
	}
	.prose-container {
		height: 100%;
		padding-block-start: 1rem;
	}
	.qn-body.span-two {
		grid-column: span 2;
	}
	.no-break {
		white-space: nowrap;
	}
	:global(.body-content > p:first-child) {
		margin-block-start: 0;
	}
	:global(.body-content > p:last-child) {
		margin-block-end: 0;
	}
	a,
	:global(.body-content a) {
		color: inherit;
		font-weight: 500;
	}
	section {
		padding-inline: 1rem;
	}

	#answers-section > h2 {
		margin-block-start: 0;
	}
	h1 {
		font-weight: 800;
		font-size: 2.25em;
		margin-block-start: 0;
		margin-block-end: 1rem;
		line-height: 1.1111111;
		padding-inline: 1rem;
	}
	/** center images */
	:global(.body-content svg) {
		margin-inline: auto;
		display: block;
		max-width: min(100%, 100vw, 65ch);
		max-width: min(100%, 100dvw, 65ch);
		max-height: 40vh;
	}
	/** make content font size larger for wider viewport.   */
	@media (min-width: 72rem) {
		.prose-container,
		:global(.prose-container math) {
			font-size: clamp(1rem, 1vw + 0.25rem, 1.5rem);
		}
		:global(.prose-container svg math) {
			font-size: inherit;
		}
	}
	summary {
		font-weight: 600;
		font-size: 1rem;
		padding-block: 0.25rem;
		margin-block: 0.25rem;
	}
	summary {
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		line-height: 1.4;
	}
	svg {
		width: 1em;
		height: 1em;
		transition: transform 0.2s ease-in-out;
	}
	details[open] > summary > svg {
		transform: rotate(90deg);
	}
	details[open] {
		padding-block-end: 0.5rem;
	}
</style>
