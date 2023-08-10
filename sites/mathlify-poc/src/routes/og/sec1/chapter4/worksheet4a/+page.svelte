<script lang="ts">
	import Question from '$lib/components/Question.svelte';
	import type { Part, Question as QuestionType } from '$lib/components/types';
	import { RationalTerm, Fraction, Term, Expression, ExpansionTerm, PowerTerm } from 'mathlify';
	import { math, newParagraph } from 'mathlifier';

	const title = 'Basic algebraic concepts and notations';

	// TODO: Word problems: sum/subtract
	// TODO: Sub in working
	// TODO: Expansion with first part expression and second part power term: 10d

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
		new PowerTerm(new Term(-5,'x','y'), new Fraction(1,2))
	];
	const ans3 = exp3.map((exp, i) => {
		let e: Expression | Term = exp.subIn({ x, y });
		if (i === 2) {
			return e.cast.toFraction();
		}
		if (i === 3 && exp instanceof PowerTerm) {
			const radicand = exp.exp.subIn({ x, y }).cast.toFraction().valueOf();
			return Math.sqrt(radicand);
		}
		return e;
	});
	const xys3 = { x, y };

	//! Question 4 (9 in book)
	(x = new Fraction(1, 3)), (y = new Fraction(-1, 4));
	const exp4 = [
		new Expression(7, [-12, 'x', 'y']),
		new Expression(new Term(3, ['x', -1]), new Term(4, ['y', -1]), -6),
		new Expression(new ExpansionTerm(5, ['x', new Term(2, 'y')]), [-9, 'x']),
		new Expression(new PowerTerm(new Term('y').divide(2, {fractionalDisplayMode: 'always'}), new Fraction(1,3)), new Term(3, 'x').divide(2, {fractionalDisplayMode: 'always'})),
	];
	const ans4 = exp4.map((exp, i) => {
		if (i === 2) {
			exp = new Expression(...new ExpansionTerm(5, ['x', new Term(2, 'y')]).expand().terms, [
				-9,
				'x',
			]);
		} else if (i===3){
			const [t1, t2] = exp.terms;
			if (t1 instanceof PowerTerm) {
				const radicand = t1.exp.subIn({ x, y }).cast.toFraction();
				const firstTermNum = Math.pow(radicand.abs().num.valueOf(), 1/3) * radicand.sign();
				const firstTermDen = Math.pow(radicand.den, 1/3);
				const firstTerm = new Fraction(firstTermNum, firstTermDen);
				exp = new Expression(firstTerm, t2);
			} else {
				throw new Error('Expected first term to be a power term');
			}
		}
		return exp.subIn({ x, y });
	});
	const xys4 = { x, y };

	//! Question 4 (10 in book)
	//TODO: part d
	x = new Fraction(-1, 2);
	y = 0;
	const z = 4;
	const exp5 = [
		new Expression([99, 'x', 'y', 'z']),
		new PowerTerm(new Expression(new Term(['x', 2]), new Term(-1,'y','z')), 3),
		new Expression(new Term(['x', 2], 'z').divide(5, { fractionalDisplayMode: 'always' }),
			new RationalTerm(new Expression([3, 'z'], [-1, 'y']), new Expression([2, 'x'], 'z'), new Fraction(-1))),
	];
	const ans5 = exp5.map((exp, i) => {
		if (i===1 && exp instanceof PowerTerm){
			const inner = exp.exp.subIn({ x, y, z }).cast.toFraction();
			return inner.pow(exp.power.valueOf()).times(exp.coeff);
		}
		if (i === 2 && exp instanceof Expression) {
			const [t1, rational] = exp.subIn({ x, y, z }).terms;
			const rational2 = rational.cast.toFraction();
			return new Expression(t1, rational2);
		}
		return exp.subIn({ x, y, z });
	});
	const xys5 = { x, y, z };

	//! Compiled questions
	const qnArray = [exp1, exp2, exp3, exp4, exp5];
	const ansArray = [ans1, ans2, ans3, ans4, ans5];
	const xyArray = [xys1, xys2, xys3, xys4, xys5];
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
