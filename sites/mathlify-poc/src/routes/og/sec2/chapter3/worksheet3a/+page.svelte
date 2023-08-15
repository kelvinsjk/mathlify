<script lang="ts">
	import Question from '$lib/components/Question.svelte';
	import type { Part, Question as QuestionType } from '$lib/components/types';
	import { Fraction, SLE, Term, UnsimplifiedExpression } from 'mathlify';
	import { alignatStar, display, math } from 'mathlifier';

	const title = 'Addition and subtraction of quadratic expressions';

	// Completed (only left word problems 3,4)

	const questions: QuestionType[] = [];
	const answers: QuestionType[] = [];

	const simplifyText = 'Simplify each of the following expressions';
	const x = new Term('x');
	const y = new Term('y');
	const x2 = new Term(['x', 2]);
	const y2 = new Term(['y', 2]);

	//! Question 1
	(() => {
		const qnNo = 1;
		const parts: Part[] = [];
		const ansParts: Part[] = [];
		const terms: [Term, boolean, Term][] = [
			[x2.times(12), true, x2.times(4)],
			[y2.times(5), false, y2.times(2)],
			[x2.times(8), true, x2.times(-5)],
			[y2.times(-1), true, y2.times(10)],
			[x2.times(-6), true, x2],
			[y2.times(-3), false, y2.times(9)],
			[x2.times(-7), false, x2.times(-11)],
			[y2.times(-4), false, y2.times(-4)],
		];
		terms.forEach(([term1, addition, term2], i) => {
			const qn = new UnsimplifiedExpression(term1, { addition, term: term2 });
			const ans = qn.simplify();
			parts.push({
				body: math(`${qn}`),
			});
			ansParts.push({
				body: math(`${ans}.`),
			});
		});
		questions.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span> ${simplifyText}.`,
			parts,
		});
		answers.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span>`,
			parts: ansParts,
		});
	})();

	//! Question 2
	(() => {
		const qnNo = 2;
		const parts: Part[] = [];
		const ansParts: Part[] = [];
		const exps = [
			new UnsimplifiedExpression(x2.times(3), 7, x2.times(2), 5),
			new UnsimplifiedExpression(y2.times(8)).minus(1).minus(y2.times(6)).plus(4),
			new UnsimplifiedExpression(x2.times(9), 10, x2.times(-1)).minus(3),
			new UnsimplifiedExpression(4).minus(y2.times(2)).minus(11).plus(y2.times(7)),
			new UnsimplifiedExpression(x2.times(5), x.times(6), 2, x2.times(9), x.times(4), 1),
			new UnsimplifiedExpression(y2.times(3))
				.minus(y.times(10))
				.plus(8)
				.minus(y2.times(-3))
				.plus(y.times(10))
				.plus(8),
			new UnsimplifiedExpression(x2.times(-1), 12)
				.minus(x.times(7))
				.plus(x2.times(4))
				.minus(x.times(3))
				.minus(8),
			new UnsimplifiedExpression(9)
				.minus(y2.times(6))
				.plus(y.times(9))
				.minus(y2.times(-2))
				.plus(new Term(9, 'x', 'y')),
		];
		exps.forEach((exp, i) => {
			parts.push({
				body: math(`${exp}`, { wrap: true }),
			});
			ansParts.push({
				body: math(`${exp.simplify()}.`),
			});
		});
		questions.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span> ${simplifyText}.`,
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
	<h2 id="title">{title}</h2>
	<h3>Questions</h3>
	{#each questions as question}
		<Question {question} />
	{/each}
	<h3>Answers</h3>
	{#each answers as question}
		<Question {question} />
	{/each}
</section>
