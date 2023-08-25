<script lang="ts">
	import Question from '$lib/components/Question.svelte';
	import type { Part, Question as QuestionType } from '$lib/components/types';
	import {
		Expression,
		Polynomial,
		Term,
		factorizeExpression,
		factorizeQuadratic,
	} from 'mathlify';
	import { alignatStar, display, math } from 'mathlifier';

	//TODO: Q4g,h: factorize first, then quadratic
	//TODO: Q5: Multivariable quadratics
	//TODO: Q6+ Hence substitutions

	const title = `Factorisation of quadratic expressions`;

	const questions: QuestionType[] = [];
	const answers: QuestionType[] = [];

	const expandText = 'Factorise each of the following expressions completely.';
	const a = new Term('a');
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
		const terms: [number|Term, number|Term, Term?][] = [
			[x.times(5), 20],
			[x.times(14), -7],
			[16, x.times(-12)],
			[x.times(-9), -3],
			[x2.times(10), x.times(11), x],
			[x2.times(25), x.times(-40), x],
			[a.times(x).times(y), a.times(-6).times(x2), a.times(x)],
			[x2.times(-28).times(y), x.times(-32).times(y2), x.times(y)],
		];
		terms.forEach((exps) => {
			const [term1, term2, factor] = exps;
			const qn = new Expression(term1, term2);
			const ans = factorizeExpression(qn, factor);
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

	//! Question 2
	(() => {
		qnNo++;
		const parts: Part[] = [];
		const ansParts: Part[] = [];
		const coeffs = [
			[1,5,4],
			[1,8,15],
			[1,-9,8],
			[1,-7,12],
			[1,10,-11],
			[1,6,-16],
			[1,-1,-6],
			[1,-2,-48],
		];
		coeffs.forEach((coeff) => {
			const qn = new Polynomial(coeff)
			const ans = factorizeQuadratic(qn);
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

	//! Question 3
	(() => {
		qnNo++;
		const parts: Part[] = [];
		const ansParts: Part[] = [];
		const coeffs = [
			[5,8,3],
			[14,51,27],
			[11,-23,12],
			[4,-29,30],
			[10,11,-6],
			[8,7,-51],
			[3,-10,-8],
			[24,-98,-45],
		];
		coeffs.forEach((coeff) => {
			const qn = new Polynomial(coeff)
			const ans = factorizeQuadratic(qn);
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
	
	//! Question 4
	(() => {
		qnNo++;
		const parts: Part[] = [];
		const ansParts: Part[] = [];
		const coeffs = [
			[3,21,30],
			[8,2,-28],
			[15,-70,80],
			[-1,1,56],
			[-9,-3,72],
			[84,16,-4], // ascending
		];
		coeffs.forEach((coeff,i) => {
			const qn = new Polynomial(coeff, {ascending: i===5})
			const ans = factorizeQuadratic(qn);
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
