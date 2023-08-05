<script lang="ts">
	import Question from '$lib/components/Question.svelte';
	import type { Part, Question as QuestionType } from '$lib/components/types';
	import { math, newParagraph } from 'mathlifier';
	import { Fraction, Polynomial, solveLinear } from 'mathlify';

	const title = 'Linear equations with integer coefficients';

	// TODO: Q1p: float
	// TODO: Q2g-p: expansion term

	//! Question 1
	const vars1 = [
		[new Polynomial([1, 4]), 15],
		[new Polynomial([1, 7]), -7],
		[new Polynomial([1, -6]), 10],
		[new Polynomial([1, -12]), -1],
		[new Polynomial(3), 27],
		[new Polynomial(5), -55],
		[new Polynomial(-2), 42],
		[new Polynomial(-6), -84],
		[new Polynomial([9, 1]), 82],
		[new Polynomial([4, -3]), 25],
		[new Polynomial([7, 10]), -4],
		[new Polynomial([2, -9]), -9],
		[new Polynomial([2, -5], { ascending: true }), 67],
		[new Polynomial([11, -3], { ascending: true }), -16],
		[new Polynomial([4, 1]), new Fraction(-3, 5)],
	];

	//! Question 2
	const vars2 = [
		[new Polynomial(3), new Polynomial([2, 25])],
		[new Polynomial(7), new Polynomial([1, 12])],
		[new Polynomial([9, -14]), new Polynomial(2)],
		[new Polynomial([5, 1]), new Polynomial([4, 6])],
		[new Polynomial([10, -3]), new Polynomial([8, -17])],
		[new Polynomial([11, -2], { ascending: true }), new Polynomial([5, -3], { ascending: true })],
	];

	//! Compiled questions
	const qnArray = [vars1, vars2];
	const preamble = () => {
		return `Solve each of the following equations.`;
	};

	const questions: QuestionType[] = [];
	qnArray.forEach((q, i) => {
		const parts: Part[] = [];
		q.forEach((q, j) => {
			parts.push({
				body: `${math(`${q[0]} = ${q[1]}`)}
					${newParagraph}
					Answer: ${math(`${solveLinear(q[0], q[1])}`)}
				`,
			});
		});
		questions.push({
			body: `<span class="font-semibold mx-2">${i + 1}.</span> ${preamble()}`,
			parts: parts,
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
