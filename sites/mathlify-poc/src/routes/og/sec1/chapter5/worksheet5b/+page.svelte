<script lang="ts">
	import Question from '$lib/components/Question.svelte';
	import type { Part, Question as QuestionType } from '$lib/components/types';
	import { ExpansionTerm, Fraction, Term, Expression, Polynomial, solveLinear, UnsimplifiedExpression } from 'mathlify';
	import { math, newParagraph } from 'mathlifier';

	const title = 'Linear equations with fractional coefficients and fractional equations';

	// TODO: Q2-3: eqn working and rational term handling and casting to polynomial

	//! Question 1a-h
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
	const qnArray = [vars1];
	const preamble = () => {
		return `Solve each of the following equations.`;
	};
	let parts: Part[] = [];
	const questions: QuestionType[] = [];
	qnArray.forEach((q, i) => {
		q.forEach((q) => {
			parts.push({
				body: `${math(`${q[0]} = ${q[1]}`)}
					${newParagraph}
					Answer: ${math(`${solveLinear(q[0], q[1])}`)}
				`,
			});
		});
	});

	//! Q1i-l
	const lhsMultiples = [1, 1, new Fraction(1, 2), new Fraction(1, 8)];
	const lhsPolys = [
		new Polynomial([3, new Fraction(-5, 6)], { ascending: true }),
		new Polynomial([new Fraction(3, 5), 4]),
		new Polynomial([1, 1]),
		new Polynomial([5, 7]),
	];
	const rhsMultiples = [1, new Fraction(1, 2), new Fraction(1, 3), new Fraction(4, 9)];
	const rhsPolys = [
		new Polynomial([new Fraction(-2, 9), -8]),
		new Polynomial([1, -1]),
		new Polynomial([2, -1]),
		new Polynomial([2, -3]),
	];

	//! Q1i-l: expansion
	lhsMultiples.forEach((lhsM, i) => {
		const lhsPoly = lhsPolys[i];
		const rhsM = rhsMultiples[i];
		const rhsPoly = rhsPolys[i];
		// qn. handle edge case q1l first
		if (i === 3) {
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
		body: `<span class="font-semibold mx-2">${1}.</span> ${preamble()}`,
		parts: parts,
	});


	//! Q2a-d
	// TODO: Q2b, d: negative coefficients
	const q2ADLhs: ((number|Fraction)[])[] = [
		[1, new Fraction(1,8)],
		[5, new Fraction(-1, 3)],
		[new Fraction(1, 2), new Fraction(1, 7)],
		[new Fraction(1, 4), new Fraction(-1, 9)],
	];
	const q2ADRhs = [27, 42, 5, 10];
	parts = [];
	q2ADLhs.forEach(([a,b],i)=>{
		const t1 = new Polynomial(a);
		const t2 = new Polynomial(b);
		const rhs = q2ADRhs[i];
		const qn = `${new UnsimplifiedExpression(t1.terms[0],t2.terms[0])} = ${rhs}`;
		const ans = solveLinear(t1.plus(t2), rhs);
		parts.push({
				body: `${math(`${qn}`)}
					${newParagraph}
					Answer: ${math(`${ans}`)}
				`,
			});
	})
	questions.push({
		body: `<span class="font-semibold mx-2">${2}.</span> ${preamble()}`,
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
