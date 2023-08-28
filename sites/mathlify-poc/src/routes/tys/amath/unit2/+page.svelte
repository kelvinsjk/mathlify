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
		factorizeExpression,
	} from 'mathlify';
	import { align, alignStar, display, eqn, gatherStar, math, newline, strong } from 'mathlifier';

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
			const body = `Given that ${math(`${root}`)} is a root
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
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 5: 2017 P1 Q7
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const sqrt3 = new SquareRoot(3);
		const areaExp  = new Expression(9, sqrt3);
		const quarter = new Fraction(1,4);
		const area = new ExpansionTerm(quarter, areaExp);
		const AB = new Expression(sqrt3, 1);
		const angle = `60^{\\circ}`;
		const k = 'k';
		const body = `The triangle
			${math(`ABC`)} is such that the area is ${math(`${area} \\textrm{cm}^2,`)}
			the length of ${math(`AB`)} is
			${math(`\\left(${AB}\\right) \\textrm{cm}`)}
			and angle ${math(`BAC`)}
			is ${math(`${angle}.`)}
			${strong(`Without using a calculator,`)}
			find
		`;
		let AC: Expression;
		// part a
		(() => {
			const body = `the length, in cm, of
				${math(`AC`)} in the form
				${math(`a + b${sqrt3},`)}
				where ${math(`a`)} and ${math(`b`)} are integers,
			`;
			const half = new Fraction(1,2);
			const divisor = AB.times(sqrt3);
			let sol = `${gatherStar(`${half} ab \\sin C = \\textrm{Area}
				\\\\ ${half} \\left( ${AB} \\right) AC \\sin ${angle} = ${area}
				\\\\ ${half} \\left( ${AB} \\right) AC \\sin \\frac{${sqrt3}}{2} = ${area}
				\\\\ ${quarter} \\left( ${AB} \\right) ${sqrt3} \\; AC = ${area}
				\\\\ \\left( ${divisor} \\right) AC = ${areaExp}
			`)}`;
			const working = new ExpressionWorking(new RationalTerm(areaExp, divisor), {equalStart: true});
			working.rationalize();
			sol += `${alignStar(`AC ${working}
			`)}`;
			AC = working.exp as Expression;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `an expression, in ${math(`\\textrm{cm}^2`)} for
				${math(`BC^2`)} in the form
				${math(`c + d${sqrt3},`)}
				where ${math(`c`)} and ${math(`d`)} are integers.
			`;
			const answer = AB.square().plus(AC.square()).minus(AB.times(AC));
			let sol = `By the cosine rule,
				${alignStar(`& BC^2
					\\\\ &= AB^2 + AC^2 - 2 AB \\cdot AC \\cos \\angle BAC
					\\\\ &= \\left(${AB}\\right)^2 + \\left(${AC}\\right)^2 - 2 \\left(${AB}\\right)\\left(${AC}\\right) \\cos ${angle}
					\\\\ &= \\left(3 + 2${sqrt3} + 1 \\right) + (16 - 8${sqrt3} + 3) - 2 \\left( ${AB.times(AC)} \\right) \\frac{1}{2}
					\\\\ &= ${AB.square()} + ${AC.square()} - \\left(${AB.times(AC)}\\right)
					\\\\ &= ${answer} \\; \\blacksquare
				`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 6: 2015 P2 Q5
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const sqrt3 = new SquareRoot(3);
		let AC: Expression;
		let qn: RationalTerm;
		(() => {
			// part a
			const num = sqrt3.times(11);
			const den = new Expression(sqrt3.times(2), 1);
			qn = new RationalTerm(num, den);
			const body = `Express ${math(`\\displaystyle ${qn}`)}
				in the form ${math(`a + b${sqrt3},`)}
				where ${math(`a`)} and ${math(`b`)} are integers.
			`;
			const working = new ExpressionWorking(qn);
			working.rationalize();
			AC = working.exp as Expression;
			const sol = alignStar(`${working} \\; \\blacksquare`)
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		let BC2: Expression;
		const AB = new Expression(sqrt3, 1);
		(() => {
			// part b
			const uplevel = `The diagram shows a cuboid with a
				square base. The height ${math(`AB`)}
				of the cuboid is
				${math(`\\left( ${AB} \\right) \\textrm{cm}.`)}
				Given that the length of the diagonal
				${math(`AC`)} is
				${math(`\\displaystyle ${qn} \\textrm{ cm},`)}
			`
			const body = `Find an expression for
				${math(`BC^2`)} in the form
				in the form ${math(`c + d${sqrt3},`)}
				where ${math(`c`)} and ${math(`d`)} are integers,
			`;
			const BC2Working = new Expression(new ExpansionTerm([AC, 2]), new ExpansionTerm(-1, [AB,2]));
			const working = new ExpressionWorking(BC2Working, {equalStart: true});
			working.expand({intertext: `= 36 - 12 ${sqrt3} + 3 - \\left(3 + 2${sqrt3} + 1\\right)`});
			BC2 = working.exp as Expression;
			const sol = 'By Pythagoras Theorem,' + alignStar(`&BC^2
				\\\\ &= AC^2 - AB^2
				\\\\ ${working} \\; \\blacksquare`)
			parts.push({ uplevel, body });
			solParts.push({ body: sol });
		})();
		(() => {
			// part c
			const vol = new ExpansionTerm(new Fraction(7,2), new Expression(sqrt3.times(3), 'k'))
			const body = `express the volume of the cuboid in the form
				${math(`\\displaystyle ${vol} \\textrm{cm}^3,`)}
				where ${math('k')} is an integer.
			`;
			const x2 = factorizeExpression(BC2.divide(2));
			const x2Surd = x2.times(x2.coeff.reciprocal()).expand();
			const volume = new ExpansionTerm(x2.coeff, x2Surd.times(AB))
			const sol = `Let ${math(`x`)} be the length of each side of the square base.${newline}
				By Pythagoras Theorem,
				${alignStar(`x^2 + x^2 &= BC^2
					\\\\ 2x^2 &= ${BC2}	
					\\\\ x^2 &= ${factorizeExpression(BC2.divide(2))}	
				`)}
				${alignStar(`& \\textrm{Volume of cuboid}
					\\\\ &= x^2 \\cdot AB
					\\\\ &= ${x2} \\left(${AB}\\right)
					\\\\ &= ${x2.coeff} \\left( 5${sqrt3} + 5 - 2(3) - 2${sqrt3} \\right)
					\\\\ &= ${volume}	
				`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ parts });
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
