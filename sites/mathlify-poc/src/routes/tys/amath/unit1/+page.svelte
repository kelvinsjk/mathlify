<script lang="ts">
	import Question from '$lib/components/Question.svelte';
	import type { Question as QuestionType } from '$lib/components/types';
	import {
		ExpansionTerm,
		Fraction,
		Term,
		Expression,
		Polynomial,
		xPolynomial,
		EquationWorking,
		InequalityWorking,
		discriminant,
		factorizeQuadratic,
		solveQuadratic,
	} from 'mathlify';
	import { align, alignStar, display, eqn, gatherStar, math, strong } from 'mathlifier';

	const title = 'Unit 1: Quadratic Functions, Equations and Inequalities';

	const questions: QuestionType[] = [];
	const answers: QuestionType[] = [];

	//! Question 1: 2020 P2 Q2
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		// part a
		(() => {
			const m = 3,
				c = 20;
			const quadratic = new Polynomial([2, 0, -7]);
			const linear = new Polynomial([m, c]);
			const body = `Solve the simultaneous equations
				${alignStar(`y &= ${quadratic},
					\\\\ y &= ${linear}.
				`)}
			`;
			const workingA = new EquationWorking(quadratic, linear);
			workingA.rhsZero({ working: true });
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
			parts.push({ body });
			solParts.push({ body: solA });
		})();
		// part b
		(() => {
			const a = 'a',
				b = 5,
				c = -2;
			const poly = new xPolynomial([a, b, c]);
			const discriminant = poly.quadraticDiscriminant();
			const workingB = new InequalityWorking(discriminant);
			workingB.moveTerm(0, { from: 'lhs' });
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
					${workingB}`)}
				Greatest value of integer ${math(`a = ${maxA} \\; \\blacksquare`)} 	
			`;
			parts.push({ body });
			solParts.push({ body: solB });
		})();
		// part c
		(() => {
			const m = 4,
				c = 'c';
			const a = 1,
				c2 = new Fraction(21, 4);
			const linear = new xPolynomial([4, c]);
			const quadratic = new xPolynomial([a, c, c2]);
			// question
			const body = `Find the values of the constant ${math(`c`)}
				for which the line ${math(`y = ${linear}`)}
				is a tangent to the curve ${math(`y = ${quadratic}.`)}
			`;
			const working1 = new EquationWorking(quadratic, linear);
			working1.rhsZero();
			const poly = working1.lhs as xPolynomial;
			const [c1, b1, a1] = poly.coeffs;
			const discriminant = poly.quadraticDiscriminant();
			const working2 = new EquationWorking(discriminant);
			const [ans1, ans2] = working2.factorizeQuadratic({ variable: 'c' });
			const sol = `Equating the equations of the line and curve,
				${gatherStar(`${working1}`)}
				For the line to be a tangent to the curve,
				${gatherStar(`\\textrm{Discriminant = 0}
					\\\\ \\left(${b1}\\right)^2 - 4 \\left(${a1}\\right) \\left(${c1}\\right) = 0
					\\\\ ${b1.square()} ${c1.times(-1).times(a1)} = 0 \\\\
					${working2}
					\\\\ c = ${ans1} \\; \\blacksquare \\; \\textrm{ or } \\; c = ${ans2} \\; \\blacksquare
				`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ parts });
		answers.push({ parts: solParts });
	})();

	//! Question 2: 2020 P2 Q5
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		// part a
		(() => {
			const a = 15,
				b = 1,
				c = 2;
			const d = 1,
				e = 19,
				f = -2;
			const lhs = new ExpansionTerm(a, new Polynomial([b, c], { ascending: true }));
			const rhs = new ExpansionTerm(new Polynomial(d), new Polynomial([e, f], { ascending: true }));
			const sign = '\\geq';
			const body = `Represent the solution set of
				${display(`${lhs} ${sign} ${rhs}`)}
				on a number line.
			`;
			const workingA = new InequalityWorking(lhs, rhs, { sign });
			workingA.expand();
			workingA.rhsZero();
			const intervals = workingA.factorizeQuadratic();
			const sol = `${gatherStar(`${workingA}
				\\\\ ${intervals[0]} \\; \\blacksquare \\; \\textrm{ or } \\; ${intervals[1]} \\; \\blacksquare			
				`)}
			`;
			//TODO: number line/graph. change ascending to descending
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ parts });
		answers.push({ parts: solParts });
	})();

	//! Question 3: 2019 P1 Q2
	(() => {
		const a1 = 1,
			b1 = new Expression([2, 'k'], 1),
			c1 = 1;
		const quadratic = new xPolynomial([a1, b1, c1]);
		const line = new xPolynomial(1);
		const body = `Find the set of values of the constant ${math(`k`)}
			for which the curve ${math(`y=${quadratic}`)}
			lies entirely above the line ${math(`y=${line}.`)}
			`;
		const working1 = new EquationWorking(quadratic, line);
		working1.rhsZero();
		const poly = working1.lhs as xPolynomial;
		const [c, b, a] = poly.coeffs;
		const discriminant = poly.quadraticDiscriminant();
		const working2 = new InequalityWorking(discriminant, 0, { aligned: true });
		working2.divide(4);
		const [ans] = working2.factorizeQuadratic({ variable: 'k' });
		const sol = `Equation the curve and line,
			${gatherStar(`${working1}
			`)}
			For the curve to lie entirely above the line,
			${alignStar(`\\textrm{Discriminant} &< 0
				\\\\ (${b})^2 - 4 (${a}) (${c})   &< 0
				\\\\ ${working2}
			`)}
			${display(`${ans} \\; \\blacksquare`)}
		`;
		//TODO: graph/number line
		questions.push({ body });
		answers.push({ body: sol });
	})();

	//! Question 4: 2014 P1 Q9
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const a = 'a',
			b = 5,
			c = new Expression(a, -5);
		const curve = new xPolynomial([a, b, c]);
		const body = `The equation of a curve is
			${math(`y = ${curve},`)} where ${math(a)} is
			a constant.
		`;
		const m = 1,
			c1 = -2;
		const line = new Polynomial([m, c1]);
		// part a
		(() => {
			const a = 2;
			const quadratic = curve.subIntoCoeffs({ a });
			const line = 9;
			const body = `In the case where ${math(`a = ${a},`)}
				find the set of values of ${math(`x`)} for which the
				curve lies completely above the line
				${math(`y=${line}.`)}
			`;
			const workingA = new InequalityWorking(quadratic, line, { sign: '>' });
			workingA.rhsZero();
			const [x1, x2] = workingA.factorizeQuadratic();
			const solA = `Substituting ${math(`a = ${a}`)}
				and when the curve lies completely above the line,
				${gatherStar(`${workingA}
					\\\\ ${x1} \\; \\blacksquare \\; \\textrm{ or } \\; ${x2} \\; \\blacksquare
				`)}
			`;
			parts.push({ body });
			solParts.push({ body: solA });
		})();
		// part b
		(() => {
			const a = 4;
			const quadratic = curve.subIntoCoeffs({ a });

			const body = `In the case where ${math(`a = ${a},`)}
				show that the line ${math(`y = ${line}`)}
				is a tangent to the curve.
			`;
			const working = new EquationWorking(quadratic, line);
			working.rhsZero();
			const poly = working.lhs as Polynomial;
			const [c1, b1, a1] = poly.coeffs;
			const d = discriminant(poly);
			const solB = `Substituting ${math(`a = ${a}`)} and equating
				the equations of the line and curve,
				${gatherStar(`${working}`)}
				${alignStar(`& \\textrm{Discriminant}
					\\\\ & = b^2 - 4ac
					\\\\ & = (${b1})^2 - 4(${a1})(${c1})
					\\\\ &= ${b1.square()} - ${a1.times(4).times(c1)}
					\\\\ &= ${d}
				`)}
				Since the discriminant is ${math(`0,`)}
				the line is a tangent to the curve. ${math(`\\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: solB });
		})();
		// part c
		(() => {
			// question
			const line = new xPolynomial([m, c1]);
			const body = `Find the other value of ${math(`a`)}
				for which the line ${math(`y = ${line}`)}
				is a tangent to the curve.
			`;
			const working1 = new EquationWorking(curve, line);
			working1.rhsZero();
			const poly = working1.lhs as xPolynomial;
			const [c, b, a] = poly.coeffs;
			const discriminant = poly.quadraticDiscriminant();
			const working2 = new EquationWorking(discriminant);
			working2.divide(-4, { show: false });
			working2.castToPoly({ variable: 'a' });
			const [ans1, ans2] = working2.factorizeQuadratic({ variable: 'a' });
			const sol = `Equating the equations of the line and curve,
				${gatherStar(`${working1}`)}
				For the line to be a tangent to the curve,
				${gatherStar(`\\textrm{Discriminant = 0}
					\\\\ \\left(${b}\\right)^2 - 4 \\left(${a}\\right) \\left(${c}\\right) = 0
					\\\\ ${working2}
					\\\\ a = ${ans1} \\; \\blacksquare \\; \\textrm{ or } \\; a = ${ans2} \\textrm{ (rejected)} \\; \\blacksquare
				`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 5: 2018 P2 Q9
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const k = 'k';
		const a = 2,
			b = new Expression(k, 2),
			c = k;
		const curve = new xPolynomial([a, b, c]);
		const body = `The equation of a curve is
			${math(`y = ${curve},`)} where ${math(k)} is
			a constant.
		`;
		// part a
		(() => {
			const m = 19,
				c1 = -13;
			const k = 5;
			const line = new Polynomial([m, c1]);
			const quadratic = curve.subIntoCoeffs({ k });
			const body = `In the case where ${math(`k = ${k},`)}
				show that the line
				${math(`y=${line}`)}
				is a tangent to the curve
				and find the coordinates of the point of contact.
			`;
			const working = new EquationWorking(quadratic, line);
			working.rhsZero();
			working.divide(2);
			const poly = working.lhs as Polynomial;
			const [c, b, a] = poly.coeffs;

			let sol = `Substituting ${math(`k = ${k}`)}
				and equating the equations of the line and curve,
				${gatherStar(`${working}`)}
				${alignStar(`& \\textrm{Discriminant}
					\\\\ & = b^2 - 4 ac 
					\\\\ &= ${b}^2 - 4(${a})(${c})
					\\\\ &= ${b.square()} - ${a.times(4).times(c)}
					\\\\ &= 0
				`)}
				Hence the line is a tangent to the curve. ${math(`\\blacksquare`)}
			`;
			working.clear();
			const [x] = working.factorizeQuadratic();
			sol += gatherStar(`${working} \\\\ x = ${x}`);
			const y = line.subIn(x);
			sol += `When ${math(`x=${x},`)}
				${alignStar(`y &= ${m}(${x}) ${c1}
					\\\\ &= ${y}
				`)}
				Coordinates of point of contact: ${math(`(${x}, ${y}) \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Explain why there is only one value of
				${math(k)} for which ${math(`y`)}
				cannot be negative and state this value.
			`;
			const d = curve.quadraticDiscriminant();
			const [kAns] = solveQuadratic(d, 0, { variable: k });
			const sol = `${alignStar(`& \\textrm{Discriminant}
					\\\\ & = b^2 - 4 ac
					\\\\ &= (${b})^2 - 4(${a})(${c})
					\\\\ &= ${b.square()} - ${new Term(a).times(4).times(c)}
					\\\\ &= ${d}
					\\\\ &= ${factorizeQuadratic(d, { variable: 'k' })}
				`)}
				If ${math(`k=${kAns}, \\blacksquare`)} then discriminant will be ${math(`0`)}
				which means that the curve will touch the ${math(`x`)}-axis
				so ${math(`y`)} cannot be negative. ${math(`\\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 6: 2017 P2 Q6
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const a = 9,
			b = new Expression([2, 'm'], 1),
			c1 = new Expression(1, 'c');
		const m = 'm',
			c = 'c';
		const curve = new xPolynomial([a, b, c1]);
		const line = new xPolynomial([m, c]);
		const body = `The equation of a curve is
			${math(`y = ${curve},`)} where ${math(m)} and
			${math(c)} are
			constants. The line ${math(`y = ${line}`)}
			is a tangent to the curve at the point ${math(`P.`)}
		`;
		// part a, b
		(() => {
			// part a
			const body = `Find the positive value of ${math(m)}.`;
			const workingA = new EquationWorking(curve, line);
			workingA.rhsZero({ show: false });
			let solA = `Equating the equations of the line and curve,
				${display(`${workingA}`)}
				${eqn(`\\qquad ${workingA.lhs} = 0`, { leqno: true })}
				Since the line is a tangent to the curve,
			`;
			const poly = workingA.lhs as xPolynomial;
			const [c, b, a] = poly.coeffs;
			const discriminant = poly.quadraticDiscriminant();
			const workingB = new EquationWorking(discriminant, 0, { aligned: true });
			const [m1, m2] = workingB.factorizeQuadratic({ variable: 'm' });
			solA += `${alignStar(`\\textrm{Discriminant} &= 0
					\\\\ (${b})^2 - 4(${a})(${c}) &= 0
					\\\\ ${b.square()} - ${a.times(4).times(c)} &= 0
					\\\\ ${workingB}
				`)}
				${gatherStar(`m = ${m1} \\textrm{ (rejected)} 
					\\\\ \\textrm{ or } \\quad m = ${m2} \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: solA });
			// part b
			const x = -2,
				y = 19;
			const bodyB = `Using this value of ${math(`m,`)}
				and given that the curve passes through
				${math(`(${x}, ${y}),`)}
				find the coordinates of
				${math(`P.`)}
			`;
			const curveRHS = curve.subIntoVariable(x).subIn({ m: m2 });
			const workingC = new EquationWorking(curveRHS, y, { aligned: true });
			workingC.moveTerm(0);
			const cVal = workingC.rhs.cast.toFraction();
			const poly2 = poly.subIntoCoeffs({ m: m2 });
			const workingD = new EquationWorking(poly2, 0, { aligned: true });
			const [xP] = workingD.factorizeQuadratic();
			const yP = new Polynomial([m2, cVal]).subIn(xP);
			const solB = `Substituting ${math(`m = ${m2}`)} 
				and ${math(`(${x}, ${y})`)} into the equation of the curve,
				${display(`${y} = 9 (${x})^2 + (2(${m2}) + 1) (${x}) + c`)}
				${alignStar(`${workingC}`)}
				Substituting ${math(`m = ${m2}`)} 
				into ${math(`(1),`)}
				${alignStar(`${workingD} \\\\ x = ${xP}`)}
				Substituting ${math(`x = ${xP}`)} into the equation of the line,
				${alignStar(`y &= ${m2}\\left(${xP}\\right) + ${cVal}
					\\\\ &= ${yP}
				`)}
				Coordinates of ${math(`P \\left(${xP}, ${yP}\\right) \\; \\blacksquare`)}
			`;
			parts.push({ body: bodyB });
			solParts.push({ body: solB });
		})();
		(() => {
			// part c
			const body = `Given that ${math(`L`)} is
				${strong('not')} a tangent to the
				curve, what can be deduced about
				${math(`L.`)}
			`;
			const uplevel = `The straight line ${math(`L`)}
				meets the curve at one point only.
			`;
			const solC = `${math(`L`)} is a vertical line parallel to the 
				${math(`y`)}-axis.
			`;
			parts.push({ body, uplevel });
			solParts.push({ body: solC });
		})();
		// part c
		(() => {
			//parts.push({ body });
			//solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 7: 2016 P1 Q1
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const k = 'k';
		const a = 2,
			b = new Term(-1, k),
			c = -4;
		const curve = new xPolynomial([a, b, c]);
		const m = -2,
			c1 = 12;
		const l1 = `${new Expression('y', [-m, 'x'])} = ${c1}`;
		const line = new Polynomial([m, c1]);
		const body = `The equation of a curve is
			${math(`y = ${curve},`)} where ${math(k)} is
			a constant, and the equation of a line is
			${math(`${l1}.`)}
		`;
		// part a
		(() => {
			const k = 6;
			const body = `In the case where ${math(`k = ${k},`)}
				find the coordinates of the point of intersection
				of the curve and the line.
			`;
			const working = new EquationWorking(curve.subIntoCoeffs({ k }), line);
			working.rhsZero();
			working.divide(2);
			const [x1, x2] = working.factorizeQuadratic();
			const y1 = line.subIn(x1);
			const y2 = line.subIn(x2);
			let sol = `Substituting ${math(`k = ${k}`)}
				and equating the equations of the line and curve,
				${gatherStar(`${working}
					\\\\ x = ${x1} \\; \\textrm{ or } \\; x = ${x2}
				`)}
				When ${math(`x = ${x1},`)}
				${alignStar(`y &= ${m}\\left(${x1}\\right) ${c}
					\\\\ &= ${y1}
				`)}
				When ${math(`x = ${x2},`)}
				${alignStar(`y &= ${m}\\left(${x2}\\right) ${c}
					\\\\ &= ${y2}
				`)}
				Coordinates of the points of intersection:
				${math(`(${x1}, ${y1}) \\; \\blacksquare`)}
				and 
				${math(`(${x2}, ${y2}) \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Show that, for all values of
				${math(`k,`)} the line intersects the curve
				at two distinct points.
			`;
			const d = curve.quadraticDiscriminant();
			const [c, b, a] = curve.coeffs;
			const sol = `${alignStar(`& \\textrm{Discriminant}
					\\\\ & = b^2 - 4 ac
					\\\\ &= (${b})^2 - 4(${a})(${c})
					\\\\ &= ${b.square()} + ${a.times(-4).times(c)}
					\\\\ &> 0 \\; \\textrm{ for all values of } k \\in \\mathbb{R}
				`)}
				Since the discriminant is ${math(`> 0,`)}
				the line intersects the curve at two distinct points for
				all values of ${math(`k. \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 8: 2015 P1 Q4
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const a = 'a',
			b = 6,
			c = 'c';
		// part a
		(() => {
			const poly = new xPolynomial([a, b, c]);
			const body = `Given that ${poly}
				is always negative, what conditions 
				must apply to the constants
				${math(a)} and ${math(`c?`)}
			`;
			const sol = `${align(`a &< 0 \\textrm{ and} \\\\ b^2 - 4ac &< 0`)}
				From ${math(`(2),`)}
				${alignStar(`${b}^2 - 4ac &< 0
					\\\\ 4ac &> ${b * b}
					\\\\ ac &> ${(b * b) / 4}
				`)}
				Hence ${math(`a < 0 \\; \\blacksquare`)}
				and ${math(`ac > 9 \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Give a example of values of ${math(`a`)}
				and ${math(`c`)} that satisfy the conditions
				found in part (i).
			`;
			const a = -2,
				c = -5;
			const sol = `${math(`a = ${a} \\; \\blacksquare`)} ${math(`c = ${c} \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ parts });
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
		<hr />
	{/each}
	<h3>Answers</h3>
	{#each answers as question}
		<Question {question} />
	{/each}
</section>
