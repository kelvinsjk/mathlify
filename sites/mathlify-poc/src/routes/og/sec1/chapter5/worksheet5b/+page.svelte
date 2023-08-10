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
		GeneralEquation,
	} from 'mathlify';
	import { alignStar, math, newParagraph } from 'mathlifier';

	const title = 'Linear equations with fractional coefficients and fractional equations';

	// TODO: Q2j-k: combination of expansion term within rational term

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
	const q2ADLhs: (number | Fraction)[][] = [
		[1, new Fraction(1, 8)],
		[5, new Fraction(1, 3)],
		[new Fraction(1, 2), new Fraction(1, 7)],
		[new Fraction(1, 4), new Fraction(1, 9)],
	];
	const additions = [true, false, true, false];
	const q2ADRhs = [27, 42, 5, 10];
	parts = [];
	q2ADLhs.forEach(([a, b], i) => {
		const t1 = new Polynomial(a);
		const t2 = new Polynomial(b);
		const rhs = q2ADRhs[i];
		const addition = additions[i];
		const qn = `${new UnsimplifiedExpression(t1.terms[0], {
			term: t2.terms[0],
			addition,
		})} = ${rhs}`;
		const lhs = addition ? t1.plus(t2) : t1.minus(t2);
		const ans = solveLinear(lhs, rhs);
		parts.push({
			body: `${math(`${qn}`)}
					${newParagraph}
					Answer: ${math(`${ans}`)}
				`,
		});
	});

	//! Q2e-h
	// q2e
	(() => {
		const term1 = new RationalTerm([new Term(4, 'x'), -1], 9);
		const rhs = 3;
		const eqn = new GeneralEquation(term1, rhs);
		let body = `${math(`${eqn}`)}`;
		eqn.setAligned();
		eqn.crossMultiply();
		eqn.plus(1);
		eqn.divide(4);
		body += `${alignStar(`${eqn}`)}`;
		parts.push({
			body,
		});
	})();
	// q2f
	(() => {
		const term1a = new RationalTerm([new Term(7, 'x'), 2], 6);
		const lhs = new Expression(term1a, -4);
		const eqn = new GeneralEquation(lhs);
		let body = `${math(`${eqn}`)}`;
		eqn.setAligned();
		eqn.plus(4);
		eqn.crossMultiply();
		eqn.minus(2);
		eqn.divide(7);
		body += `${alignStar(`${eqn}`)}`;
		parts.push({
			body,
		});
	})();
	// q2g
	(() => {
		const term1a = new RationalTerm(new Term(5, 'x'), 6);
		const term1b = new RationalTerm(['x', -1], 3);
		const lhs = new Expression(term1a, term1b);
		const eqn = new GeneralEquation(lhs);
		let body = `${math(`${eqn}`)}`;
		eqn.setAligned();
		eqn.moveTerm(1);
		eqn.crossMultiply();
		eqn.plus(new Term(6, 'x'));
		eqn.divide(21);
		body += `${alignStar(`${eqn}`)}`;
		parts.push({
			body,
		});
	})();
	questions.push({
		body: `<span class="font-semibold mx-2">${2}.</span> ${preamble()}`,
		parts: parts,
	});
	// q2h
	(() => {
		const term1a = new RationalTerm([new Term(3, 'x'), 7], 8);
		const term1b = new RationalTerm([new Term(2, 'x'), 1], 5, { coeff: -1 });
		const lhs = new Expression(term1a, term1b);
		const eqn = new GeneralEquation(lhs);
		let body = `${math(`${eqn}`)}`;
		eqn.setAligned();
		eqn.moveTerm(1);
		eqn.crossMultiply();
		eqn.swap();
		eqn.minus(new Expression(eqn.lhs.terms[1], eqn.rhs.terms[0]));
		body += `${alignStar(`${eqn}`)}`;
		parts.push({
			body,
		});
	})();
	questions.push({
		body: `<span class="font-semibold mx-2">${2}.</span> ${preamble()}`,
		parts: parts,
	});
	// q2i
	(() => {
		const term1a = 1;
		const term1b = new RationalTerm('x', 4, { coeff: -1 });
		const lhs = new Expression(term1a, term1b);
		const rhs = new RationalTerm(new Expression(new Term(5, 'x'), 8), 8);
		const eqn = new GeneralEquation(lhs, rhs);
		let body = `${math(`${eqn}`)}`;
		eqn.setAligned();
		eqn.combineRationalTerms();
		eqn.crossMultiply();
		eqn.swap();
		eqn.minus(new Expression(eqn.lhs.terms[1], eqn.rhs.terms[1]));
		eqn.divide(28);
		body += `${alignStar(`${eqn}`)}`;
		parts.push({
			body,
		});
	})();
	// q2l
	(() => {
		const term1a = new Term(2, 'x');
		const term1b = new RationalTerm([2, new Term(-5, 'x')], 7);
		const lhs = new Expression(term1a, term1b);
		const term2a = new RationalTerm([new Term(20, 'x'), -9], 6);
		const term2b = 11;
		const rhs = new Expression(term2a, term2b);
		const eqn = new GeneralEquation(lhs, rhs);
		let body = `${math(`${eqn}`)}`;
		eqn.setAligned();
		eqn.combineRationalTerms();
		eqn.crossMultiply();
		eqn.swap();
		eqn.minus(new Expression(eqn.lhs.terms[1], eqn.rhs.terms[0]));
		eqn.divide(86);
		body += `${alignStar(`${eqn}`)}`;
		parts.push({
			body,
		});
	})();
	questions.push({
		body: `<span class="font-semibold mx-2">${2}.</span> ${preamble()}`,
		parts: parts,
	});

	//! Question 3
	//! 3a-d: cross multiplication
	//! Q3a-d
	parts = [];
	const q3LHS: (number | Fraction | RationalTerm)[] = [
		new RationalTerm(10, ['x', 1]),
		new RationalTerm(32, ['x', -3]),
		new RationalTerm(21, [new Term(4, 'x'), 6]),
		9,
	];
	const q3RHS = [5, 8, -7, new RationalTerm(45, [1, new Term(-2, 'x')])];
	q3LHS.forEach((lhs, i) => {
		const eqn = new GeneralEquation(lhs, q3RHS[i]);
		let body = `${math(`${eqn}`)}`;
		eqn.setAligned();
		eqn.crossMultiply();
		if (i !== 3) {
			eqn.swap();
			eqn.moveTerm(1);
		} else {
			eqn.moveTerm(0);
		}
		const coeff = eqn.lhs.terms[0].coeff;
		eqn.divide(coeff);
		body += `${alignStar(`${eqn}`)}`;
		parts.push({
			body,
		});
	});
	//! Q3e-f: move constant over
	// q3e
	(() => {
		const term1a = new RationalTerm(28, [new Term(5, 'x'), 3]);
		const term1b = -1;
		const lhs = new Expression(term1a, term1b);
		const rhs = new Fraction(3, 4);
		const eqn = new GeneralEquation(lhs, rhs);
		let body = `${math(`${eqn}`)}`;
		eqn.setAligned();
		eqn.moveTerm(1);
		eqn.crossMultiply();
		eqn.swap();
		eqn.moveTerm(1);
		const coeff = eqn.lhs.terms[0].coeff;
		eqn.divide(coeff);
		body += `${alignStar(`${eqn}`)}`;
		parts.push({
			body,
		});
	})();
	// q3f
	(() => {
		const term1a = new RationalTerm(1, [new Term('x'), 6]);
		const term1b = 1;
		const rhs = new Expression(term1a, term1b);
		const lhs = new Fraction(6, 7);
		const eqn = new GeneralEquation(lhs, rhs);
		let body = `${math(`${eqn}`)}`;
		eqn.setAligned();
		eqn.moveTerm(1, { from: 'rhs' });
		eqn.crossMultiply();
		eqn.moveTerm(1);
		const coeff = eqn.lhs.terms[0].coeff;
		eqn.divide(coeff);
		body += `${alignStar(`${eqn}`)}`;
		parts.push({
			body,
		});
	})();
	//! 3g-j: cross multiplication
	//! Q3a-d
	const q3LHS2: (number | Fraction | RationalTerm)[] = [
		new RationalTerm(['x', 7], ['x', 9]),
		new RationalTerm([new Term(3, 'x'), -2], [new Term(4, 'x'), 2]),
		new RationalTerm(8, [new Term('x'), -3]),
		new RationalTerm(4, [new Term(5, 'x'), 12]),
	];
	const q3RHS2 = [
		new Fraction(15, 19),
		6,
		new RationalTerm(3, [new Term('x'), 4]),
		new RationalTerm(2, [new Term(2, 'x'), -11]),
	];
	q3LHS2.forEach((lhs, i) => {
		const eqn = new GeneralEquation(lhs, q3RHS2[i]);
		let body = `${math(`${eqn}`)}`;
		eqn.setAligned();
		eqn.crossMultiply();
		if (i === 1 || i === 3) {
			eqn.swap();
		}
		eqn.minus(new Expression(eqn.lhs.terms[1], eqn.rhs.terms[0]));

		const coeff = eqn.lhs.terms[0].coeff;
		eqn.divide(coeff);
		body += `${alignStar(`${eqn}`)}`;
		parts.push({
			body,
		});
	});
	questions.push({
		body: `<span class="font-semibold mx-2">${3}.</span> ${preamble()}`,
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
