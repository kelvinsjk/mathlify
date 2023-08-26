<script lang="ts">
	import Question from '$lib/components/Question.svelte';
	import type { Part, Question as QuestionType } from '$lib/components/types';
	import { ExpansionTerm, Fraction, Term, Expression, Polynomial, solveLinear, UnsimplifiedTerm, xPolynomial, EquationWorking, InequalityWorking } from 'mathlify';
	import { align, alignStar, display, gatherStar, math, newParagraph } from 'mathlifier';
	import { intervalsToMath } from '$lib/typesetting/intervalsToMath';

	const title = 'Unit 1: Quadratic Functions, Equations and Inequalities';

	const questions: QuestionType[] = [];
	const answers: QuestionType[] = [];

	//! Question 1: 2020 P2 Q2 
	(()=>{
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		// part a
		(()=>{
			const m = 3, c = 20;
			const quadratic = new Polynomial([2,0,-7]);
			const linear = new Polynomial([m, c]);
			const body = `Solve the simultaneous equations
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
			`;
			parts.push({body});
			solParts.push({body: solA})
		})();
		// part b
		(()=>{
			const a = 'a', b=5, c=-2;
			const poly = new xPolynomial([a,b,c]);
			const discriminant = poly.quadraticDiscriminant();
			const workingB = new InequalityWorking(discriminant);
			workingB.moveTerm(0,{from: 'lhs'});
			workingB.divide(8);
			const rhs = workingB.rhs.cast.toFraction().valueOf();
			const maxA = Math.floor(rhs);
			const body = `Find the greatest value of the integer ${math(`a`)}
				for which ${math(`${poly}`)} is negative for all
				${math(`x.`)}
			`;
			const solB = `For ${math(`${poly}`)} to be always negative,
				${align(`a &< 0 \\textrm{ and} \\\\ b^2 - 4ac &< 0`)}
				From ${math(`(2),`)}
				${gatherStar(`(${b})^2 - 4${a}(${c}) < 0 \\\\
					${workingB}`
				)}
				Greatest value of integer ${math(`a = ${maxA} \\; \\blacksquare`)} 	
			`;
			parts.push({body});
			solParts.push({body: solB})
		})();
		// part c
		(()=>{
			const m = 4, c = 'c';
			const a = 1, c2 = new Fraction(21,4);
			const linear = new xPolynomial([4,c]);
			const quadratic = new xPolynomial([a,c,c2]);
			// question
			const body = `Find the values of the constant ${math(`c`)}
				for which the line ${math(`y = ${linear}`)}
				is a tangent to the curve ${math(`y = ${quadratic}.`)}
			`;
			const working1 = new EquationWorking(quadratic, linear);
			working1.rhsZero();
			const poly = working1.lhs as xPolynomial;
			const [c1,b1,a1] = poly.coeffs;
			const discriminant = poly.quadraticDiscriminant();
			const working2 = new EquationWorking(discriminant);
			const [ans1, ans2] = working2.factorizeQuadratic({variable: 'c'}); 
			const sol = `Equating the equations of the line and curve,
				${gatherStar(`${working1}`
				)}
				For the line to be a tangent to the curve,
				${gatherStar(`\\textrm{Discriminant = 0}
					\\\\ \\left(${b1}\\right)^2 - 4 \\left(${a1}\\right) \\left(${c1}\\right) = 0
					\\\\ ${b1.square()} ${c1.times(-1).times(a1)} = 0 \\\\
					${working2}
					\\\\ c = ${ans1} \\; \\blacksquare \\; \\textrm{ or } \\; c = ${ans2} \\; \\blacksquare
				`)}
			`;
			parts.push({body});
			solParts.push({body: sol})
		})();
		questions.push({ parts	});
		answers.push({ parts: solParts });
	})();

	//! Question 2: 2020 P2 Q5
	(()=>{
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		// part a
		(()=>{
			const a = 15, b = 1, c = 2;
			const d = 1, e = 19, f = -2;
			const lhs = new ExpansionTerm(a, new Polynomial([b,c], {ascending: true}));
			const rhs = new ExpansionTerm(new Polynomial(d), new Polynomial([e,f], {ascending: true}));
			const sign = '\\geq';
			const body = `Represent the solution set of
				${display(`${lhs} ${sign} ${rhs}`)}
				on a number line.
			`;
			const workingA = new InequalityWorking(lhs, rhs, {sign});
			workingA.expand();
			workingA.rhsZero();
			// workaround: toggle poly to descending
			const intervals = workingA.factorizeQuadratic();
			const sol = `${gatherStar(`${workingA}
				\\\\ ${intervals[0]} \\; \\blacksquare \\; \\textrm{ or } \\; ${intervals[1]} \\; \\blacksquare			
			`)}

			`;
				//TODO: number line/graph
			parts.push({body});
			solParts.push({body: sol})
		})();
		questions.push({ parts	});
		answers.push({ parts: solParts });
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
		<hr>
	{/each}
	<h3>Answers</h3>
	{#each answers as question}
		<Question {question} />
	{/each}
</section>
