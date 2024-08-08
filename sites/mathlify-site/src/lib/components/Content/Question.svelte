<script lang="ts">
	import Content from '$lib/components/Content/Content.svelte';
	import NavAccordion from '$lib/components/Nav/NavAccordion.svelte';
	import type { Snippet } from 'svelte';
	import type { Section } from '$lib/types/learn';
	import { scale, slide } from 'svelte/transition';
	import type { AnswerObject, QuestionObject } from '$lib/types/question';

	let {
		//syllabus,
		//topics,
		//title,
		prev = 'theory',
		next = 'practice',
		title = 'Prototype',
		dj = false,
		qn,
	}: {
		title?: string;
		//syllabus: string;
		//topics: string | string[];
		prev?: { shortTitle: string; slug: string; sectionSlug: string } | 'theory';
		next?: { shortTitle: string; slug: string; sectionSlug: string } | 'practice';
		dj?: boolean;
		qn: QuestionObject;
	} = $props();
	//const topicsState = $state(topics);
	//const topicsArray = $derived.by(() => {
	//	if (typeof topicsState === 'string') return [topicsState];
	//	return topicsState;
	//});
	// TODO: use breadcrumbs to indicate syllabus and topic

	function numberToAlpha(i: number): string {
		return String.fromCharCode(97 + i);
	}
	import { romanize } from '$lib/utils/romans';
	import { renderHTML } from 'djot-temml';
</script>

<Content {title} {prev} {next}>
	{#snippet content()}
		<div class="static-content learn question">
			<h1 id={title.replaceAll(' ', '-').replaceAll(',', '')}>
				{title}
			</h1>
			<div class="question-container">
				<section class="qn" aria-label="Question">
					<h2>Question</h2>
					<div>
						<div class="qn-grid" class:qn-with-parts={qn.parts}>
							{#if qn.body}
								{@const body = dj ? renderHTML(qn.body) : qn.body}
								<div
									class="qn-content"
									class:span-two={!qn.marks}
									class:span-three={qn.parts && !qn.marks}
								>
									{@html body}
								</div>
								{#if qn.marks}
									<div class="marks">[{qn.marks}]</div>
								{/if}
							{/if}
							{#if qn.parts}
								{#each qn.parts as part, i}
									{#if part.uplevel}
										{@const body = dj ? renderHTML(part.uplevel) : part.uplevel}
										<div class="qn-content span-three">
											{@html body}
										</div>
									{/if}
									{#if part.body}
										{@const body = dj ? renderHTML(part.body) : part.body}
										<div id={`qn-${i + 1}`}>({numberToAlpha(i)})</div>
										<div class="qn-content" class:span-two={!part.marks}>
											{@html body}
										</div>
										{#if part.marks}
											<div class="marks">[{part.marks}]</div>
										{/if}
									{/if}
									{#if part.parts}
										{#each part.parts as subpart, j}
											{@const body = dj ? renderHTML(subpart.body!) : subpart.body}
											{#if subpart.uplevel}
												<!--empty div for aligning against part label-->
												<div></div>
												{@const body = dj ? renderHTML(subpart.uplevel) : subpart.uplevel}
												<div class="qn-content span-two uplevel">
													{@html body}
												</div>
											{/if}
											<!--empty div for aligning against part label-->
											<div></div>
											<div class="subpart-content" class:span-two={!subpart.marks}>
												<div id={`ans-${i + 1}-part-${j + 1}`}>
													({romanize(j + 1)})
												</div>
												<div class="qn-content">
													{@html body}
												</div>
											</div>
											{#if subpart.marks}
												<div class="marks">[{subpart.marks}]</div>
											{/if}
										{/each}
									{/if}
								{/each}
							{/if}
						</div>
					</div>
				</section>
			</div>
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
	.question-container {
		background-color: hsl(var(--primary-light));
		margin-left: 50%;
		margin-block-start: 1em;
		transform: translateX(-50%);
		padding-block: 1em;
		width: 100dvw;
	}
	.qn {
		margin-inline: auto;
		padding-inline: 1rem;
	}
	.qn-grid {
		display: grid;
		/** default: no parts */
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0.5rem;
		overflow: hidden;
	}
	.span-two {
		grid-column: span 2;
	}
	.span-three {
		grid-column: span 3;
	}
	.subpart-content {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: 0.5rem;
	}
	.marks {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}
	.qn-with-parts {
		grid-template-columns: auto minmax(0, 1fr) auto;
	}
	:global(.qn-content > p:first-child) {
		margin-block-start: 0;
	}
	:global(.qn-content > p:last-child) {
		margin-block-end: 0;
	}
	:global(.question svg) {
		max-width: min(100%, 100vw);
		max-height: 60vh;
	}

	/** TODO: sync with app.css var(--max-width) */
	@media (min-width: 800px) {
		.question-container {
			--bleed-width: calc(
				100dvw - clamp(250px, calc(250px + (100vw - var(--container-width)) / 2), 400px)
			);
			width: var(--bleed-width);
		}
		.qn {
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
</style>
