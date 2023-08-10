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
		UnsimplifiedTerm,
		RationalTerm,
		GeneralEquation,
	} from 'mathlify';
	import { alignStar, math, newParagraph } from 'mathlifier';

	const title = 'Unit 1.7 Equations and Inequalities';

	// TODO: Quadratic: Q2, 12, P2 Q2, 3, 5, 6, 8, 10, 11, 12, 13
	// TODO: Inequalities: Q3, 4, 7, 9, P2 Q1, 9
	// TODO: SLE: Q10, 13, P2 Q4
	// TODO: Number Patterns: Q11, P2 Q7

	const questions: QuestionType[] = [];
	const answers: QuestionType[] = [];

	//! Question 1
	(() => {
		const qnNo = 1;
		const term1 = new RationalTerm('x', 5);
		const term2 = new RationalTerm([new Term(2, 'x'), -3], 4, { coeff: -1 });
		const rhs = -3;
		const eqn = new GeneralEquation(new Expression(term1, term2), rhs);
		questions.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span> Simplify ${math(`${eqn}`)}`,
			marks: 3,
		});
		eqn.setAligned();
		eqn.combineRationalTerms();
		eqn.crossMultiply();
		const ans = solveLinear(eqn.lhs, eqn.rhs);
		eqn.moveTerm(1);
		const coeff = eqn.lhs.terms[0].coeff;
		eqn.divide(coeff);
		answers.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span> ${math(`x=${ans}.`)} ${alignStar(
				`${eqn}`,
			)}`,
		});
	})();

	//! Question 5
	(() => {
		const qnNo = 5;
		const term1 = new RationalTerm([new Term(3, 'x'), -4], 2);
		const term2 = new RationalTerm([new Term(2, 'x')], 3, { coeff: -1 });
		const rhs = 1;
		const eqn = new GeneralEquation(new Expression(term1, term2), rhs);
		questions.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span> Simplify ${math(`${eqn}`)}`,
			marks: 3,
		});
		eqn.setAligned();
		eqn.combineRationalTerms();
		eqn.crossMultiply();
		const ans = solveLinear(eqn.lhs, eqn.rhs);
		eqn.moveTerm(1);
		const coeff = eqn.lhs.terms[0].coeff;
		eqn.divide(coeff);
		answers.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span> ${math(`x=${ans}.`)} ${alignStar(
				`${eqn}`,
			)}`,
		});
	})();

	//! Question 6
	(() => {
		const qnNo = 6;
		const term1 = new Term('x').divide(5, { fractionalDisplayMode: 'always' });
		const term2 = 14;
		const rhs = 8;
		const eqn = new GeneralEquation(new Expression(term1, term2), rhs);
		questions.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span> Simplify ${math(`${eqn}`)}`,
			marks: 1,
		});
		eqn.setAligned();
		const ans = solveLinear(eqn.lhs, eqn.rhs);
		eqn.moveTerm(1);
		const coeff = eqn.lhs.terms[0].coeff;
		eqn.divide(coeff);
		answers.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span> ${math(`x=${ans}.`)} ${alignStar(
				`${eqn}`,
			)}`,
		});
	})();

	//! Question 8
	(() => {
		const qnNo = 8;
		const linear1 = new Polynomial([2, -1]);
		const linear2 = new Polynomial([1, 3]);
		const qn = `Solve ${math(`(${linear1})(${linear2})=0.`)}`;
		questions.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span> ${qn}`,
			marks: 1,
		});
		const x1 = solveLinear(linear1);
		const x2 = solveLinear(linear2);
		const ans = `${math(`x=${x1},`)} ${math(`x=${x2}.`)}`;
		answers.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span> ${ans}`,
		});
	})();

	//!! Paper 2
	const questions2: QuestionType[] = [];
	const answers2: QuestionType[] = [];
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<section aria-labelledby="title" class="prose mx-auto">
	<h1 id="title">{title}</h1>
	<h2>Paper 1</h2>
	<h3>Questions</h3>
	{#each questions as question}
		<Question {question} />
	{/each}
	<h3>Answers</h3>
	{#each answers as question}
		<Question {question} />
	{/each}
	<h2>Paper 2</h2>
	{#each questions2 as question}
		<Question {question} />
	{/each}
	<h3>Answers</h3>
	{#each answers2 as question}
		<Question {question} />
	{/each}
</section>
