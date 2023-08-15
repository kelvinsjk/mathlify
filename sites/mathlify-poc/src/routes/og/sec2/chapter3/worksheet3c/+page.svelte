<script lang="ts">
	import Question from '$lib/components/Question.svelte';
	import type { Part, Question as QuestionType } from '$lib/components/types';
	import {
		ExpansionTerm,
		Expression,
		Fraction,
		Polynomial,
		SLE,
		Term,
		UnsimplifiedExpression,
	} from 'mathlify';
	import { alignatStar, display, math } from 'mathlifier';

	const title = `Expansion of quadratic expressions`;

	// TODO: Q2, Q4: complicated expansions

	const questions: QuestionType[] = [];
	const answers: QuestionType[] = [];

	const expandText = 'Expand each of the following expressions';
	const a = new Term('a');
	const b = new Term('b');
	const x = new Term('x');
	const y = new Term('y');
	const x2 = new Term(['x', 2]);
	const y2 = new Term(['y', 2]);

	let qnNo = 0;
	//! Question 1
	(() => {
		qnNo++;
		const parts: Part[] = [];
		const ansParts: Part[] = [];
		const terms = [
			[x.times(5), new Expression(x.times(2), 2)],
			[x.times(6), new Expression(10, x.times(-1))],
			[x.times(-4), new Expression(x.times(8), 3)],
			[x.negative(), new Expression(7, x.times(-9))],
		];
		terms.forEach((exps) => {
			const qn = new ExpansionTerm(...exps);
			const ans = qn.expand();
			parts.push({
				body: math(`${qn}`),
			});
			ansParts.push({
				body: math(`${ans}.`),
			});
		});
		questions.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span> ${expandText}.`,
			parts,
		});
		answers.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span>`,
			parts: ansParts,
		});
	})();

	//! Question 2 (Q3 from book)
	(() => {
		qnNo++;
		const parts: Part[] = [];
		const ansParts: Part[] = [];
		const xy = new Term('x', 'y');
		const terms = [
			[x.times(3), new Expression(x.times(6), y.times(-11))],
			[x.times(-8), new Expression(y.times(5), x2.times(9))],
			[xy.times(2), new Expression(x2.times(7), y, -4)],
			[xy.times(-4), new Expression(x.times('z'), y2.times(-10), new Term('z'))],
		];
		terms.forEach((exps) => {
			const qn = new ExpansionTerm(...exps);
			const ans = qn.expand();
			parts.push({
				body: math(`${qn}`),
			});
			ansParts.push({
				body: math(`${ans}.`, { wrap: true }),
			});
		});
		questions.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span> ${expandText}.`,
			parts,
		});
		answers.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span>`,
			parts: ansParts,
		});
	})();

	//! Question 3 (Q5 from book)
	(() => {
		qnNo++;
		const parts: Part[] = [];
		const ansParts: Part[] = [];
		const coeffsArray: [number[], number[]][] = [
			[
				[1, 8],
				[1, 2],
			],
			[
				[1, 9],
				[1, -3],
			],
			[
				[2, -7],
				[1, 4],
			],
			[
				[1, -5],
				[11, -6],
			],
			[
				[4, 5],
				[2, 9],
			],
			[
				[7, 2],
				[3, -1],
			],
			[
				[9, -2],
				[1, 6],
			],
			[
				[3, -8],
				[2, -8],
			],
			[
				[8, 3],
				[6, 7],
			], // ascending start
			[
				[10, 1],
				[5, -10],
			],
			[
				[7, -5],
				[4, 5],
			],
			[
				[12, -7],
				[9, -2],
			],
		];
		coeffsArray.forEach(([coeffs1, coeffs2], i) => {
			const poly1 = new Polynomial(coeffs1, { ascending: i >= 8 });
			const poly2 = new Polynomial(coeffs2, { ascending: i >= 8 });
			const qn = new ExpansionTerm(poly1, poly2);
			const ans = qn.expand();
			parts.push({
				body: math(`${qn}`),
			});
			ansParts.push({
				body: math(`${ans}.`, { wrap: true }),
			});
		});
		questions.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span> ${expandText}.`,
			parts,
		});
		answers.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span>`,
			parts: ansParts,
		});
	})();

	//! Question 4 (Q7 from book)
	(() => {
		qnNo++;
		const parts: Part[] = [];
		const ansParts: Part[] = [];
		const terms = [
			[new Expression(x, y.times(2)), new Expression(x, y)],
			[new Expression(x, y.times(5)), new Expression(x, y.negative())],
			[new Expression(x, y.negative()), new Expression(x.times(8), y)],
			[new Expression(x, y.times(-4)), new Expression(x, y.times(-5))],
			[new Expression(x.times(4), y.times(7)), new Expression(x.times(10), y.times(9))],
			[new Expression(x.times(3), y.times(7)), new Expression(x.times(3), y.times(-8))],
			[new Expression(x.times(8), y.times(-5)), new Expression(x.times(6), y.times(5))],
			[new Expression(x.times(11), y.times(-6)), new Expression(x.times(12), y.times(-1))],
			[new Expression(y.times(3), x.times(8)), new Expression(y.times(4), x.times(5))],
			[new Expression(y.times(2), x.times(9)), new Expression(y.times(5), x.times(-6))],
			[new Expression(y.times(6), x.times(-7)), new Expression(y.times(12), x.times(1))],
			[new Expression(y.times(8), x.times(-5)), new Expression(y.times(8), x.times(-3))],
		];
		terms.forEach((exps) => {
			const qn = new ExpansionTerm(...exps);
			const ans = qn.expand();
			parts.push({
				body: math(`${qn}`),
			});
			ansParts.push({
				body: math(`${ans}.`, { wrap: true }),
			});
		});
		questions.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span> ${expandText}.`,
			parts,
		});
		answers.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span>`,
			parts: ansParts,
		});
	})();
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<section aria-labelledby="title" class="prose mx-auto">
	<h2 id="title">{@html title}</h2>
	<h3>Questions</h3>
	{#each questions as question}
		<Question {question} />
	{/each}
	<h3>Answers</h3>
	{#each answers as question}
		<Question {question} />
	{/each}
</section>
