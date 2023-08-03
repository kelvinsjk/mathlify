<script lang="ts">
	import Question from '$lib/components/Question.svelte';
	import type { Part, Question as QuestionType } from '$lib/components/types';
	import { UnsimplifiedExpression, Fraction, Term, Expression } from 'mathlify';
	import { alignStar, display, math, newParagraph } from 'mathlifier';

	const title = 'Basic algebraic concepts and notations';

	const simplifyString = 'Simplify each of the following';

	// TODO: Word problems: sum/subtract
	// TODO: Sub in working
	// TODO: Expansion: 9c, 10d
	// TODO: RationalTerm: Q8c, 10c
	// TODO: Surds: Q8d, 9d
	// TODO: powers: Q10b,d

	//! Question 1
	let x = 5,
		y = -2;
	const exp1 = [
		new Expression([4, 'x'], [9, 'y']),
		new Expression([4, 'x'], [-9, 'y']),
		new Expression([3, 'x', 'y']),
		new Term('x', 'y', new Fraction(1, 3)).setFractionalDisplay()
	];
	const ans1 = exp1.map((exp) => exp.subIn({ x, y }));
	const xys1 = { x, y };

	//! Question 2
	x = -4;
	y = 7;
	//! 2a construction
	const term1 = new Term(5, 'x');
	const multiple = -3;
	const term2 = new Expression([7, 'x'], 'y');
	const exp2 = [
		new Expression([-11, 'x'], [-2, 'y']),
		new Expression(term1, [multiple, `(${term2})`]),
		new Expression(
			new Term('x').divide(5).divide('y', { fractionalDisplayMode: true }),
			new Term('y').divide(5).divide('x', { fractionalDisplayMode: true })
		),
		new Expression(new Term(['x', 2]), new Term(['y', 2]))
	];
	console.log(`${term2.subIn({ x, y })}`);
	console.log(
		`${new Expression(term1, [multiple, term2.subIn({ x, y }).cast.toFraction()]).subIn({ x, y })}`
	);
	const ans2 = exp2.map((exp, i) => {
		if (i === 1) {
			const exp = new Expression(term1, [multiple, term2.subIn({ x, y }).cast.toFraction()]).subIn({
				x,
				y
			});
			console.log(`${exp}`);
			return exp;
		}
		return exp.subIn({ x, y });
	});
	const xys2 = { x, y };

	//! Compiled questions
	const qnArray = [exp1, exp2];
	const ansArray = [ans1, ans2];
	const xyArray = [xys1, xys2];
	const preamble = (xys: { x: number; y: number }) => {
		return `Given that ${math(`x=${xys.x}`)} and ${math(`y=${xys.y},`)}
			find the value of each of the following expressions.
		`;
	};

	const questions: QuestionType[] = [];
	qnArray.forEach((q, i) => {
		const parts: Part[] = [];
		q.forEach((q, j) => {
			parts.push({
				body: `${math(`${q}`)}
					${newParagraph}
					Answer: ${math(`${ansArray[i][j]}`)}
				`
			});
		});
		questions.push({
			body: `<span class="font-semibold mx-2">${i + 1}.</span> ${preamble(xyArray[i])}`,
			parts: parts
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
