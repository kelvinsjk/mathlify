<script lang="ts">
	import Question from '$lib/components/Question.svelte';
	import type { Part, Question as QuestionType } from '$lib/components/types';
	import { ExpansionTerm, Expression, Fraction, SLE, Term, UnsimplifiedExpression, UnsimplifiedTerm } from 'mathlify';
	import { alignatStar, display, math } from 'mathlifier';

	const title = 'Algebraic fractions';

	// Completed (only left complicated examples Q4 onwards)

	const questions: QuestionType[] = [];
	const answers: QuestionType[] = [];

	const expandText = 'Simplify each of the following';
	let qnNo = 0;

	const x = new Term('x');
	const y = new Term('y');
	const x2 = new Term(['x', 2]);
	const y2 = new Term(['y', 2]);

	//! Question 1
	(() => {
		qnNo++;
		const parts: Part[] = [];
		const ansParts: Part[] = [];
		const termsArray = [
			[[10,'a','b'], [100, 'b','c']],
			[[7, ['d',5]], [21, ['d',6]]]
		];
		termsArray.forEach((terms, i) => {
			qn = new ExpansionTerm({exp: new Expression(...terms), power: 2});
			ans = qn.expand();
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
		const termsArray = [
			['a', -8],
			[11, [-1,'b']],
			[[4,'c'], -1],
			[7, [-2, 'd']],
			['h',[-5, 'k']],
			[[9, 'h'], [-1,'k']],
			[[3,'m'], [-10, 'n']],
			[[6,'m'],[-5, 'n'], [5,'n'],[-6,'m']],
			[[2,'p'], new Fraction(-1,3)],
			[[new Fraction(1,3),'p'], -2],
			[[7, 'p'], [new Fraction(-5,6),'q']],
			[[new Fraction(1,10),'p'], [-10, 'q']],
			[['x','y'],-9],
			[3,[-8,'x','y']],
			[[new Fraction(1,2),'x','y'],[-4,'z']],
			[[new Fraction(4,5),'x'],[new Fraction(-5,6),'y','z']]
		];
		termsArray.forEach((terms, i) => {
			let qn: string|ExpansionTerm;
			let ans: Expression;
			if (i===7){
				const exp1 = new Expression(terms[0], terms[1]);
				const exp2 = new Expression(terms[2],terms[3])
				qn = `(${exp1}) (${exp2})`
				ans = exp1.square().negative();
			} else {
				qn = new ExpansionTerm({exp: new Expression(...terms), power: 2});
				ans = qn.expand();
			}
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
	
	//! Question 3
	(() => {
		qnNo++;
		const parts: Part[] = [];
		const ansParts: Part[] = [];
		const termsArray: [number|string|(number|string|Fraction)[], (number|string|Fraction)[], boolean, (number|string|Fraction)[]?, (number|string|Fraction)[]?][] = [
			// a, b, (a+b)(a-b) vs (a-b)(a+b)
			['a', [9], true],
			[5, ['b'], true],
			[[6,'c'], [1], true],
			[8, [3, 'd'], true],
			['h',[4, 'k'], true],
			[[9, 'h'], ['k'], false],
			[[7,'m'], [2, 'n'], true],
			[[4,'n'],[-11, 'm'], false, [11,'m'],[4,'n']],
			[[10,'p'], [new Fraction(1,2)], true],
			[[new Fraction(1,5),'p'], [3], false, [3], [new Fraction(-1,5),'p']],
			[[9, 'p'], [new Fraction(2,9),'q'], true],
			[[new Fraction(3,4),'p'], [4, 'q'], false],
			[['x','y'],[12], true],
			[7,[5,'x','y'],false],
			[[new Fraction(1,4),'x','y'],['z'], true],
			[[new Fraction(3,5),'x'],[new Fraction(2,3),'y','z'], false]
		];
		termsArray.forEach((terms, i) => {
			let qn: string|ExpansionTerm;
			let ans: Expression;
			if (i===7){
				const exp1 = new Expression(terms[0], terms[1]);
				const exp2 = new Expression(terms[3] ?? '',terms[4] ?? '')
				qn = `(${exp1}) (${exp2})`
				ans = exp1.times(exp2);
			} else if (i===9) {
				const exp1 = new Expression(terms[0], terms[1]);
				const exp2 = new Expression(terms[3] ?? '',terms[4] ?? '')
				qn = `(${exp1}) (${exp2})`
				ans = exp1.times(exp2);
			} else {
				const [term1, term2, addition] = terms;
				const exp1 = addition ? new Expression(term1, term2) : new Expression(term1, [-1, ...term2]);
				const exp2 = addition ? new Expression(term1, [-1, ...term2]) : new Expression(term1, term2);
				qn = new ExpansionTerm(exp1, exp2);
				ans = qn.expand();
			}
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
