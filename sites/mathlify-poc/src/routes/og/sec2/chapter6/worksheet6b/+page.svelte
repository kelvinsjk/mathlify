<script lang="ts">
	import Question from '$lib/components/Question.svelte';
	import type { Part, Question as QuestionType } from '$lib/components/types';
	import { ExpansionTerm, Expression, Fraction, SLE, Term, UnsimplifiedExpression } from 'mathlify';
	import { alignatStar, display, math } from 'mathlifier';

	const titleTop = `Expansion of algebraic expressions`;
	const title = `Expansion of algebraic expressions of the form ${math(`(a+b)(c+d)`)}`;

	// TODO: Q2: complicated expansions

	const questions: QuestionType[] = [];
	const answers: QuestionType[] = [];

	const expandText = 'Expand each of the following expressions';
	const a = new Term('a');
	const b = new Term('b');
	const x = new Term('x');
	const y = new Term('y');
	const x2 = new Term(['x', 2]);
	const y2 = new Term(['y', 2]);

	//! Question 1
	(() => {
		const qnNo = 1;
		const parts: Part[] = [];
		const ansParts: Part[] = [];
		const terms = [
			[7, new Expression(x.times(5), 4)],
			[3, new Expression(x.times(9), -8)],
			[-2, new Expression(x.times(6), 1)],
			[-1, new Expression(10, x.times(-4))],
			[a.times(6), new Expression(x.times(2), y.times(7))],
			[a.times(4), new Expression(y.times(3), x.times(-20))],
			[a.times(-3), new Expression(y, x.times(8))],
			[a.times(-5), new Expression(x.times(2), y.times(-9))],
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
		const qnNo = 2;
		const parts: Part[] = [];
		const ansParts: Part[] = [];
		const h = new Term('h');
		const k = new Term('k');
		const m = new Term('m');
		const n = new Term('n');
		const z = new Term('z');
		const terms = [
			[new Expression(a, b), new Expression(x, y)],
			[new Expression(a, b), new Expression(x, y.negative())],
			[new Expression(a, b.negative()), new Expression(x, y)],
			[new Expression(a, b.negative()), new Expression(x, y.negative())],
			[new Expression(h.times(2), k), new Expression(x.times(7), y)],
			[new Expression(h.times(3), k.times(4)), new Expression(x.times(9), y.times(-2))],
			[new Expression(h, k.times(-6)), new Expression(x.times(4), y.times(5))],
			[new Expression(h.times(5), k.negative()), new Expression(x, y.times(-10))],
			[new Expression(m, n), new Expression(x.times(3), y.times(8), z)],
			[
				new Expression(m.times(2), n.negative()),
				new Expression(x.times(4), y.times(-5), z.times(-6)),
			],
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

	//! Question 3 (Q4 from book)
	(() => {
		const qnNo = 3;
		const parts: Part[] = [];
		const ansParts: Part[] = [];
		const terms = [
			[new Expression(a.times(4), b), new Expression(x.times(8), y.times(-9), 10)],
			[new Expression(b.times(6), a.times(-5)), new Expression(3, x.times(-2), y.times(7))],
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
	<title>{titleTop}</title>
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
