<script lang="ts">
	import type { Snippet } from 'svelte';
	import Switch from '$lib/components/ui/Switch.svelte';
	import { scale, slide } from 'svelte/transition';
	import SequentialNav from '../mathlified/SequentialNav.svelte';

	let {
		title,
		showAnswer = $bindable(false),
		question,
		answer,
		questionButton,
		sequential
	}: {
		title?: string;
		showAnswer: boolean;
		question: Snippet;
		answer: Snippet;
		questionButton?: Snippet;
		sequential?: { prev?: { name: string; slug: string }; next?: { name: string; slug: string } };
	} = $props();
</script>

<div class="main-container">
	<div class="content prose practice">
		<h1 id={(title ?? 'title').replaceAll(' ', '-').replaceAll(',', '')}>
			Practice: {title ?? ''}
		</h1>
		<div class="bleed-left"></div>
		<div class="question-container">
			<section class="question" aria-label="Question">
				<div class="question-heading-container">
					<h2>Question</h2>
					{#if questionButton}
						{@render questionButton()}
					{/if}
				</div>
				{@render question()}
			</section>
		</div>
		<div class="bleed-right"></div>
		<section class="answer" aria-label="Answer">
			<div class="answer-heading-container">
				<h2>Answer</h2>
				<Switch bind:checked={showAnswer} />
			</div>
			{#if showAnswer}
				<div class="answer-container" in:scale out:slide>
					{@render answer()}
				</div>
			{/if}
		</section>
		<div>
			<SequentialNav {sequential} />
		</div>
	</div>
</div>

<style>
	.main-container {
		width: 100%;
		height: 100%;
		overflow-y: auto;
	}
	.practice {
		padding-block-start: 1rem;
		display: grid;
		grid-template-columns: 1fr min(65ch, 100%) 1fr;
		row-gap: 1rem;

		& > * {
			grid-column: 2;
			padding-inline: 1rem;
		}
	}
	.question-container {
		background-color: hsla(var(--secondary-hsl), 0.25);
		padding-block: 1.5em;
	}
	div.bleed-left {
		background-color: hsla(var(--secondary-hsl), 0.25);
		grid-column: 1;
		padding-inline: 0;
	}
	div.bleed-right {
		background-color: hsla(var(--secondary-hsl), 0.25);
		grid-column: 3;
		padding-inline: 0;
	}
	/** make content font size larger for wider viewport.   */
	@media (min-width: 72rem) {
		.practice {
			font-size: clamp(1rem, 1vw + 0.25rem, 1.5rem);
		}
	}
	.answer-container {
		/* workaround to prevent margin making transition jerk */
		padding: 1px;
	}
	.question-heading-container,
	.answer-heading-container {
		display: flex;
		align-items: center;
		margin-block-end: 1em;
		gap: 1em;
		flex-wrap: wrap;
	}
	.answer-heading-container {
		margin-block-start: 1em;
	}
	h1,
	h2 {
		margin-block: 0;
	}
</style>
