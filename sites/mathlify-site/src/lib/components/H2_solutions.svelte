<script lang="ts">
	import { Djot } from 'svelte-djot-math';
	import Content from './mathlified/Content.svelte';
	import SequentialNav from './mathlified/SequentialNav.svelte';
	import type { AnswerObject } from '$lib/classes/answer';
	let {
		data
	}: {
		data:
			| { isMd: true; content: string }
			| { isMd: false; title: string; answer: AnswerObject; solution: AnswerObject };
		module: null | Promise<unknown>;
	} = $props();
	let [answer, solution] = $derived(data.isMd ? [{}, {}] : [data.answer, data.solution]);

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

{#if data.isMd}
	<Content content={data.content} />
{:else}
	<div class="main-container">
		<div class="prose-container">
			<h1>{data.title}</h1>
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
									<a
										id={`ans-${i + 1}-${j + 1}`}
										href={`#soln-${i + 1}-${j + 1}`}
										class="part-label">({String.fromCharCode(i + 97)}{toRoman(j)})</a
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
									<a
										id={`soln-${i + 1}-${j + 1}`}
										href={`#ans-${i + 1}-${j + 1}`}
										class="part-label">({String.fromCharCode(i + 97)}{toRoman(j)})</a
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
				<SequentialNav />
			</div>
		</div>
	</div>
{/if}

<style>
	.main-container {
		width: 100%;
		height: 100%;
		overflow-y: auto;
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
	h1 {
		padding-inline: 1rem;
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
</style>
