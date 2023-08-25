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
		solveLinearInequality,
	} from 'mathlify';
	import { alignatStar, display, math } from 'mathlifier';

	const title = `Solving simple linear inequalities`;

	// TODO: Inequalities working
	// TODO: word problems (least/greatest integer, etc)
	// TODO: Q3f,h: floats
	// TODO: Q4m-p: expansion terms, floats

	const questions: QuestionType[] = [];
	const answers: QuestionType[] = [];

	const expandText = 'Solve each of the following inequalities.';
	const a = new Term('a');
	const b = new Term('b');
	const x = new Term('x');
	const y = new Term('y');
	const x2 = new Term(['x', 2]);
	const y2 = new Term(['y', 2]);

	let qnNo = 0;
	//! Question 1 (q3 from book)
	(() => {
		qnNo++;
		const parts: Part[] = [];
		const ansParts: Part[] = [];
		const terms: [number|Fraction|Term|Polynomial, '<'|'>'|'\\leq'|'\\geq', number|Fraction|Term][] = [
			[x.times(8), '>', 72],
			[x.negative(), '<', -6],
			[x.times(-5), '\\geq', 14],
			[20, '\\leq', x.times(-3)],
			[new Polynomial(new Fraction(1,4), {variable: 'y'}), '>', -4],
			[new Polynomial([new Fraction(2,5)], {variable: 'y'}), '\\geq', y.times(-3).divide(8)]
		];
		terms.forEach((exps) => {
			const [lhs, sign, rhs] = exps;
			const qn = (`${lhs} ${sign} ${rhs}`);
			const ans = (solveLinearInequality(lhs instanceof Polynomial? lhs : new Expression(lhs), {rhs: new Expression(rhs), sign}));
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
	
	//! Question 2 (q4 from book)
	(() => {
		qnNo++;
		const parts: Part[] = [];
		const ansParts: Part[] = [];
		const terms: [number|Fraction|Polynomial, '<'|'>'|'\\leq'|'\\geq', number|Fraction|Polynomial][] = [
			[new Polynomial([1, 6], {variable: 'a'}), '>', 15],
			[new Polynomial([1, -10], {variable: 'a'}), '<', 2],
			[new Polynomial([7,-1], {variable: 'b', ascending: true}), '\\geq', 3],
			[0, '\\leq', new Polynomial([8,1], {variable: 'b', ascending: true})],
			[new Polynomial([4, 1], {variable: 'h'}), '>', 9],
			[new Polynomial([6,-2], {variable: 'h', ascending: true}), '<', -11],
			[new Polynomial([new Fraction(1,10),0], {variable: 'k'}), '\\geq', 2],
			[new Polynomial([new Fraction(5,6),0], {variable: 'k'}), '\\leq', 25],
			[new Polynomial([new Fraction(-3,8),0], {variable: 'p'}), '>', 1],
			[new Polynomial([new Fraction(-2,7),0], {variable: 'p'}), '<', new Fraction(-4,5)],
			[new Polynomial([8, new Fraction(2,3)], {variable: 'q', ascending: true}), '\\geq', -6,],
		];
		terms.forEach((exps) => {
			const [lhs, sign, rhs] = exps;
			const qn = (`${lhs} ${sign} ${rhs}`);
			const ans = (solveLinearInequality(lhs, {rhs, sign}));
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
