<script lang="ts">
	import Content from '$lib/components/Content/Content.svelte';
	import NavAccordion from '$lib/components/Nav/NavAccordion.svelte';
	import type { Snippet } from 'svelte';
	import type { Section } from '$lib/types/learn';
	import { scale, slide } from 'svelte/transition';
	import type { AnswerObject } from '$lib/types/question';

	let {
		title,
		syllabus,
		topics,
		next,
		prev,
		answer,
		solution,
	}: {
		title: string;
		syllabus: string;
		topics: string | string[];
		prev: { shortTitle: string; slug: string; sectionSlug: string } | undefined;
		next: { shortTitle: string; slug: string; sectionSlug: string } | undefined;
		answer: AnswerObject;
		solution: AnswerObject;
	} = $props();
	const topicsState = $state(topics);
	const topicsArray = $derived.by(() => {
		if (typeof topicsState === 'string') return [topicsState];
		return topicsState;
	});
	// TODO: use breadcrumbs to indicate syllabus and topic

	function numberToAlpha(i: number): string {
		return String.fromCharCode(97 + i);
	}
	import { romanize } from '$lib/utils/romans';
</script>

<Content {title} {prev} {next}>
	{#snippet content()}
		<div class="static-content learn solutions">
			<h1 id={title.replaceAll(' ', '-').replaceAll(',', '')}>
				{title}
			</h1>
			<div class="answer-container">
				<section class="answer" aria-label="Answer">
					<h2>Answer</h2>
					<div>
						<div class="answer-grid" class:answer-with-parts={answer.parts}>
							{#if answer.parts}
								{#each answer.parts as part, i}
									{#if part.parts}
										{#each part.parts as subpart, j}
											<a id={`ans-${i + 1}-part-${j + 1}`} href={`#soln-${i + 1}-part-${j + 1}`}
												>({numberToAlpha(i)}{romanize(j + 1)})</a
											>
											<div class="answer-content">
												{@html subpart.body}
											</div>
										{/each}
									{:else}
										<a id={`ans-${i + 1}`} href={`#soln-${i + 1}`}>({numberToAlpha(i)})</a>
										<div class="answer-content">
											{@html part.body}
										</div>
									{/if}
								{/each}
							{:else}
								<div class="answer-content">
									{@html answer.body}
								</div>
							{/if}
						</div>
					</div>
				</section>
			</div>
			<section class="solution" aria-label="Solution">
				<h2>Solution</h2>
				<div class="answer-grid" class:answer-with-parts={solution.parts}>
					{#if solution.parts}
						{#each solution.parts as part, i}
							{#if part.parts}
								{#each part.parts as subpart, j}
									<a id={`soln-${i + 1}-part-${j + 1}`} href={`#ans-${i + 1}-part-${j + 1}`}
										>({numberToAlpha(i)}{romanize(j + 1)})</a
									>
									<div class="answer-content">
										{@html subpart.body}
									</div>
								{/each}
							{:else}
								<a id={`soln-${i + 1}`} href={`#ans-${i + 1}`}>({numberToAlpha(i)})</a>
								<div class="answer-content">
									{@html part.body}
								</div>
							{/if}
						{/each}
					{:else}
						<div class="answer-content">
							{@html solution.body}
						</div>
					{/if}
				</div>
			</section>
		</div>
	{/snippet}
	{#snippet desktopExtraNav()}
		<div>Extra</div>
	{/snippet}
	<!-- {#snippet desktopExtraNav()}
    <div>
      <hr />
      <div class="chapter-nav">
        Chapter navigation
      </div>
      <NavAccordion {sections} section={section} subsection={subsection}>
      </NavAccordion>
    </div>
  {/snippet} -->
</Content>

<style>
	.chapter-nav {
		font-weight: bold;
		font-size: 1.25rem;
		margin-block-start: 2rem;
	}
	.answer-container {
		background-color: hsl(var(--primary-light));
		margin-left: 50%;
		margin-block-start: 1em;
		transform: translateX(-50%);
		padding-block: 1em;
		width: 100dvw;
	}
	.answer {
		margin-inline: auto;
		padding-inline: 1rem;
	}
	.answer-grid {
		display: grid;
		gap: 0.5rem;
		overflow: hidden;
	}
	.answer-with-parts {
		grid-template-columns: auto minmax(0, 1fr);
	}
	:global(.answer-content > p:first-child) {
		margin-block-start: 0;
	}
	:global(.answer-content > p:last-child) {
		margin-block-end: 0;
	}
	:global(.solutions svg) {
		max-width: min(100%, 100vw);
		max-height: 60vh;
	}

	/** TODO: sync with app.css var(--max-width) */
	@media (min-width: 800px) {
		.answer-container {
			--bleed-width: calc(
				100dvw - clamp(250px, calc(250px + (100vw - var(--container-width)) / 2), 400px)
			);
			width: var(--bleed-width);
		}
		.answer {
			width: min(800px, var(--bleed-width));
		}
	}
	h1 {
		margin-block-end: 0;
	}
	h2 {
		margin-block-start: 0;
		margin-block-end: 1.25rem;
	}
	.solution {
		margin-block-start: 1em;
	}
</style>
