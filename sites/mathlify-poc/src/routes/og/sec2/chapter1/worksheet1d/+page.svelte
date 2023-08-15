<script lang="ts">
	import Question from '$lib/components/Question.svelte';
	import type { Part, Question as QuestionType } from '$lib/components/types';
	import { Fraction, SLE } from 'mathlify';
	import { alignatStar, display, math } from 'mathlifier';

	// TODO: 1f, g, h: swapped coefficient order
	// TODO: 1i,j eqn ordering
	// TODO: Q2: rational, expansion, floats

	const title = 'Solving simultaneous linear equations';

	const questions: QuestionType[] = [];
	const answers: QuestionType[] = [];

	//! Question 1
	(() => {
		const qnNo = 1;
		const parts: Part[] = [];
		const ansParts: Part[] = [];
		const coeffs = [
			[
				[2, 1],
				[1, 1],
			],
			[
				[2, 1],
				[1, -1],
			],
			[
				[2, -1],
				[1, -1],
			],
			[
				[2, -1],
				[1, 1],
			],
			[
				[5, 1],
				[-5, 1],
			],
			[
				[4, 9],
				[10, 9],
			],
		];
		const rhs = [
			[5, 1],
			[5, 1],
			[5, 1],
			[5, 1],
			[6, 4],
			[-1, 11],
		];
		coeffs.forEach((coeff, i) => {
			const sle = new SLE(coeff, rhs[i]);
			parts.push({
				body: alignatStar(`${sle}`, sle.alignatArg),
			});
			const [x, y] = sle.solve();
			ansParts.push({
				body: `${math(`${x},`)} ${math(`${y}.`)}`,
			});
		});
		questions.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span> Solve each pair of simultaneous equations:`,
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
		const coeffs = [
			[
				[new Fraction(1, 3), new Fraction(-1, 2)],
				[2, 3],
			],
		];
		const rhs = [[4, 0]];
		coeffs.forEach((coeff, i) => {
			const sle = new SLE(coeff, rhs[i]);
			parts.push({
				body: alignatStar(`${sle}`, sle.alignatArg),
			});
			const [x, y] = sle.solve();
			ansParts.push({
				body: `${math(`${x},`)} ${math(`${y}.`)}`,
			});
		});
		questions.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span> Solve each pair of simultaneous equations:`,
			parts,
		});
		answers.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span>`,
			parts: ansParts,
		});
	})();

	//! Question 3
	(() => {
		const qnNo = 3;
		const parts: Part[] = [];
		const ansParts: Part[] = [];
		const coeffs = [
			[
				[2, 3, 4],
				[4, -3, 8],
				[1, 1, 1],
			],
		];
		const rhs = [[12, 6, 7]];
		coeffs.forEach((coeff, i) => {
			const sle = new SLE(coeff, rhs[i]);
			parts.push({
				body: alignatStar(`${sle}`, sle.alignatArg),
			});
			const [x, y, z] = sle.solve();
			ansParts.push({
				body: `${math(`${x},`)} ${math(`${y},`)} ${math(`${z}.`)}`,
			});
		});
		questions.push({
			body: `<span class="font-semibold mx-2">${qnNo}.</span> Solve each pair of simultaneous equations:`,
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
