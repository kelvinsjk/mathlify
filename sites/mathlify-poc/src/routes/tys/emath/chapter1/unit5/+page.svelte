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
	} from 'mathlify';
	import { math, newParagraph } from 'mathlifier';

	const title = 'Unit 1.5 Algebraic Expressions and Formulae';

	// TODO: Subject. Q2, 12, 23, P2 Q2, 5, 7-8
	// TODO: Factorization. Q3, 5, 7-9, 14, 18, 20-21, P2 Q3, 6
	// TODO: PowerTerm: Q6, 10
	// TODO: RationalTerm with PowerTerm: Q11, 15, 17, P2 Q1, 4
	// TODO: Rational Term Denominator: Q4
	// TODO: Rational Term with Expansion Term: Q13
	// TODO: Number Patterns: Q19, 22, 24, P2 Q9-12

	const questions: QuestionType[] = [];
	const answers: QuestionType[] = [];

	//! Question 1
	(() => {
		const qnNo = 1;
		const term1 = new Term(4, ['a', 2]).divide(new Term(3, 'b'));
		const term2 = new Term(10, 'a', 'b').divide(21).setDisplayMode('always');
		const qn = new UnsimplifiedTerm(term1, { termAtom: term2, multiplication: false });
		const ans = qn.simplify();
		questions.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span> Simplify ${math(`${qn}`)}`,
			marks: 1,
		});
		answers.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span> ${math(`${ans}`)}`,
		});
	})();

	//! Question 4
	//TODO: Handle denominators
	(() => {
		const qnNo = 4;
		const term1 = new RationalTerm(1, new Expression([2, 'x'], -3));
		const term2 = new RationalTerm(3, new Expression([3, 'x'], -1));
		const addition = false;
		const sign = addition ? '+' : '-';
		const qn = `Write as a single fraction in its simplest form
			${math(`${term1} ${sign} ${term2}.`)}
		`;
		const ans = addition ? term1.plus(term2) : term1.minus(term2);
		questions.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span> ${qn}`,
			marks: 2,
		});
		answers.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span> ${math(`${ans}`)}`,
		});
	})();

	//! Question 13
	// TODO: Handle expansion terms
	(() => {
		const qnNo = 13;
		const term1 = new RationalTerm(new Term(4, 'x'), 3);
		const k = 3;
		const term2Fragment = new Polynomial([2, -5], { ascending: true });
		const term2Num = new ExpansionTerm(k, term2Fragment);
		const term2 = new RationalTerm(term2Num, 4);
		const addition = false;
		const sign = addition ? '+' : '-';
		const qn = `Simplify
			${math(`${term1} ${sign} ${term2}.`)}
		`;
		// workaround for expansion term
		const term2NumSimplified = term2Num.expand();
		const term2Simplified = new RationalTerm(term2NumSimplified, 4);
		// end workaround
		const ans = addition ? term1.plus(term2Simplified) : term1.minus(term2Simplified);
		questions.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span> ${qn}`,
			marks: 2,
		});
		answers.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span> ${math(`${ans}`)}`,
		});
	})();

	//! Question 16
	(() => {
		const qnNo = 16;
		const term1 = new Term(5, 'p');
		const k = -3;
		const term2Fragment = new Polynomial([1, -2], { variable: 'p' });
		const term2 = new ExpansionTerm(k, term2Fragment);
		const qnExp = new Expression(term1, term2);
		const qn = `Simplify
			${math(`${qnExp}.`)}
		`;
		const term2Expanded = term2.expand();
		const ans = new Expression(term1).plus(term2Expanded);
		questions.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span> ${qn}`,
			marks: 2,
		});
		answers.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span> ${math(`${ans}`)}`,
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
