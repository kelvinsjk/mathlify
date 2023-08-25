<script lang="ts">
	import Question from '$lib/components/Question.svelte';
	import type { Part, Question as QuestionType } from '$lib/components/types';
	import { ExpansionTerm, Fraction, Term, Expression, Polynomial, solveLinear, UnsimplifiedTerm, xPolynomial, EquationWorking, InequalityWorking } from 'mathlify';
	import { align, alignStar, display, gatherStar, math, newParagraph } from 'mathlifier';

	const title = 'Unit 1: Quadratic Functions, Equations and Inequalities';

	const questions: QuestionType[] = [];
	const answers: QuestionType[] = [];

	//! Question 1: 2020 P2 Q2 
	(()=>{
		// part a
		const m = 3, c = 20;
		const quadratic = new Polynomial([2,0,-7]);
		const linear = new Polynomial([m, c]);
		const partA = `Solve the simultaneous equations
			${alignStar(`y &= ${quadratic},
				\\\\ y &= ${linear}.
			`)}
		`;
		const workingA = new EquationWorking(quadratic, linear)
		workingA.rhsZero({working: true});
		const [x1, x2] = workingA.factorizeQuadratic();
		const y1 = linear.subIn(x1);
		const y2 = linear.subIn(x2);
		const solA = `Equating the two equations,
			${gatherStar(`${workingA}
				\\\\ x = ${x1} \\; \\textrm{ or } \\; x = ${x2}
			`)}
			When ${math(`x = ${x1},`)}
			${alignStar(`y &= ${m}\\left(${x1}\\right) + ${c}
				\\\\ &= ${y1}
			`)}
			When ${math(`x = ${x2},`)}
			${alignStar(`y &= ${m}\\left(${x2}\\right) + ${c}
				\\\\ &= ${y2}
			`)}
			Hence the solutions are
			${gatherStar(`x=${x1}, y=${y1} \\; \\blacksquare
				\\\\ \\textrm{ or } x=${x2}, y=${y2} \\; \\blacksquare
			`)}
		`
		// part b
		const a = 'a', b=5, c2=-2;
		const poly = new xPolynomial([a,b,c2]);
		const discriminant = poly.quadraticDiscriminant();
		const workingB = new InequalityWorking(discriminant);
		workingB.moveTerm(0,{from: 'lhs'});
		workingB.divide(8);
		const rhs = workingB.rhs.cast.toFraction().valueOf();
		const maxA = Math.floor(rhs);
		const partB = `Find the greatest value of the integer ${math(`a`)}
			for which ${math(`${poly}`)} is negative for all
			${math(`x.`)}
		`;
		const solB = `For ${math(`${poly}`)} to be always negative,
			${align(`a &< 0 \\textrm{ and} \\\\ b^2 - 4ac &< 0`)}
			From ${math(`(2),`)}
			${gatherStar(`(${b})^2 - 4${a}(${c2}) < 0 \\\\
				${workingB}`
			)}
			Greatest value of integer ${math(`a = ${maxA} \\; \\blacksquare`)} 

		`;
		questions.push({
			parts: [
				{body: partA, marks: 3},
				{body: partB, marks: 3},
			]
		});
		answers.push({
			parts: [
				{body: solA}, {body: solB}
			]
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
