<script lang="ts">
	import Question from '$lib/components/Question.svelte';
	import type { Part, Question as QuestionType } from '$lib/components/types';
	import { RationalTerm, Term, Expression, Fraction, UnsimplifiedExpression } from 'mathlify';
	import { alignStar } from 'mathlifier';

	const title = 'Linear expressions with fractional coefficients';

	// TODO: Q3a,i: further simplification of RationalTerm

	const questions: QuestionType[] = [];

	//! Question 1
	const exp1 = [
		new UnsimplifiedExpression(
			[new Fraction(1, 5), 'x'],
			[new Fraction(1, 4), 'y'],
			[new Fraction(1, 7), 'x'],
			[new Fraction(1, 8), 'y'],
		),
		new UnsimplifiedExpression(
			[new Fraction(2, 3), 'x'],
			{ term: new Term(new Fraction(1, 2), 'y'), addition: false },
			{ term: new Term(new Fraction(1, 6), 'x'), addition: false },
			[new Fraction(2, 5), 'y'],
		),
		new UnsimplifiedExpression(
			[new Fraction(3), 'x'],
			{ term: new Term(new Fraction(6, 7), 'y'), addition: false },
			[new Fraction(4, 5), 'x'],
			{ term: new Term(new Fraction(9, 14), 'y'), addition: false },
		),
		new UnsimplifiedExpression(
			[new Fraction(5, 6), 'x'],
			{ term: new Term(new Fraction(3, 4), 'y'), addition: false },
			'z',
			[new Fraction(3, 4), 'x'],
			{ term: new Term(2, 'y'), addition: false },
			[new Fraction(1, 2), 'z'],
		),
	];
	let parts: Part[] = [];
	exp1.forEach((exp) => {
		parts.push({
			body: `${alignStar(`& ${exp}
				\\\\ &= ${exp.simplify()}
			`)}`,
		});
	});
	questions.push({
		body: `<span class="font-semibold mx-2">1.</span> ${preamble()}`,
		parts: parts,
	});

	//! Question 2 (3 from book)
	const exp2: [number | Fraction | RationalTerm, number | Fraction | Term | RationalTerm][] = [
		[1, new RationalTerm(new Term(5, 'x'), 14)],
		[new RationalTerm(new Term(6, 'x'), 11), -3],
		[new Fraction(7, 8), new Term(-1, 'x')],
		[new Fraction(2, 9), new Term(4, 'x')],
	];
	parts = [];
	exp2.forEach(([t1, t2]) => {
		const t1R =
			typeof t1 === 'number'
				? new RationalTerm(t1)
				: t1 instanceof Fraction
				? new RationalTerm(t1.num, t1.den)
				: t1;
		const t1T = t1 instanceof RationalTerm ? `${t1}` : t1;
		const t2T = t2 instanceof RationalTerm ? `${t2}` : t2;
		parts.push({
			body: `${alignStar(`& ${new Expression(t1T, t2T)}
				\\\\ &= ${t1R.plus(t2)}
			`)}`,
		});
	});
	questions.push({
		body: `<span class="font-semibold mx-2">2.</span> ${preamble()}`,
		parts: parts,
	});

	//! Question 3 (4 from book)
	// term1, addition?, term2
	// for q6(g), leading term is negative
	// for q8-9(i-j), three terms
	const exp3: [RationalTerm, boolean, RationalTerm][] = [
		[new RationalTerm(new Term(3, 'x'), 4), true, new RationalTerm(new Term(7, 'x'), 12)],
		[new RationalTerm(new Term(2, 'x'), 3), false, new RationalTerm(new Term(2, 'x'), 9)],
		[new RationalTerm('x'), true, new RationalTerm([new Term(5, 'x'), -3], 6)],
		[new RationalTerm([1, new Term(-5, 'x')], 8), false, new RationalTerm(new Term(6, 'x'))],
		[new RationalTerm('x', 8), true, new RationalTerm([new Term(4, 'x'), -1], 2)],
		[new RationalTerm(new Term(3, 'x'), 5), false, new RationalTerm([new Term('x'), 1], 4)],
		[new RationalTerm([7, new Term(-1, 'x')], 2), false, new RationalTerm('x', 10)],
		[
			new RationalTerm([new Term(7, 'x'), -4], 9),
			true,
			new RationalTerm([new Term(8, 'x'), -3], 5),
		],
	];
	parts = [];
	exp3.forEach(([t1, addition, t2], i) => {
		const sign = addition ? '+' : '-';
		const ans = i === 6 ? t1.negative().minus(t2) : addition ? t1.plus(t2) : t1.minus(t2);
		const preNegative = i === 6 ? '-' : '';
		parts.push({
			body: `${alignStar(`&${preNegative}${t1} ${sign} ${t2}
				\\\\ &= ${ans}
			`)}`,
		});
	});
	//! Q4i-j
	const q4iT1 = new RationalTerm([new Term(9, 'x'), 1], 6);
	const q4iT2 = new RationalTerm([new Term(10, 'x'), -3], 7);
	const q4iT3 = new Fraction(1, 3);
	const ans4i = q4iT1.minus(q4iT2).plus(q4iT3);
	parts.push({
		body: `${alignStar(`& ${q4iT1} - ${q4iT2} + ${q4iT3}
			\\\\ &= ${ans4i}
		`)}`,
	});
	const q4jT1 = new RationalTerm([new Term(2, 'x'), 5], 4);
	const q4jT2 = new RationalTerm('x', 6);
	const q4jT3 = new RationalTerm([7, new Term(-6, 'x')], 8);
	const ans4j = q4jT1.minus(q4jT2).minus(q4jT3);
	parts.push({
		body: `${alignStar(`& ${q4jT1} - ${q4jT2} - ${q4jT3}
			\\\\ &= ${ans4j}
		`)}`,
	});
	questions.push({
		body: `<span class="font-semibold mx-2">3.</span> ${preamble()}`,
		parts: parts,
	});

	function preamble() {
		return `Expand each of the following expressions.`;
	}
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
