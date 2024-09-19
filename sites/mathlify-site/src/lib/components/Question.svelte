<script lang="ts">
	import { Djot } from 'svelte-djot-math';
	import SequentialNav from './mathlified/SequentialNav.svelte';
	import type { QuestionObject } from '$lib/classes/question';
	import type { NavNodePlusColor } from './mathlified/Nav.svelte';
	import Nav from './mathlified/Nav.svelte';
	let {
		data
	}: {
		data: {
			role?: 'admin' | 'super' | 'member' | 'premium';
			year: string;
			paper: string;
			questionNo: number;
			question: QuestionObject;
			sequential: { prev?: { name: string; slug: string }; next?: { name: string; slug: string } };
			topicalNav: NavNodePlusColor[];
		};
	} = $props();
	let question = $derived(data.question);
	let nav = $derived.by(() => {
		if (data.role === 'admin' || data.role === 'super') {
			return data.topicalNav;
		}
		const topicalNav: NavNodePlusColor[] = [];
		for (const { name, children } of data.topicalNav) {
			topicalNav.push({
				name,
				// @ts-expect-error color may be undefined
				children: children?.filter((x) => x.color !== 'red'),
				slug: '',
				fileSlug: ''
			});
		}
		return topicalNav;
	});

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
			<Nav {nav} />
		</details>
		<div class="desktop-toc">
			<Nav {nav} />
		</div>
	</nav>
	<div class="prose-container">
		<div class="bleed-left"></div>
		<div class="paper-and-question">
			<h1>{data.year} H2 Mathematics</h1>
			<div class="h2-container">
				<h2>
					<span class="no-break">
						Paper {data.paper}
					</span>
					<span class="no-break">
						Question {data.questionNo}
					</span>
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
						{#if part.uplevel}
							<div class="part-uplevel">
								<Djot djot={texToDjot(part.uplevel)} />
							</div>
						{/if}
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
								{#if subpart.uplevel}
									<div class="subpart-uplevel">
										<Djot djot={texToDjot(subpart.uplevel)} />
									</div>
								{/if}
								<div id={`qn-${i + 1}-${j + 1}`} class="part-label subpart-label">
									({toRoman(j)})
								</div>
								<div class="body-content" class:no-marks={subpart.marks === undefined}>
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
		height: 100%;
		display: grid;
	}
	.prose-container {
		height: 100%;
		overflow-y: auto;
		scroll-behavior: smooth;
		display: grid;
		grid-template-columns: 1fr min(65ch, 100%) 1fr;
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
	.prose-container > * {
		grid-column: 2;
	}
	.question-grid {
		display: grid;
		grid-template-columns: auto auto 1fr auto;
		align-items: flex-start;
		gap: 0.5rem;
	}
	.body-content {
		max-width: 65ch;
		line-height: 1.75;
	}
	/* .part-label ~ .body-content {
		padding-inline-start: 0.5rem;
	} */
	.marks {
		align-self: flex-end;
	}
	.part-label {
		line-height: 1.75;
	}
	.subpart-label {
		grid-column: 2;
	}
	.part-uplevel {
		grid-column: 1 / span 4;
	}
	.subpart-uplevel {
		grid-column: 2 / span 3;
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
	.no-break {
		white-space: nowrap;
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
		display: inline-block;

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
