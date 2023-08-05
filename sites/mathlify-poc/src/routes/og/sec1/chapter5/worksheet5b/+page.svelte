<script lang="ts">
	import Question from '$lib/components/Question.svelte';
	import type { Part, Question as QuestionType } from '$lib/components/types';
	import { RationalTerm, Fraction, Term, Expression, Polynomial, solveLinear } from 'mathlify';
	import { math, newParagraph } from 'mathlifier';

	const title = 'Linear equations with fractional coefficients and fractional equations';

	// TODO: Q1j-l: expansion term
	// TODO: Q2-3: eqn working and rational term handling and casting to polynomial

	//! Question 1
	const vars1 = [
		[new Polynomial(new Fraction(1, 6)), 3],
		[new Polynomial(new Fraction(2, 5)), 4],
		[new Polynomial([new Fraction(1, 4), 5]), 9],
		[new Polynomial([new Fraction(3, 8), -1]), 2],
		[new Polynomial([new Fraction(-2, 3), 7]), 1],
		[new Polynomial([10, new Fraction(-3, 4)], { ascending: true }), -5],
		[new Polynomial(1), new Polynomial([new Fraction(4, 5), -6])],
		[new Polynomial(new Fraction(2, 7)), new Polynomial([3, 19])],
		[
			new Polynomial([3, new Fraction(-5, 6)], { ascending: true }),
			new Polynomial([new Fraction(-2, 9), -8]),
		],
	];

	//! Question 2
	const vars2 = [
		[new Polynomial(new Fraction(1, 6)), 3],
		[new Polynomial(new Fraction(2, 5)), 4],
		[new Polynomial([new Fraction(1, 4), 5]), 9],
		[new Polynomial([new Fraction(3, 8), -1]), 2],
		[new Polynomial([new Fraction(-2, 3), 7]), 1],
		[new Polynomial([10, new Fraction(-3, 4)], { ascending: true }), -5],
		[new Polynomial(1), new Polynomial([new Fraction(4, 5), -6])],
		[new Polynomial(new Fraction(2, 7)), new Polynomial([3, 19])],
		[
			new Polynomial([3, new Fraction(-5, 6)], { ascending: true }),
			new Polynomial([new Fraction(-2, 9), -8]),
		],
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
