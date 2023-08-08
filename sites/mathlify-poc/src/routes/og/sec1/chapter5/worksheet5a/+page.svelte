<script lang="ts">
	import Question from '$lib/components/Question.svelte';
	import type { Part, Question as QuestionType } from '$lib/components/types';
	import { math, newParagraph } from 'mathlifier';
	import { ExpansionTerm, Fraction, Polynomial, solveLinear } from 'mathlify';

	const title = 'Linear equations with integer coefficients';

	// TODO: Q1p, 2o-p: float

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
		q.forEach((q) => {
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

	//! Q2g-n
	const lhsMultiples = [2, -6, 30, 14, 4, 1, 3, 7];
	const lhsPolys = [
		new Polynomial([4, 1]),
		new Polynomial([1, -1]),
		new Polynomial([1]),
		new Polynomial([1]),
		new Polynomial([9, 4]),
		new Polynomial(21),
		new Polynomial([1, 1]),
		new Polynomial([7, new Fraction(1, 2)]),
	];
	const rhsMultiples = [16, 18, 5, -7, 1, 3, 8, 5];
	const rhsPolys = [
		new Polynomial([1]),
		new Polynomial([1]),
		new Polynomial([3, -2]),
		new Polynomial([2, 7]),
		new Polynomial([19, -1]),
		new Polynomial([8, 5]),
		new Polynomial([1, new Fraction(-1, 4)]),
		new Polynomial([5, new Fraction(-1, 2)]),
	];
	const parts: Part[] = [];
	lhsMultiples.forEach((lhsM, i) => {
		const lhsPoly = lhsPolys[i];
		const rhsM = rhsMultiples[i];
		const rhsPoly = rhsPolys[i];
		// qn. handle edge case q4n first
		if (i === 7) {
			const qn = `${new ExpansionTerm(lhsM, lhsPoly)} - ${new ExpansionTerm(rhsM, rhsPoly)} = 0`;
			const ans = solveLinear(lhsPoly.times(lhsM), rhsPoly.times(rhsM));
			parts.push({
				body: `${math(`${qn}`)}
					${newParagraph}
					Answer: ${math(`${ans}`)}
				`,
			});
		} else {
			const lhs =
				`${lhsPoly}` === '1'
					? `${lhsM}`
					: lhsM === 1
					? `${lhsPoly}`
					: `${new ExpansionTerm(lhsM, lhsPoly)}`;
			const rhs =
				`${rhsPoly}` === '1'
					? `${rhsM}`
					: rhsM === 1
					? `${rhsPoly}`
					: `${new ExpansionTerm(rhsM, rhsPoly)}`;
			const qn = `${lhs} = ${rhs}`;
			const ans = solveLinear(lhsPoly.times(lhsM), rhsPoly.times(rhsM));
			parts.push({
				body: `${math(`${qn}`)}
					${newParagraph}
					Answer: ${math(`${ans}`)}
				`,
			});
		}
	});
	questions.push({
		body: `<span class="font-semibold mx-2">3.</span> Solve each of the following equations.`,
		parts: parts,
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
