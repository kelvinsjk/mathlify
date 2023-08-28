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
		SquareRoot,
		ExpressionWorking,
		RationalTerm,
		solveLinear,
	} from 'mathlify';
	import { align, alignStar, display, eqn, gatherStar, math, strong } from 'mathlifier';

	const title = 'Unit 2: Surds';

	const questions: QuestionType[] = [];
	const answers: QuestionType[] = [];

	//! Question 1: 2016 P1 Q2
	(() => {
		const sqrt6 = new SquareRoot(6);
		const sqrt2 = new SquareRoot(2);
		const sqrt3 = new SquareRoot(3);
		const base = new Expression(sqrt6, sqrt2);
		const h = 'h';
		const volume = new Expression(16, sqrt3.times(4));
		const body = `A rectangular block has a square base of side
			${math(`\\left( ${base} \\right) \\textrm{cm}`)}
			and a height of
			${math(`${h} \\textrm{ cm}.`)}
			The volume of the rectangular block is
			${math(`\\left( ${volume} \\right) \\textrm{cm}^3.`)}
			${strong(`Without using a calculator,`)}
			show that ${math(`${h}`)}
			can be expressed as
			${math(`a + b ${sqrt3},`)}
			where ${math(`a`)}
			and ${math(`b`)}
			are integers.
		`;
		const workingArea = new ExpressionWorking(new ExpansionTerm([base, 2]), { equalStart: true });
		workingArea.expand({
			intertext: `= \\left(${sqrt6}\\right)^2 + 2 \\left(${sqrt6}\\right)\\left(${sqrt2}\\right) + \\left(${sqrt2}\\right)^2
				\\\\ &= ${sqrt6.square()} + 2\\sqrt{12} + ${sqrt2.square()}
			`,
		});
		let sol = `${alignStar(`&\\textrm{Area of square base}
			\\\\ ${workingArea}`)}
		`;
		const area = workingArea.exp as Expression;
		const workingH = new ExpressionWorking(new RationalTerm(volume, area), { equalStart: true });
		workingH.rationalize();
		sol += `${alignStar(`${h} ${workingH} \\; \\blacksquare`)}`;

		questions.push({ body });
		answers.push({ body: sol });
	})();

	//! Question 2: 2013 P2 Q8a
	(() => {
		const sqrt6 = new SquareRoot(6);
		const sqrt5 = new SquareRoot(5);
		const sqrt15 = new SquareRoot(15);
		const sqrt2 = new SquareRoot(2);
		const sqrt10 = new SquareRoot(10);
		const sqrt3 = new SquareRoot(3);
		const num = new Expression(sqrt6, sqrt5);
		const den = new Expression(sqrt15, sqrt2.negative());
		const qn = new RationalTerm(num, den);
		const body = `Without using a calculator, find the fractions,
			${math(`a`)} and ${math(`b,`)}
			for which ${math(`\\displaystyle ${qn}`)}
			can be expressed as
			${math(`a ${sqrt10} + b ${sqrt3}.`)}
		`;
		const working = new ExpressionWorking(qn);
		working.rationalize();
		const sol = `${alignStar(`${working}`)}
		`;
		questions.push({ body });
		answers.push({ body: sol });
	})();

	//! Question 3: 2019 P1 Q10b
	(() => {
		const sqrt7 = new SquareRoot(7);
		const volume = new Expression(sqrt7.times(3), -6);
		const height = new Expression(2, sqrt7);
		const r = 'r';
		const body = `A circular cylinder of volume
			${math(`\\left( ${volume} \\right) \\pi \\textrm{ cm}^3`)}
			has a height of
			${math(`\\left( ${height} \\right) \\textrm{cm}`)}
			and a radius of ${math(`${r} \\textrm{ cm}.`)}
			Without using a calculator,
			obtain an expression for ${math(`r^2`)}
			in the form
			${math(`\\left(a + b ${sqrt7}\\right),`)}
			where ${math(`a`)}
			and ${math(`b`)}
			are integers.
		`;
		const working = new ExpressionWorking(new RationalTerm(volume, height), { equalStart: true });
		working.rationalize();
		working.changeOrder([1, 0]);
		const sol = `${alignStar(`V &= \\pi r^2 h
			\\\\ r^2 &= \\frac{V}{\\pi h}	
			\\\\ &= \\frac{\\left( ${volume} \\right) \\pi}{\\pi \\left(${height}\\right)}
			\\\\ ${working}
		`)}`;

		questions.push({ body });
		answers.push({ body: sol });
	})();

	//! Question 4: 2014 P1 Q9
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const sqrt5 = new SquareRoot(5);
		const sqrt3 = new SquareRoot(3);
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
			const root = new Expression(3, sqrt5.times(2));
			const body = `Given that ${root} is a roots
				of the equation ${math(`x^2 + ax + b = 0,`)}
				where ${math(`a`)} and ${math(`b`)} are integers,
				find the value of ${math(`a`)} and ${math(`b.`)}
			`;
			const x2 = new ExpansionTerm([root, 2]);
			const ax = root.times('a');
			let sol = `Substituting ${math(`x = ${root}`)}
				into the equation,
				${gatherStar(`${x2} + a \\left( ${root} \\right) + b = 0
					\\\\ 3^2 + 2\\left(3\\right)\\left(${sqrt5.times(2)}\\right) + \\left(${sqrt5.times(
					2,
				)}\\right)^2 + ${ax} + b = 0
					\\\\ ${x2.expand()} + ${ax} + b = 0
					\\\\ \\left( 12 + 2a \\right) ${sqrt5} + (29 + 3a + b) = 0
				`)}
			`;
			const eqn1 = new Polynomial([12, 2], { variable: 'a', ascending: true });
			const a = solveLinear(eqn1, 0);
			const eqn2 = new Expression(29, [3, 'a'], 'b');
			const eqn2b = eqn2.subIn({ a });
			const b = solveLinear(eqn2b, 0, { variable: 'b' });
			sol += `Since ${math(`a`)} and ${math(`b`)} are integers,
				${align(`${eqn1} &= 0
					\\\\ ${eqn2} &= 0`)}
				From ${math(`(1),`)}
				${display(`a = ${a} \\; \\blacksquare`)}
				Substituting ${math(`a = ${a}`)} into ${math(`(2),`)}
				${gatherStar(`${eqn2b} = 0
					\\\\ b = ${b} \\; \\blacksquare
				`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const area = new Expression(24, new SquareRoot(48));
			const length = new Expression(6, new SquareRoot(12));
			const working = new ExpressionWorking(new RationalTerm(area.divide(2), length.divide(2)), {
				equalStart: true,
			});
			const areaString = `24 + \\sqrt{48}`;
			const lengthString = `6 + \\sqrt{12}`;
			const body = `A rectangle of length 
				${math(`\\left( ${lengthString} \\right) \\textrm{cm}`)}
				has an area of
				${math(`\\left( ${areaString} \\right) \\textrm{cm}^2.`)}
				${strong(`Without using a calculator,`)}
				find the breadth of the rectangle, in cm, in the form
				${math(`\\left( c + d ${sqrt3} \\right),`)}
				where ${math(`c`)} and ${math(`d`)} are integers.
			`;
			working.rationalize();
			working.expArray[working.expArray.length - 1] = `= \\left( ${working.expArray.at(
				-1,
			)} \\right) \\textrm{cm} \\; \\blacksquare`;
			const solB = alignStar(`& \\textrm{Breadth}
			\\\\ &= \\frac{${areaString}}{${lengthString}}
			\\\\ &= \\frac{${area}}{${length}}
				\\\\ ${working}
			`);
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
