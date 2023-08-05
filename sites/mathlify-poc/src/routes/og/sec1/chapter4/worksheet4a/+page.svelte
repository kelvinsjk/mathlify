<script lang="ts">
	import Question from '$lib/components/Question.svelte';
	import type { Part, Question as QuestionType } from '$lib/components/types';
	import { RationalTerm, Fraction, Term, Expression } from 'mathlify';
	import { math, newParagraph } from 'mathlifier';

	const title = 'Basic algebraic concepts and notations';

	// TODO: Word problems: sum/subtract
	// TODO: Sub in working
	// TODO: Expansion: 9c, 10d
	// TODO: negative RationalTerm in an Expression: 10c
	// TODO: Surds: Q8d, 9d
	// TODO: powers: Q10b,d

	//! Question 1 (6 in book)
	let x: number | Fraction = 5;
	let y: number | Fraction = -2;
	const exp1 = [
		new Expression([4, 'x'], [9, 'y']),
		new Expression([4, 'x'], [-9, 'y']),
		new Expression([3, 'x', 'y']),
		new Term('x', 'y', new Fraction(1, 3)).setDisplayMode('always'),
	];
	const ans1 = exp1.map((exp) => exp.subIn({ x, y }));
	const xys1 = { x, y };

	//! Question 2 (7 in book)
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
			new Term('x').divide(5).divide('y', { fractionalDisplayMode: 'always' }),
			new Term('y').divide(5).divide('x', { fractionalDisplayMode: 'always' }),
		),
		new Expression(new Term(['x', 2]), new Term(['y', 2])),
	];
	const ans2 = exp2.map((exp, i) => {
		if (i === 1) {
			const exp = new Expression(term1, [multiple, term2.subIn({ x, y }).cast.toFraction()]).subIn({
				x,
				y,
			});
			return exp;
		}
		return exp.subIn({ x, y });
	});
	const xys2 = { x, y };

	//! Question 3 (8 in book)
	(x = -5), (y = new Fraction(1, 4));
	const exp3 = [
		new Expression([3, 'y'], [-2, 'x']),
		new Expression(
			new Term(1).divide('y', { fractionalDisplayMode: 'always' }),
			new Term(-1).divide('x', { fractionalDisplayMode: 'always' }),
		),
		new RationalTerm(['x', new Term(-1, 'y')], ['x', 'y']),
	];
	const ans3 = exp3.map((exp, i) => {
		let e: Fraction | Expression | RationalTerm = exp.subIn({ x, y });
		if (i === 2) {
			e = e.cast.toFraction();
		}
		return e;
	});
	const xys3 = { x, y };

	//! Question 4 (10 in book)
	//TODO: part b, d
	x = new Fraction(-1, 2);
	y = 0;
	const z = 4;
	const exp4 = [
		new Expression([99, 'x', 'y', 'z']),
		//new Expression(new Term(['x', 2], 'z').divide(5, { fractionalDisplayMode: 'always' })).minus(
		//	new RationalTerm(new Expression([3, 'z'], [-1, 'y']), new Expression([2, 'x'], 'z')),
		//),
	];
	const ans4 = exp4.map((exp, i) => {
		if (i === 1) {
			const [t1, rational] = exp.subIn({ x, y, z }).terms;
			const rational2 = rational.cast.toFraction();
			return new Expression(t1, rational2);
		}
		return exp.subIn({ x, y, z });
	});
	const xys4 = { x, y, z };

	//! Compiled questions
	const qnArray = [exp1, exp2, exp3, exp4];
	const ansArray = [ans1, ans2, ans3, ans4];
	const xyArray = [xys1, xys2, xys3, xys4];
	const preamble = (xys: { x: number | Fraction; y: number | Fraction; z?: number | Fraction }) => {
		if (xys.z) {
			return `Given that ${math(`x=${xys.x}`)}, ${math(`y=${xys.y}`)} and ${math(`z=${xys.z},`)}
				find the value of each of the following expressions.
			`;
		}
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
				`,
			});
		});
		questions.push({
			body: `<span class="font-semibold mx-2">${i + 1}.</span> ${preamble(xyArray[i])}`,
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
