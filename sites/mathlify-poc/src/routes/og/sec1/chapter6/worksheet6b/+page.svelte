<script lang="ts">
	import Question from '$lib/components/Question.svelte';
	import type { Part, Question as QuestionType } from '$lib/components/types';
	import {
		ExpansionTerm,
		Fraction,
		Term,
		Expression,
		Polynomial,
		solveLinear,
		UnsimplifiedExpression,
		RationalTerm,
		EquationWorking,
	} from 'mathlify';
	import { alignStar, math, newParagraph } from 'mathlifier';

	const title = 'Functions and linear functions';

	// TODO: Q4: floats
	// TODO: Q3: mixed fractions

	const polys = [
		new Polynomial([4, 1]),
		new Polynomial([7, -2], { ascending: true }),
		new Polynomial([new Fraction(1, 6), -3]),
	];
	const vars = [
		{ x: 2, y: -3 },
		{ x: new Fraction(-1, 2), y: 5 },
		{ x: -6, y: new Fraction(9, 5) },
	];
	const questions: QuestionType[] = [];
	const answers: QuestionType[] = [];
	polys.forEach((poly, i) => {
		const body = `<span class="font-semibold mx-2">${
			i + 1
		}.</span> The equation of a function is ${math(`y=${poly}.`)}
			${newParagraph}
			Find
		`;
		const partA = `the value of ${math('y')} when ${math(`x=${vars[i].x},`)}`;
		const partB = `the value of ${math('x')} when ${math(`y=${vars[i].y}.`)}`;
		questions.push({
			body,
			parts: [{ body: partA }, { body: partB }],
		});
		const ansI = poly.subIn(vars[i].x);
		const ansII = solveLinear(poly, vars[i].y);
		answers.push({
			body: `<span class="font-semibold mx-2">${i + 1}.</span>`,
			parts: [{ body: `${math(`y=${ansI},`)}` }, { body: `${math(`x=${ansII}.`)}` }],
		});
	});
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<section aria-labelledby="title" class="prose mx-auto">
	<h2 id="title">{title}</h2>
	{#each questions as question}
		<Question {question} />
	{/each}
	{#each answers as question}
		<Question {question} />
	{/each}
</section>
