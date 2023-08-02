<script lang="ts">
	import Question from '$lib/components/Question.svelte';
	import type { Part, Question as QuestionType } from '$lib/components/types';
	import { UnsimplifiedExpression, Fraction, Term, Expression } from 'mathlify';
	import { alignStar, display, math, newParagraph } from 'mathlifier';

	const title = 'Basic algebraic concepts and notations';

	const simplifyString = 'Simplify each of the following';

	// TODO: Word problems: sum/subtract
	// TODO: Sub in working
	// TODO: Expansion: Q7b, 9c, 10d
	// TODO: RationalTerm: Q8c, 10c
	// TODO: Surds: Q8d, 9d
	// TODO: powers: Q10b,d

	//! Question 1
	const x = 5,
		y = -2;
	const exps1 = [
		new Expression([4, 'x'], [9, 'y']),
		new Expression([4, 'x'], [-9, 'y']),
		new Expression([3, 'x', 'y']),
		new Term('x', 'y', new Fraction(1, 3)).setFractionalDisplay()
	];
	const a1s = exps1.map((exp) => exp.subIn({ x, y }));
	const xys1 = { x, y };

	//! Compiled questions
	const qnArray = [exps1];
	const ansArray = [a1s];
	const xyArray = [xys1];
	const preamble = (xys: { x: number; y: number }) => {
		return `Given that ${math(`x=${xys.x}`)} and ${math(`y=${xys.y},`)}
			find the value of each of the following expressions.
		`;
	};

	const questions: QuestionType[] = [];
	qnArray.forEach((q, i) => {
		const parts: Part[] = [];
		q.forEach((q, j) => {
			parts.push({
				body: `${math(`${q}`)}
					${newParagraph}
					Answer: ${math(`${ansArray[i][j]}`)}
				`
			});
		});
		questions.push({
			body: `<span class="font-semibold mx-2">${i + 1}.</span> ${preamble(xyArray[i])}`,
			parts: parts
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
</section>
