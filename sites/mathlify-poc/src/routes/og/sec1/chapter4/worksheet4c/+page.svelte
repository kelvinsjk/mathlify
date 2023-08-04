<script lang="ts">
	import Question from '$lib/components/Question.svelte';
	import type { Part, Question as QuestionType } from '$lib/components/types';
	import { Term, Expression } from 'mathlify';
	import { math, newParagraph } from 'mathlifier';

	const title = 'Expansion and factorisation of linear expressions';

	// TODO: Repeated multiplication Q2
	// TODO: Expand, and then simplify with other terms Q4
	// TODO: Factorisation: Q8

	//! Question 1
	const exp1: [number, Expression][] = [
		[5, new Expression('x', 7)],
		[6, new Expression('x', -10)],
		[4, new Expression([3, 'x'], 8)],
		[9, new Expression([2, 'x'], -1)],
		[-1, new Expression('x', 12)],
		[-2, new Expression('x', -7)],
		[-6, new Expression([2, 'x'], 9)],
		[-4, new Expression([5, 'x'], -3)],
		[3, new Expression(1, [6, 'x'])],
		[5, new Expression(12, [-4, 'x'])],
		[-2, new Expression(8, [-3, 'x'])],
		[-9, new Expression(9, [-10, 'x'])],
		[7, new Expression([5, 'x'], [4, 'y'])],
		[8, new Expression([3, 'x'], [-8, 'y'])],
		[-3, new Expression([6, 'y'], 'x')],
		[-5, new Expression([2, 'y'], [-9, 'x'])],
	];
	const ans1 = exp1.map(([k, exp]) => new Expression(k).times(exp));

	//! Question 2 (3 from book)
	const exp2: [Term, Expression][] = [
		[new Term(2, 'a'), new Expression([9, 'x'], [4, 'y'])],
		[new Term(7, 'a'), new Expression([8, 'x'], [-3, 'y'])],
		[new Term(-1, 'a'), new Expression([5, 'x'], 'y')],
		[new Term(-6, 'a'), new Expression('x', [-10, 'y'])],
		[new Term(4, 'b', 'c'), new Expression([6, 'y'], [-11, 'x'])],
		[new Term(-5, 'b', 'c'), new Expression([3, 'y'], [16, 'x'])],
	];
	const ans2 = exp2.map(([k, exp]) => new Expression(k).times(exp));

	//! Compiled questions
	const qnArray = [exp1, exp2];
	const ansArray = [ans1, ans2];
	const preamble = () => {
		return `Expand each of the following expressions.`;
	};

	const questions: QuestionType[] = [];
	qnArray.forEach((q, i) => {
		const parts: Part[] = [];
		q.forEach(([k, exp], j) => {
			const qn = k instanceof Term ? k.times(`(${exp})`) : new Term(k, `(${exp})`);
			parts.push({
				body: `${math(`${qn}`)}
					${newParagraph}
					Answer: ${math(`${ansArray[i][j]}`)}
				`,
			});
		});
		questions.push({
			body: `<span class="font-semibold mx-2">${i + 1}.</span> ${preamble()}`,
			parts: parts,
		});
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
