<script lang="ts">
	import Question from '$lib/components/Question.svelte';
	import type { Part, Question as QuestionType } from '$lib/components/types';
	import { ExpansionTerm, Fraction, Term, Expression, Polynomial, solveLinear, UnsimplifiedTerm } from 'mathlify';
	import { math, newParagraph } from 'mathlifier';

	const title = 'Unit 1.1 Numbers and their operations';

	// Low priority: Numbers, Q1-5, 8-9, 14, 15, 17-24.
	// TODO: Q6-7, 10, 12, 16, P2 Q1-2: Indices

	const questions: QuestionType[] = [];
	const answers: QuestionType[] = [];

	//! Question 11
	(()=>{
		const qnNo = 11;
		const term1 = new Term(36, ['a',2], ['b',3]);
		const term2 = new Term(24, ['a',3], ['b',-2]).setDisplayMode('never');
		const qn = new UnsimplifiedTerm(term1, {termAtom: term2, multiplication: false});
		const ans = qn.simplify().setDisplayMode('auto');
		questions.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span> ${math(`${qn}`)}`,
			marks: 2,
		});
		answers.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span> ${math(`\\displaystyle ${ans}`)}`,
		});
	})();

	//! Question 13
	(()=>{
		const qnNo = 13;
		const term1 = new Term(12, ['x',2], 'y');
		const term2 = new Term(3, 'x', ['y',-5]).setDisplayMode('never');
		const qn = new UnsimplifiedTerm(term1, {termAtom: term2, multiplication: false});
		const ans = qn.simplify().setDisplayMode('auto');
		questions.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span> ${math(`${qn}`)}`,
			marks: 2,
		});
		answers.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span> ${math(`\\displaystyle ${ans}`)}`,
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
