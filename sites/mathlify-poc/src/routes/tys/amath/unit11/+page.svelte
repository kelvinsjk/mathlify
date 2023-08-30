<script lang="ts">
	import type { AnswerObject as QuestionType } from '$lib/components/interfaces';
	import {
		ExpansionTerm,
		Polynomial,
		xPolynomial,
		castToPoly,
		RationalFn,
		InequalityWorking,
		dydx,
		d2ydx2,
		GeneralFn,
		EquationWorking,
		SquareRoot,
		RationalTerm,
		Fraction,
		longDivision,
		Expression,
		ExpressionWorking,
		Term,
	} from 'mathlify';
	import {
		align,
		alignStar,
		alignatStar,
		display,
		eqn,
		gatherStar,
		math,
		newParagraph,
		newline,
		strong,
	} from 'mathlifier';
	import Answer2 from '$lib/components/Answer2.svelte';

	const title = 'Unit 11: Applications of Differentiation';

	const questions: QuestionType[] = [];
	const answers: QuestionType[] = [];

	const f = `\\operatorname{f}`;
	const fxString = `\\operatorname{f}(x)`;
	const fPrimeString = `\\operatorname{f}'(x)`;

	function quotientRuleWorking(rational: RationalFn): string {
		const f = rational.numFn;
		const g = rational.denFn;
		const fPrime = f.differentiate();
		const gPrime = g.differentiate();
		const fBrackets = `${f}`.length > 1 ? `\\left(${f}\\right)` : `${f}`;
		const gBrackets = `${g}`.length > 1 ? `\\left(${g}\\right)` : `${g}`;
		const fPrimeBrackets = `${fPrime}`.length > 1 ? `\\left(${fPrime}\\right)` : `${fPrime}`;
		const gPrimeBrackets = `${gPrime}`.length > 1 ? `\\left(${gPrime}\\right)` : `${gPrime}`;
		return `\\frac{${fPrimeBrackets}${gBrackets} - ${fBrackets}${gPrimeBrackets}}{\\left(${g}\\right)^2}`;
	}

	//! Question 1: 2020 P1 Q6
	(() => {
		const x2 = new Polynomial([1, 0, 0]);
		const rational = new RationalFn(4, x2);
		const y = new GeneralFn(x2, rational);
		const body = `Find the coordinates of the stationary points
			of the curve ${math(`\\displaystyle y = ${y}`)}
			and determine the nature of each stationary point.
		`;
		const derivative = y.differentiateToFn({ divisor: new Polynomial(1) });
		let sol = `${alignStar(`y &= ${y}
			\\\\ &= ${x2} + 4x^{-2}
			\\\\ ${dydx()} &= ${x2.differentiate()} - 8x^{-3}
			\\\\ &= ${derivative}
		`)}
		`;
		const working = new EquationWorking(derivative, 0, { aligned: true });
		working.moveTerm(1);
		working.crossMultiply();
		working.divide(2);
		sol +=
			`At stationary points,` +
			alignStar(`${dydx()} &= 0
			\\\\ ${working}
		`);
		const sqrt2 = new SquareRoot(2);
		const yVal = 4;
		sol += `Since ${math(`x^2 \\geq 0,`)}
			${alignStar(`x^2 &= 2
				\\\\ x &= \\pm ${sqrt2}
				\\\\ y &= ${y}
				\\\\ &= 2 + \\frac{4}{2}
				\\\\ &= ${yVal}
				`)}
		`;
		const d2 = derivative.differentiate({ divisor: x2 });
		sol += `${alignStar(`${dydx()} &= ${x2.differentiate()} - 8x^{-3}
			\\\\ ${d2ydx2()} &= ${x2.differentiate().differentiate()} +24 x^{-4}
			\\\\ &= ${d2}
			\\\\ &> 0 \\; \\Rightarrow \\text{minimum points}
		`)}
			Hence the stationary points are ${math(
				`\\left(${sqrt2}, ${yVal}\\right) \\; \\blacksquare`,
			)} and ${math(`\\left(-${sqrt2}, ${yVal}\\right) \\blacksquare`)}
			and both are ${strong('minimum')} points ${math(`\\; \\blacksquare`)}
		`;
		questions.push({ body });
		answers.push({ body: sol });
	})();

	//! Question 2: 2019 P1 Q4
	(() => {
		const x = 10;
		const rate = 48;
		const body = `An ice cube of side ${math(`x \\textrm{ cm}`)}
			is melting in such a way that the total surface area,
			${math(`A \\textrm{ cm}^2,`)}
			is decreasing at a constant rate of
			${math(`${rate} \\textrm{ cm}^2\\textrm{/s}.`)}
			Assuming that the cube retains its shape, calculate the rate of change
			of ${math(`x`)}
			when ${math(`x=${x}.`)}
		`;
		const A = new Polynomial([6, 0, 0]);
		const dAdx = A.differentiate();
		let sol = `${alignStar(`A &= ${A}
			\\\\ ${dydx({ y: 'A' })} &= ${dAdx}
		`)}
		`;
		const ans = new Fraction(-rate).divide(dAdx.subIn(x));
		sol +=
			alignStar(
				`${dydx({ y: 'A', x: 't' })} &= ${dydx({ y: 'A', x: 'x' })} \\times ${dydx({
					y: 'x',
					x: 't',
				})}
			\\\\ -48 &= ${dAdx} \\times ${dydx({ y: 'x', x: 't' })}
			\\\\ -48 &= ${dAdx.subInWorking(x)} \\times ${dydx({ y: 'x', x: 't' })}
		`,
			) +
			alignStar(`
			${dydx({ y: 'x', x: 't' })} &= \\frac{-48}{${dAdx.subIn(x)}}
			\\\\ &= ${ans} \\textrm{cm/s} \\; \\blacksquare
			`);
		questions.push({ body });
		answers.push({ body: sol });
	})();

	//! Question 3: 2019 P1 Q8
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const x = new Polynomial(1);
		const num = new Polynomial([2, 5]);
		const den = new Polynomial([1, -2]);
		const rational = new RationalFn(num, den);
		const y = new GeneralFn(x, rational);
		const derivative = y.differentiate();
		const d2 = new RationalTerm(18, new ExpansionTerm([den, 3]));
		let x1: Fraction, x2: Fraction;
		const body = `The equation of a curve is ${math(`\\displaystyle y= ${y}.`)}`;
		// part a
		(() => {
			const body = `Find ${math(`\\displaystyle ${dydx()}`)}
				and ${math(`\\displaystyle ${d2ydx2()}.`)}
			`;
			const sol =
				alignStar(`y &= ${y}
				\\\\ ${dydx()} &= 1 + ${quotientRuleWorking(rational)}
				\\\\ &= ${derivative} \\; \\blacksquare
			`) +
				alignStar(`${dydx()} &= 1 - 9\\left(x-2\\right)^{-2}
				\\\\ ${d2ydx2()} &= 18 \\left(x-2\\right)^{-3}
				\\\\ &= ${d2} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Find the ${math(`x`)}-coordinate
				of each of the stationary points of the curve.
			`;
			const working = new EquationWorking(derivative);
			working.moveTerm(1);
			working.crossMultiply();
			working.rhsZero();
			[x1, x2] = working.factorizeQuadratic();
			const sol = `At stationary points, ${math(`\\displaystyle ${dydx()} = 0`)} 
				${gatherStar(`${working}
					\\\\ x = ${x1} \\; \\textrm{ or } \\; ${x2} \\; \\blacksquare
				`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part c
		(() => {
			const body = `Find the nature of the stationary point.
			`;
			const sol = `When ${math(`x=${x1},`)}
				${alignStar(`${d2ydx2()} &= \\frac{18}{(${x1}-2)^3}
					\\\\ &= ${d2.subIn({ x: x1 }).cast.toFraction()}
					\\\\ &< 0 \\; \\Rightarrow \\text{maximum point}
				`)}
				Hence it is a ${strong('maximum')} point at ${math(`x=${x1} \\; \\blacksquare`)}
				${newParagraph}
				When ${math(`x=${x2},`)}
				${alignStar(`${d2ydx2()} &= \\frac{18}{(${x2}-2)^3}
					\\\\ &= ${d2.subIn({ x: x2 }).cast.toFraction()}
					\\\\ &> 0 \\; \\Rightarrow \\text{minimum point}
				`)}
				Hence it is a ${strong('minimum')} point at ${math(`x=${x2} \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 4: 2017 P2 Q8b
	//TODO: powerFn
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const x = new Polynomial(1);
		const num = new Polynomial([2, 5]);
		const den = new Polynomial([1, -2]);
		const rational = new RationalFn(num, den);
		const y = new GeneralFn(x, rational);
		const derivative = y.differentiate();
		const d2 = new RationalTerm(18, new ExpansionTerm([den, 3]));
		let x1: Fraction, x2: Fraction;
		const body = `The equation of a curve is ${math(`\\displaystyle ${y}.`)}`;
		// part a
		(() => {
			const body = `Find ${math(`\\displaystyle ${dydx()}`)}
				and ${math(`\\displaystyle ${d2ydx2()}.`)}
			`;
			const sol =
				alignStar(`y &= ${y}
				\\\\ ${dydx()} &= 1 + ${quotientRuleWorking(rational)}
				\\\\ &= ${derivative} \\; \\blacksquare
			`) +
				alignStar(`${dydx()} &= 1 - 9\\left(x-2\\right)^{-2}
				\\\\ ${d2ydx2()} &= 18 \\left(x-2\\right)^{-3}
				\\\\ &= ${d2} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Find the ${math(`x`)}-coordinate
				of each of the stationary points of the curve.
			`;
			const working = new EquationWorking(derivative);
			working.moveTerm(1);
			working.crossMultiply();
			working.rhsZero();
			[x1, x2] = working.factorizeQuadratic();
			const sol = `At stationary points, ${math(`\\displaystyle ${dydx()} = 0`)} 
				${gatherStar(`${working}
					\\\\ x = ${x1} \\; \\textrm{ or } \\; ${x2} \\; \\blacksquare
				`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part c
		(() => {
			const body = `Find the nature of the stationary point.
			`;
			const sol = `${alignStar(`${dydx()} &= ${derivative}
				\\\\ ${d2ydx2()} &=
			`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 5: 2016 P1 Q9
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const poly = new Polynomial([2, 0, -1], { ascending: true });
		const num = -16;
		const xSquare = new Polynomial([1, 0, 0]);
		const rational = new RationalFn(num, xSquare);
		const y = new GeneralFn(poly, rational);
		const derivative = y.differentiate({ divisor: new Polynomial(1) });
		const derivativeFn = y.differentiateToFn({ divisor: new Polynomial(1) });
		const d2 = derivativeFn.differentiate({ divisor: xSquare });
		const x1 = 2,
			x2 = -2;
		let y1: Fraction, y2: Fraction;
		const body = `The equation of a curve is ${math(`\\displaystyle y=${y}.`)}`;
		// part a
		(() => {
			const body = `Find the coordinates of
				the stationary points of the curve.
			`;
			let sol = alignStar(`y &= ${y}
				\\\\ &= ${poly} - 16x^{-2}
				\\\\ ${dydx()} &= ${poly.differentiate()} + 32x^{-3}
				\\\\ &= ${derivative} \\; \\blacksquare
			`);
			const working = new EquationWorking(derivative, 0, { aligned: true });
			working.moveTerm(0);
			working.crossMultiply({ show: false });
			working.swap();
			working.divide(2);
			sol += `At stationary points, ${math(`\\displaystyle ${dydx()} = 0`)} 
				${alignStar(`${working}
					\\\\ x &= \\pm 2
				`)}
			`;
			y1 = poly.subIn(x1).plus(rational.subIn({ x: x1 }).cast.toFraction());
			y2 = poly.subIn(x2).plus(rational.subIn({ x: x2 }).cast.toFraction());
			sol += `${alignStar(`y&= ${y}
					\\\\ &= 2 - 4 - \\frac{16}{4}
					\\\\ &= ${y1}
				`)}
				Hence the stationary points are ${math(`\\left(${x1}, ${y1}\\right)`)} and ${math(
				`\\left(${x2}, ${y2}\\right) \\; \\blacksquare`,
			)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Use the second derivative test to determine the nature
				of each of these points.
			`;
			const sol = `${alignStar(`${dydx()} &= ${derivative}
				\\\\ &= -2x + 32x^{-3}
				\\\\ ${d2ydx2()} &= -2 -96x^{-4}
				\\\\ &= ${d2}
				\\\\ &< 0 \\; \\Rightarrow \\text{maximum point}
			`)}
			Hence both ${math(`\\left(${x1}, ${y1}\\right)`)} and ${math(
				`\\left(${x2}, ${y2}\\right)`,
			)} are ${strong('maximum')} points ${math(`\\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 6: 2015 P2 Q6
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const num = new Polynomial([2, 0, 0]);
		const den = new Polynomial([1, -1]);
		const y = new RationalFn(num, den);
		const derivative = y.differentiate();
		const derivativeFn = y.differentiateToFn();
		const d2 = `\\frac{4}{\\left(${den}\\right)^3}`;
		let x1: Fraction, x2: Fraction;
		let y1: Fraction, y2: Fraction;
		const body = `The equation of a curve is ${math(`\\displaystyle y=${y}.`)}`;
		// part a
		(() => {
			const body = `Find an expression for
				${math(`\\displaystyle ${dydx()}`)}
			  and obtain the coordinates of
				the stationary points of the curve.
			`;
			let sol = alignStar(`y &= ${y}
				\\\\ ${dydx()} &= ${quotientRuleWorking(y)}
				\\\\ &= ${derivative} \\; \\blacksquare
			`);
			const working = new EquationWorking(derivative, 0, { aligned: true });
			working.crossMultiply();
			working.divide(2);
			[x1, x2] = working.factorizeQuadratic();
			y1 = y.subIn({ x: x1 }).cast.toFraction();
			y2 = y.subIn({ x: x2 }).cast.toFraction();
			sol += `At stationary points, ${math(`\\displaystyle ${dydx()} = 0`)} 
				${alignStar(`${working}`)}
				${display(`x=${x1} \\; \\textrm{ or } \\; x=${x2}`)}
				When ${math(`x=${x1},`)}
				${alignStar(`y &= \\frac{2(0)^2}{0-1}
					\\\\ &= ${y1}
				`)}
				When ${math(`x=${x2},`)}
				${alignStar(`y &= \\frac{2(2)^2}{2-1}
					\\\\ &= ${y2}
				`)}
				Hence the stationary points are ${math(`\\left(${x1}, ${y1}\\right)`)} and ${math(
				`\\left(${x2}, ${y2}\\right) \\; \\blacksquare`,
			)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Find an expression for
				${math(`\\displaystyle ${d2ydx2()}`)}
				and hence determine the nature of these
				stationary points.
			`;
			const num = derivativeFn.numFn;
			const sol = `${alignStar(`${dydx()} &= ${derivative}
				\\\\ ${d2ydx2()} &= \\frac{\\left(${num.differentiate()}\\right)\\left(${den}\\right)^2 - \\left(${num}\\right)2\\left(${den}\\right)(1)}{\\left(${den}\\right)^4}
				\\\\ &= \\frac{4\\left(${den}\\right)\\left( \\left(${den}\\right)^2 - \\left( ${num.divide(
				2,
			)} \\right) \\right)}{\\left(${den}\\right)^4}
					\\\\ &= \\frac{4\\left( x^2 - 2x + 1 - x^2 + 2x  \\right)}{\\left(x-1\\right)^3}
				\\\\ &= ${d2} \\; \\blacksquare
			`)}
				When ${math(`x=${x1},`)}
				${alignStar(`${d2ydx2()} &= \\frac{4}{(${x1}-1)^3}
					\\\\ &< 0 \\; \\Rightarrow \\text{maximum point}
				`)}
				When ${math(`x=${x2},`)}
				${alignStar(`${d2ydx2()} &= \\frac{4}{(${x2}-1)^3}
					\\\\ &> 0 \\; \\Rightarrow \\text{minimum point}
				`)}
				Hence ${math(`\\left(${x1}, ${y1}\\right)`)} is a ${strong('maximum')}
				point and ${math(`\\left(${x2}, ${y2}\\right)`)} is a ${strong('minimum')}
				point ${math(`\\blacksquare`)}

			`;
			//Hence both ${math(`\\left(${x1}, ${y1}\\right)`)} and ${math(
			//	`\\left(${x2}, ${y2}\\right)`,
			//)} are ${strong('maximum')} points ${math(`\\blacksquare`)}
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 7: 2014 P1 Q3
	(() => {
		const dydt = new Fraction(3, 100);
		const dydtVal = dydt.toFixed(2);
		const dxdt = new Fraction(12, 100);
		const dxdtVal = dxdt.toFixed(2);
		const poly = new Polynomial([2]);
		const x2 = new Polynomial([1, 0, 0]);
		const num = -1;
		const rational = new RationalFn(num, x2);
		const y = new GeneralFn(poly, rational);
		const derivative = y.differentiateToFn({ divisor: new Polynomial(1) });
		const body = `A particle moves along the curve
			${math(`\\displaystyle y = ${y}`)}
			in such a way that the ${math(`y`)}-coordinate
			of the particle is increasing at a constant rate of
			${math(`${dydtVal}`)} units per second. Find the ${math(`y`)}-coordinate
			of the particle at the instant that the ${math(`x`)}-coordinate
			of the particle is increasing at ${math(`${dxdtVal}`)} units per second.
		`;
		const x = 2;
		const yVal = poly.plus(rational.subIn({ x }).cast.toFraction());
		const sol = `${alignStar(`y &= ${y}
			\\\\ &= 2 - x^{-2}
			\\\\ ${dydx()} &= 2x^{-3}
			\\\\ &= ${derivative}
		`)}
			${alignStar(`${dydx({ x: 't' })} &= ${dydx()} \\times ${dydx({ y: 'x', x: 't' })}
				\\\\ ${dydtVal} &= ${derivative} \\times ${dxdtVal}
				\\\\ ${dydtVal} x^3 &= ${dxdt.times(2).valueOf()}
				\\\\ x^3 &= ${dxdt.times(2).divide(dydt).valueOf()}
				\\\\ x &= 2
			`)}
			${alignStar(`y &= 2 - \\frac{1}{2^2}
				\\\\ y &= ${yVal} \\; \\blacksquare
			`)}
		`;
		questions.push({ body });
		answers.push({ body: sol });
	})();

	//! Question 8: 2013 P1 Q9
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const y = new Polynomial([2, 3, -5]);
		const body = `The equation of a curve is ${math(`\\displaystyle y=${y}.`)}`;
		// part a
		(() => {
			const body = `Find the set of values of ${math(`x`)}
				for which ${math(`y+3 > 0.`)}
			`;
			const poly = y.plus(3);
			const working = new InequalityWorking(poly, 0, { sign: '>' });
			const intervals = working.factorizeQuadratic();
			const sol = gatherStar(`y + 3 > 0
				\\\\ ${working}
				\\\\ ${intervals[0]} \\; \\textrm{ or } \\; ${intervals[1]} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const dxdt = new Fraction(4, 100);
			const dxdtVal = dxdt.toFixed(2);
			const dydt = new Fraction(2, 10);
			const dydtVal = dydt.toFixed(1);
			const uplevel = `A particle moves along the curve
				${math(`y=2x^2+3x-5.`)}
				At point ${math(`P`)} the
				${math(`x`)}-coordinate of the particle is
				increasing at a rate of ${math(`${dxdtVal}`)} units/sec
				and the ${math(`y`)}-coordinate of the particle is
				increasing at ${math(`${dydtVal}`)} units/sec.
			`;
			const body = `Find the coordinates of ${math(`P.`)}
			`;
			const derivative = y.differentiate();
			let sol = `${alignStar(`y &= ${y}
				\\\\ ${dydx()} &= ${derivative} `)}
			`;
			const working = new EquationWorking(derivative, dydt.divide(dxdt), { aligned: true });
			const x = working.solveLinear();
			sol += alignStar(`${dydx({ x: 't' })} &= ${dydx()} \\times ${dydx({ y: 'x', x: 't' })}
				\\\\ ${dydtVal} &= (${derivative}) \\times ${dxdtVal}
				\\\\ ${working}
				`);
			const yVal = y.subIn(x);
			sol +=
				alignStar(`y &= ${y.subInWorking(x)}
				\\\\ &= ${yVal}
			`) + `Coordinates of ${math(`P\\left(${x}, ${yVal}\\right) \\; \\blacksquare`)}`;
			parts.push({ uplevel, body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 9: 2013 P1 Q11
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const num = new Polynomial([1, 0, 0]);
		const den = new Polynomial([1, 2]);
		const y = new RationalFn(num, den);
		const derivative = y.differentiate();
		const derivativeFn = y.differentiateToFn();
		const d2 = `\\frac{8}{\\left(${den}\\right)^3}`;
		let x1: Fraction, x2: Fraction;
		let y1: Fraction, y2: Fraction;
		const body = `The equation of a curve is ${math(`\\displaystyle y=${y}.`)}`;
		// part a
		(() => {
			const body = `Find an expression for
				${math(`\\displaystyle ${dydx()}`)}
			  and ${math(`\\displaystyle ${d2ydx2()}.`)}
			`;
			let sol = alignStar(`y &= ${y}
				\\\\ ${dydx()} &= ${quotientRuleWorking(y)}
				\\\\ &= ${derivative} \\; \\blacksquare
			`);
			const num = derivativeFn.numFn;
			sol += alignStar(`${dydx()} &= ${derivative}
				\\\\ ${d2ydx2()} &= \\frac{\\left(${num.differentiate()}\\right)\\left(${den}\\right)^2 - \\left(${num}\\right)2\\left(${den}\\right)(1)}{\\left(${den}\\right)^4}
				\\\\ &= \\frac{2\\left(${den}\\right)\\left( \\left(${den}\\right)^2 - \\left( ${num} \\right) \\right)}{\\left(${den}\\right)^4}
					\\\\ &= \\frac{2\\left( ${den.square()} - x^2 - 4x  \\right)}{\\left(${den}\\right)^3}
				\\\\ &= ${d2} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Determine the nature of each of the
				stationary points of the curve.
			`;
			const working = new EquationWorking(derivative, 0, { aligned: true });
			working.crossMultiply();
			[x1, x2] = working.factorizeQuadratic();
			y1 = y.subIn({ x: x1 }).cast.toFraction();
			y2 = y.subIn({ x: x2 }).cast.toFraction();
			const dTwo1 = new Fraction(8).divide(den.subIn(x1).pow(3));
			const dTwo2 = new Fraction(8).divide(den.subIn(x2).pow(3));
			let sol = `At stationary points, ${math(`\\displaystyle ${dydx()} = 0`)} 
				${alignStar(`${working}`)}
				${display(`x=${x1} \\; \\textrm{ or } \\; x=${x2}`)}
				When ${math(`x=${x1},`)}
				${alignStar(`y &= \\frac{(${x1})^2}{${x1}+2}
					\\\\ &= ${y1}
					\\\\ ${d2ydx2()} &= \\frac{8}{(${x1}+2)^3}
					\\\\ &= ${dTwo1}
					\\\\ &< 0 \\; \\Rightarrow \\text{maximum point}
				`)}
				When ${math(`x=${x2},`)}
				${alignStar(`y &= \\frac{${x2}^2}{${x2}+2}
					\\\\ &= ${y2}
					\\\\ ${d2ydx2()} &= \\frac{8}{(${x2}+2)^3}
					\\\\ &= ${dTwo2}
					\\\\ &> 0 \\; \\Rightarrow \\text{minimum point}
				`)}
				Hence the stationary points are ${math(`\\left(${x1}, ${y1}\\right),`)}
				which is a ${strong('maximum')} point
				and ${math(`\\left(${x2}, ${y2}\\right)`)} which is a ${strong('minimum')} point ${math(
				`\\blacksquare`,
			)}
			`;
			//Hence both ${math(`\\left(${x1}, ${y1}\\right)`)} and ${math(
			//	`\\left(${x2}, ${y2}\\right)`,
			//)} are ${strong('maximum')} points ${math(`\\blacksquare`)}
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 10: 2018 P1 Q7
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const x2 = new Polynomial([0, 0, 1], { ascending: true });
		const term2 = new Polynomial([36, -1], { ascending: true });
		const y = x2.times(term2);
		const dVdt = 18;
		const r = 12;
		const oneThird = new Fraction(1, 3);
		const x = 9;
		const body = `Water is poured, at a constant rate of
			${math(`${dVdt} \\pi \\textrm{ cm}^3\\textrm{/s},`)}
			into a hemispherical bowl of radius ${math(`${r} \\textrm{ cm}.`)}
			When the depth of water directly below the center is ${math(`x \\textrm{ cm},`)}
			the volume, ${math(`V \\textrm{ cm}^3,`)} of water in the bowl is given by
			${display(`V = ${oneThird} \\pi ${x2} \\left( ${term2} \\right).`)}
			Find
		`;
		// part a
		(() => {
			const body = `the time taken for the depth of water directly below the centre to reach
				${math(`${x} \\textrm{ cm}.`)}
			`;
			let sol = alignStar(`V &= ${oneThird} \\pi ${x2} \\left( ${term2} \\right)
				\\\\ &= ${oneThird} \\pi \\left( ${y} \\right)
			`);
			sol += `When ${math(`x=${x},`)}`;
			const V = y.subIn(x).divide(3);
			sol += alignStar(`V &= ${oneThird} \\pi \\left( ${y.subInWorking(x)} \\right)
				\\\\ &= ${V} \\pi
			`);
			const t = V.divide(dVdt);
			sol += alignStar(`&\\textrm{Time taken}
				\\\\ &= \\frac{${V}\\pi}{${dVdt}\\pi}
				\\\\ &= ${t} \\textrm{ s} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `the rate of change of the depth of water directly below the centre at
				this time.
			`;
			const derivative3 = y.differentiate();
			const derivative = derivative3.divide(3);
			const dVdx = dydx({ y: 'V' });
			let sol = alignStar(`V &= ${oneThird} \\pi \\left( ${y} \\right)
				\\\\ ${dVdx} &= ${oneThird} \\pi \\left( ${derivative3} \\right)
				\\\\ &= \\pi \\left( ${derivative} \\right)
			`);
			const dxdt = dydx({ y: 'x', x: 't' });
			const ans = new Fraction(dVdt).divide(derivative.subIn(x));
			sol += alignStar(`${dydx({ y: 'V', x: 't' })} &= ${dVdx} \\times ${dydx({
				y: 'x',
				x: 't',
			})}
				\\\\ ${dVdt} \\pi &= \\pi (${derivative}) \\times ${dxdt}
				\\\\ ${dxdt} &= \\frac{${dVdt}}{${derivative.subInWorking(x)}}
				\\\\ &= ${ans} \\textrm{ cm/s} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 11: 2018 P1 Q10
	//TODO: power term
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const x2 = new Polynomial([0, 0, 1], { ascending: true });
		const term2 = new Polynomial([36, -1], { ascending: true });
		const y = x2.times(term2);
		const dVdt = 18;
		const r = 12;
		const oneThird = new Fraction(1, 3);
		const x = 9;
		const body = `Water is poured, at a constant rate of
			${math(`${dVdt} \\pi \\textrm{ cm}^3\\textrm{/s},`)}
			into a hemispherical bowl of radius ${math(`${r} \\textrm{ cm}.`)}
			When the depth of water directly below the center is ${math(`x \\textrm{ cm},`)}
			the volume, ${math(`V \\textrm{ cm}^3,`)} of water in the bowl is given by
			${display(`V = ${oneThird} \\pi ${x2} \\left( ${term2} \\right).`)}
			Find
		`;
		// part a
		(() => {
			const body = `the time taken for the depth of water directly below the centre to reach
				${math(`${x} \\textrm{ cm}.`)}
			`;
			let sol = alignStar(`V &= ${oneThird} \\pi ${x2} \\left( ${term2} \\right)
				\\\\ &= ${oneThird} \\pi \\left( ${y} \\right)
			`);
			sol += `When ${math(`x=${x},`)}`;
			const V = y.subIn(x).divide(3);
			sol += alignStar(`V &= ${oneThird} \\pi \\left( ${y.subInWorking(x)} \\right)
				\\\\ &= ${V} \\pi
			`);
			const t = V.divide(dVdt);
			sol += alignStar(`&\\textrm{Time taken}
				\\\\ &= \\frac{${V}\\pi}{${dVdt}\\pi}
				\\\\ &= ${t} \\textrm{ s} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `the rate of change of the depth of water directly below the centre at
				this time.
			`;
			const derivative3 = y.differentiate();
			const derivative = derivative3.divide(3);
			const dVdxVal = derivative.subIn(x);
			const dVdx = dydx({ y: 'V' });
			let sol = alignStar(`V &= ${oneThird} \\pi \\left( ${y} \\right)
				\\\\ ${dVdx} &= ${oneThird} \\pi \\left( ${derivative3} \\right)
				\\\\ &= \\pi \\left( ${derivative} \\right)
			`);
			const dxdt = dydx({ y: 'x', x: 't' });
			const ans = new Fraction(dVdt).divide(derivative.subIn(x));
			sol += alignStar(`${dydx({ y: 'V', x: 't' })} &= ${dVdx} \\times ${dydx({
				y: 'x',
				x: 't',
			})}
				\\\\ ${dVdt} \\pi &= \\pi (${derivative}) \\times ${dxdt}
				\\\\ ${dxdt} &= \\frac{${dVdt}}{${derivative.subInWorking(x)}}
				\\\\ &= ${ans} \\textrm{ cm/s} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 12: 2017 P1 Q6
	//TODO: diagram
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const A = new Polynomial([0, 216, new Fraction(-9, 2)], { ascending: true });
		const length = 288;
		const body = `A tennis club makes three equally sized tennis courts, positioned
			next to each other as shown in the diagram below. Each tennis court is rectangular
			and has side length ${math(`x \\textrm{ m}`)} and ${math(`y \\textrm{ m}.`)}
			The lines in the diagram represent wire netting. The total length of wire
			netting used is ${math(`${length} \\textrm{ m}.`)}
		`;
		let num: Polynomial;
		// part a
		(() => {
			const body = `Show that the total area, ${math(`A \\textrm{m}^2,`)}
				of the three tennis courts is given by
				${display(`A = ${A}.`)}
			`;
			num = new Polynomial([length, -6], { ascending: true });
			let sol = gatherStar(`4y + 6x = ${length}`);
			sol += eqn(`y = \\frac{${num}}{4}`, { leqno: true });
			sol += alignStar(`A &= 3xy
				\\\\ &= 3x \\left( \\frac{${num}}{4} \\right)
				\\\\ &= ${num.times(new Polynomial(3)).divide(4)} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Given that ${math(`x`)} can vary, find the dimensions of each
				tennis court that make ${math(`A`)} a maximum.
				${newline}
				(You are not required to show that ${math(`A`)} is a maximum.)
			`;
			const dAdx = dydx({ y: 'A' });
			const derivative = A.differentiate();
			let sol = alignStar(`A &= ${A}
				\\\\ ${dAdx} &= ${derivative}
			`);
			const working = new EquationWorking(derivative, 0, { aligned: true });
			const x = working.solveLinear();
			const y = num.subIn(x).divide(4);
			sol += `At maximum value of ${math(`A,`)} ${math(`\\displaystyle ${dAdx} = 0`)}
				${alignStar(`${working}`)}
				Substituting ${math(`x=${x}`)} into ${math(`(1),`)}
				${alignStar(`y &= \\frac{${num.subInWorking(x)}}{4}
					\\\\ &= ${y}
				`)}
				Hence the dimensions of each tennis court is ${math(
					`${y} \\textrm{ m by } ${x} \\textrm{ m} \\; \\blacksquare`,
				)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 13: 2016 P1 Q7
	//TODO: PowerTerm/SquareRoot
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const A = new Polynomial([0, 216, new Fraction(-9, 2)], { ascending: true });
		const length = 288;
		const body = `A tennis club makes three equally sized tennis courts, positioned
			next to each other as shown in the diagram below. Each tennis court is rectangular
			and has side length ${math(`x \\textrm{ m}`)} and ${math(`y \\textrm{ m}.`)}
			The lines in the diagram represent wire netting. The total length of wire
			netting used is ${math(`${length} \\textrm{ m}.`)}
		`;
		let num: Polynomial;
		// part a
		(() => {
			const body = `Show that the total area, ${math(`A \\textrm{m}^2,`)}
				of the three tennis courts is given by
				${display(`A = ${A}.`)}
			`;
			num = new Polynomial([length, -6], { ascending: true });
			let sol = gatherStar(`4y + 6x = ${length}`);
			sol += eqn(`y = \\frac{${num}}{4}`, { leqno: true });
			sol += alignStar(`A &= 3xy
				\\\\ &= 3x \\left( \\frac{${num}}{4} \\right)
				\\\\ &= ${num.times(new Polynomial(3)).divide(4)} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Given that ${math(`x`)} can vary, find the dimensions of each
				tennis court that make ${math(`A`)} a maximum.
				${newline}
				(You are not required to show that ${math(`A`)} is a maximum.)
			`;
			const dAdx = dydx({ y: 'A' });
			const derivative = A.differentiate();
			let sol = alignStar(`A &= ${A}
				\\\\ ${dAdx} &= ${derivative}
			`);
			const working = new EquationWorking(derivative, 0, { aligned: true });
			const x = working.solveLinear();
			const y = num.subIn(x).divide(4);
			sol += `At maximum value of ${math(`A,`)} ${math(`\\displaystyle ${dAdx} = 0`)}
				${alignStar(`${working}`)}
				Substituting ${math(`x=${x}`)} into ${math(`(1),`)}
				${alignStar(`y &= \\frac{${num.subInWorking(x)}}{4}
					\\\\ &= ${y}
				`)}
				Hence the dimensions of each tennis court is ${math(
					`${y} \\textrm{ m by } ${x} \\textrm{ m} \\; \\blacksquare`,
				)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 14: 2016 P2 Q6
	//TODO: ExpansionTerm/Product rule
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const A = new Polynomial([0, 216, new Fraction(-9, 2)], { ascending: true });
		const length = 288;
		const body = `A tennis club makes three equally sized tennis courts, positioned
			next to each other as shown in the diagram below. Each tennis court is rectangular
			and has side length ${math(`x \\textrm{ m}`)} and ${math(`y \\textrm{ m}.`)}
			The lines in the diagram represent wire netting. The total length of wire
			netting used is ${math(`${length} \\textrm{ m}.`)}
		`;
		let num: Polynomial;
		// part a
		(() => {
			const body = `Show that the total area, ${math(`A \\textrm{m}^2,`)}
				of the three tennis courts is given by
				${display(`A = ${A}.`)}
			`;
			num = new Polynomial([length, -6], { ascending: true });
			let sol = gatherStar(`4y + 6x = ${length}`);
			sol += eqn(`y = \\frac{${num}}{4}`, { leqno: true });
			sol += alignStar(`A &= 3xy
				\\\\ &= 3x \\left( \\frac{${num}}{4} \\right)
				\\\\ &= ${num.times(new Polynomial(3)).divide(4)} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Given that ${math(`x`)} can vary, find the dimensions of each
				tennis court that make ${math(`A`)} a maximum.
				${newline}
				(You are not required to show that ${math(`A`)} is a maximum.)
			`;
			const dAdx = dydx({ y: 'A' });
			const derivative = A.differentiate();
			let sol = alignStar(`A &= ${A}
				\\\\ ${dAdx} &= ${derivative}
			`);
			const working = new EquationWorking(derivative, 0, { aligned: true });
			const x = working.solveLinear();
			const y = num.subIn(x).divide(4);
			sol += `At maximum value of ${math(`A,`)} ${math(`\\displaystyle ${dAdx} = 0`)}
				${alignStar(`${working}`)}
				Substituting ${math(`x=${x}`)} into ${math(`(1),`)}
				${alignStar(`y &= \\frac{${num.subInWorking(x)}}{4}
					\\\\ &= ${y}
				`)}
				Hence the dimensions of each tennis court is ${math(
					`${y} \\textrm{ m by } ${x} \\textrm{ m} \\; \\blacksquare`,
				)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 15: 2016 P2 Q8
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const poly = new Polynomial([1, -3, 4, -12]);
		const body = `It is given that ${display(`${fxString} = ${poly}.`)}
		`;
		let factor: Polynomial, quadratic: Polynomial;
		let x = 3;
		// part a
		(() => {
			const body = `By showing clearly your working factorise ${math(`f(x).`)}`;
			let sol = `Consider ${math(`${f}(${x}),`)}`;
			sol += alignStar(`${f}(${x}) &= ${poly.subInWorking(x)}
				\\\\ &= 27 - 27 + 12 - 12
				\\\\ &= 0
			`);
			factor = new Polynomial([1, -x]);
			sol += `By the factor theorem, ${math(`${factor}`)} is a factor of ${math(`${fxString}.`)}`;
			quadratic = castToPoly(longDivision(poly, factor));
			const [x0, _, x2, x3] = poly.coeffs;
			const [c2, b2] = quadratic.coeffs;
			const [b1] = factor.coeffs;
			sol += `${display(`${poly} = (${factor})(Ax^2 + Bx + C)`)}
			Comparing coefficients,
				${alignatStar(
					`&x^3: \\quad &  A &= ${x3}
						\\\\ &x^2: \\quad &  ${b1}A + B &= ${x2}
						\\\\ && B &= ${b2}
						\\\\ &x^0: \\quad &  ${b1}C &= ${x0}
						\\\\ && C &= ${c2}
					`,
					2,
				)}
				${display(`f(x) = (${factor})(${quadratic}) \\; \\blacksquare`)}
				`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Explain why the equation ${math(`${fxString}=0`)}
				has only one real root and state its value.
			`;
			let sol = `${alignStar(`${fxString} &= 0
				\\\\ (${factor})(${quadratic}) &= 0
			`)}
				${math(`${quadratic}`)} is always positive for all real values of ${math(`x`)} since ${math(
				`x^2 \\geq 0`,
			)} ${math(`\\forall x\\in\\mathbb{R}`)}
				${newline}
				Hence ${math(`${fxString}=0`)} has only one real root, ${math(`x = ${x} \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part c
		(() => {
			const body = `Find the value of the constant ${math(`k`)} for which the graph of
				${display(`y = ${fxString} + kx`)} has a stationary point at which
				${math(`\\displaystyle ${d2ydx2()} = 0`)}
			`;
			const derivative = poly.differentiate();
			const d2 = derivative.differentiate();
			let sol = `${alignStar(
				`y &= ${poly} + kx
				\\\\ ${dydx()} &= ${derivative} + k 
				\\\\ ${d2ydx2()} &= ${d2} 
			`,
			)}
				When ${math(`\\displaystyle ${d2ydx2()} = 0,`)}
			`;
			const working1 = new EquationWorking(d2, 0, { aligned: true });
			const x = working1.solveLinear();
			sol += alignStar(`${working1}`);
			const k = derivative.subIn(x).negative();
			sol += `At stationary points, ${math(`\\displaystyle ${dydx()} = 0`)}
				${gatherStar(`${derivative} + k = 0
					\\\\ ${derivative.subInWorking(x)} + k = 0
					\\\\ k = ${k} \\; \\blacksquare
				`)}
			`;

			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 16: 2015 P2 Q3
	//TODO: Equation of line (coordinate geometry)
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const A = new Polynomial([0, 216, new Fraction(-9, 2)], { ascending: true });
		const length = 288;
		const body = `A tennis club makes three equally sized tennis courts, positioned
			next to each other as shown in the diagram below. Each tennis court is rectangular
			and has side length ${math(`x \\textrm{ m}`)} and ${math(`y \\textrm{ m}.`)}
			The lines in the diagram represent wire netting. The total length of wire
			netting used is ${math(`${length} \\textrm{ m}.`)}
		`;
		let num: Polynomial;
		// part a
		(() => {
			const body = `Show that the total area, ${math(`A \\textrm{m}^2,`)}
				of the three tennis courts is given by
				${display(`A = ${A}.`)}
			`;
			num = new Polynomial([length, -6], { ascending: true });
			let sol = gatherStar(`4y + 6x = ${length}`);
			sol += eqn(`y = \\frac{${num}}{4}`, { leqno: true });
			sol += alignStar(`A &= 3xy
				\\\\ &= 3x \\left( \\frac{${num}}{4} \\right)
				\\\\ &= ${num.times(new Polynomial(3)).divide(4)} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Given that ${math(`x`)} can vary, find the dimensions of each
				tennis court that make ${math(`A`)} a maximum.
				${newline}
				(You are not required to show that ${math(`A`)} is a maximum.)
			`;
			const dAdx = dydx({ y: 'A' });
			const derivative = A.differentiate();
			let sol = alignStar(`A &= ${A}
				\\\\ ${dAdx} &= ${derivative}
			`);
			const working = new EquationWorking(derivative, 0, { aligned: true });
			const x = working.solveLinear();
			const y = num.subIn(x).divide(4);
			sol += `At maximum value of ${math(`A,`)} ${math(`\\displaystyle ${dAdx} = 0`)}
				${alignStar(`${working}`)}
				Substituting ${math(`x=${x}`)} into ${math(`(1),`)}
				${alignStar(`y &= \\frac{${num.subInWorking(x)}}{4}
					\\\\ &= ${y}
				`)}
				Hence the dimensions of each tennis court is ${math(
					`${y} \\textrm{ m by } ${x} \\textrm{ m} \\; \\blacksquare`,
				)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 17: 2014 P1 Q10
	//TODO: diagram
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const sqrt3 = new SquareRoot(3);
		const surdExpression = new Expression(4, sqrt3.negative());
		const xPoly = new xPolynomial(
			[0, 130, new Expression(new ExpansionTerm(surdExpression).times(-1))],
			{ ascending: true },
		);
		const length = 130;
		const dAdx = dydx({ y: 'A' });
		let derivative: xPolynomial;
		const body = `A gardener uses ${math(`${length} \\textrm{ m}`)}
			of fencing to enclose a plot of the shape shown above. The shape consists of two equilateral
			triangles of side ${math(`x \\textrm{ m}`)} and a rectangle with sides
			${math(`x \\textrm{ m}`)} and ${math(`l \\textrm{ m}.`)}
		`;
		// part a
		(() => {
			const body = `Show that the area of the plot is
				${display(`\\frac{${xPoly}}{2} \\textrm{ m}^2.`)}
			`;
			let sol = gatherStar(`2l + 4x = ${length} \\\\ l + 2x = ${length / 2}`);
			const l = new Polynomial([length / 2, -2], { ascending: true });
			sol += eqn(`l = ${l}`, { leqno: true });
			const half = new Fraction(1, 2);
			const sqrt3 = new SquareRoot(3);
			sol += alignStar(`& \\textrm{Area of plot,} A
				\\\\ &= 2 \\left( ${half} x^2 \\sin 60^\\circ \\right) + lx
				\\\\ &= \\frac{${sqrt3}x^2}{2} + \\left(${l}\\right)x
				\\\\ &= \\frac{${sqrt3}x^2 + ${l.times(2).times(new Polynomial(1))}}{2}
				\\\\ &= \\frac{${xPoly}}{2} \\textrm{ m}^2 \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Given that ${math(`x`)} can vary, find the value of ${math(`x`)}
				for which the area of the plot is stationary.
			`;
			const derivative1 = xPoly.differentiate();
			derivative = derivative1.divide(2);
			let sol = alignStar(`A &= \\frac{${xPoly}}{2}
				\\\\ ${dAdx} &= \\frac{${derivative1}}{2}
				\\\\ &= ${derivative}
			`);
			const [val, t1] = derivative.terms;
			const working = new ExpressionWorking(
				new RationalTerm(val.cast.toFraction().divide(2), surdExpression),
				{ aligned: true, equalStart: true },
			);
			working.rationalize();
			sol += `When the area of the plot is stationary, ${math(`\\displaystyle ${dAdx} = 0`)}
				${alignStar(`${derivative} &= 0
					\\\\ ${t1.times(-1)} &= ${val}
				`)}
				${alignStar(`x ${working}
					\\\\ &\\approx ${(20 + 5 * sqrt3.valueOf()).toPrecision(3)}
				`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part c
		(() => {
			const body = `Explain why this value of ${math(`x`)}
				gives the gardener the largest area possible.
			`;
			const d2 = d2ydx2({ y: 'A' });
			let sol = alignStar(`${dAdx} &= ${derivative}
				\\\\ ${d2} &= ${derivative.differentiate()}
				\\\\ &< 0 \\; \\Rightarrow \\; \\textrm{Maximum}
			`);
			sol += `Hence this value of ${math(`x`)} gives the gardener the largest area possible ${math(
				`\\blacksquare`,
			)}`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 18: 2014 P2 Q7
	//TODO: power term
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const sqrt3 = new SquareRoot(3);
		const surdExpression = new Expression(4, sqrt3.negative());
		const xPoly = new xPolynomial(
			[0, 130, new Expression(new ExpansionTerm(surdExpression).times(-1))],
			{ ascending: true },
		);
		const length = 130;
		const dAdx = dydx({ y: 'A' });
		let derivative: xPolynomial;
		const body = `A gardener uses ${math(`${length} \\textrm{ m}`)}
			of fencing to enclose a plot of the shape shown above. The shape consists of two equilateral
			triangles of side ${math(`x \\textrm{ m}`)} and a rectangle with sides
			${math(`x \\textrm{ m}`)} and ${math(`l \\textrm{ m}.`)}
		`;
		// part a
		(() => {
			const body = `Show that the area of the plot is
				${display(`\\frac{${xPoly}}{2} \\textrm{ m}^2.`)}
			`;
			let sol = gatherStar(`2l + 4x = ${length} \\\\ l + 2x = ${length / 2}`);
			const l = new Polynomial([length / 2, -2], { ascending: true });
			sol += eqn(`l = ${l}`, { leqno: true });
			const half = new Fraction(1, 2);
			const sqrt3 = new SquareRoot(3);
			sol += alignStar(`& \\textrm{Area of plot,} A
				\\\\ &= 2 \\left( ${half} x^2 \\sin 60^\\circ \\right) + lx
				\\\\ &= \\frac{${sqrt3}x^2}{2} + \\left(${l}\\right)x
				\\\\ &= \\frac{${sqrt3}x^2 + ${l.times(2).times(new Polynomial(1))}}{2}
				\\\\ &= \\frac{${xPoly}}{2} \\textrm{ m}^2 \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Given that ${math(`x`)} can vary, find the value of ${math(`x`)}
				for which the area of the plot is stationary.
			`;
			const derivative1 = xPoly.differentiate();
			derivative = derivative1.divide(2);
			let sol = alignStar(`A &= \\frac{${xPoly}}{2}
				\\\\ ${dAdx} &= \\frac{${derivative1}}{2}
				\\\\ &= ${derivative}
			`);
			const [val, t1] = derivative.terms;
			const working = new ExpressionWorking(
				new RationalTerm(val.cast.toFraction().divide(2), surdExpression),
				{ aligned: true, equalStart: true },
			);
			working.rationalize();
			sol += `When the area of the plot is stationary, ${math(`\\displaystyle ${dAdx} = 0`)}
				${alignStar(`${derivative} &= 0
					\\\\ ${t1.times(-1)} &= ${val}
				`)}
				${alignStar(`x ${working}
					\\\\ &\\approx ${(20 + 5 * sqrt3.valueOf()).toPrecision(3)}
				`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part c
		(() => {
			const body = `Explain why this value of ${math(`x`)}
				gives the gardener the largest area possible.
			`;
			const d2 = d2ydx2({ y: 'A' });
			let sol = alignStar(`${dAdx} &= ${derivative}
				\\\\ ${d2} &= ${derivative.differentiate()}
				\\\\ &< 0 \\; \\Rightarrow \\; \\textrm{Maximum}
			`);
			sol += `Hence this value of ${math(`x`)} gives the gardener the largest area possible ${math(
				`\\blacksquare`,
			)}`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 19: 2013 P2 Q7
	//TODO: diagram
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const sqrt3 = new SquareRoot(3);
		const term1 = new xPolynomial([0, 0, 1], { ascending: true, variable: 'r' });
		const term2a = new xPolynomial([300, -2], {
			ascending: true,
			variable: 'r',
		});
		const term2b = new xPolynomial([0, new Term(-2, '\\pi')], {
			ascending: true,
			variable: 'r',
		});
		const VFactorized = new ExpansionTerm(
			'\\pi',
			term1,
			new Expression(...term2a.terms, ...term2b.terms),
		);
		const length = 600;
		let l: Expression;
		const body = `The diagram shows a roll of material, in the shape of a cylinder of radius
			${math(`r \\textrm{ cm}`)} and length ${math(`l \\textrm{ cm}.`)}
			The roll is held together by three pieces of adhesive tape whose width and thickness
			may be ignored. One piece of tape is in the shape of a rectangle, the other pieces are in
			the shape of circles. The total length of tap is ${math(`${length} \\textrm{ cm}.`)}
		`;
		// part a
		(() => {
			const body = `Show that the volume, ${math(`V \\textrm{ cm}^3,`)} of the cylinder
				is given by
				${display(`V = ${VFactorized}.`)}
			`;
			const working = new EquationWorking(
				new Expression([2, 'l'], [4, 'r'], [4, '\\pi', 'r']),
				length,
			);
			working.divide(2);
			working.moveTerm(1, { show: false });
			working.moveTerm(1);
			l = working.rhs;
			let sol = gatherStar(`2l + 4r + 2(2\\pi r) = ${length}
				\\\\ ${working}
			`);
			sol += alignStar(`V &= \\pi r^2 l
				\\\\ &= ${VFactorized} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const one_plus_pi = new Expression(1, '\\pi');
			const body = `Given that ${math(`r`)} can vary, show that
				${math(`V`)}
				has a stationary value when ${math(`\\displaystyle r = \\frac{k}{${one_plus_pi}}`)}
				where ${math(`k`)} is a constant to be found, and find the
				corresponding value of ${math(`l.`)}
			`;
			const V1 = term1.times(term2a);
			const V2 = term1.times(term2b);
			const V = `${V1} ${V2}`;
			const derivative = `${V1.differentiate()} ${V2.differentiate()}`;
			const dVdr = dydx({ y: 'V', x: 'r' });
			let sol = alignStar(`V &= ${VFactorized}
				\\\\ &= \\pi \\left(${V}\\right)
				\\\\ ${dVdr} &= \\pi \\left( ${derivative} \\right)
			`);
			sol += `At stationary value of ${math(`V,`)} ${math(`\\displaystyle ${dVdr} = 0`)}`;
			sol += gatherStar(`${derivative} = 0
				\\\\ 6r \\left( 100 - r - \\pi r \\right) = 0
			`);
			sol += `Since ${math(`r \\neq 0,`)}`;
			sol += gatherStar(`100 - r - \\pi r = 0
				\\\\ r + \\pi r = 100
				\\\\ r (1 + \\pi) = 100
				\\\\ r = \\frac{100}{1 + \\pi} \\; \\blacksquare
			`);
			sol += alignStar(`l &= ${l}
				\\\\ &= 300 - 2r \\left( ${one_plus_pi}\\right)
				\\\\ &= 300 - 2 \\left( \\frac{100}{${one_plus_pi}} \\right) \\left( ${one_plus_pi}\\right)
				\\\\ &= 300 - 200
				\\\\ &= 100 \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 20: 2017 P2 Q4
	//TODO: sqrt Fn
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const sqrt3 = new SquareRoot(3);
		const term1 = new xPolynomial([0, 0, 1], { ascending: true, variable: 'r' });
		const term2a = new xPolynomial([300, -2], {
			ascending: true,
			variable: 'r',
		});
		const term2b = new xPolynomial([0, new Term(-2, '\\pi')], {
			ascending: true,
			variable: 'r',
		});
		const VFactorized = new ExpansionTerm(
			'\\pi',
			term1,
			new Expression(...term2a.terms, ...term2b.terms),
		);
		const length = 600;
		let l: Expression;
		const body = `The diagram shows a roll of material, in the shape of a cylinder of radius
			${math(`r \\textrm{ cm}`)} and length ${math(`l \\textrm{ cm}.`)}
			The roll is held together by three pieces of adhesive tape whose width and thickness
			may be ignored. One piece of tape is in the shape of a rectangle, the other pieces are in
			the shape of circles. The total length of tap is ${math(`${length} \\textrm{ cm}.`)}
		`;
		// part a
		(() => {
			const body = `Show that the volume, ${math(`V \\textrm{ cm}^3,`)} of the cylinder
				is given by
				${display(`V = ${VFactorized}.`)}
			`;
			const working = new EquationWorking(
				new Expression([2, 'l'], [4, 'r'], [4, '\\pi', 'r']),
				length,
			);
			working.divide(2);
			working.moveTerm(1, { show: false });
			working.moveTerm(1);
			l = working.rhs;
			let sol = gatherStar(`2l + 4r + 2(2\\pi r) = ${length}
				\\\\ ${working}
			`);
			sol += alignStar(`V &= \\pi r^2 l
				\\\\ &= ${VFactorized} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const one_plus_pi = new Expression(1, '\\pi');
			const body = `Given that ${math(`r`)} can vary, show that
				${math(`V`)}
				has a stationary value when ${math(`\\displaystyle r = \\frac{k}{${one_plus_pi}}`)}
				where ${math(`k`)} is a constant to be found, and find the
				corresponding value of ${math(`l.`)}
			`;
			const V1 = term1.times(term2a);
			const V2 = term1.times(term2b);
			const V = `${V1} ${V2}`;
			const derivative = `${V1.differentiate()} ${V2.differentiate()}`;
			const dVdr = dydx({ y: 'V', x: 'r' });
			let sol = alignStar(`V &= ${VFactorized}
				\\\\ &= \\pi \\left(${V}\\right)
				\\\\ ${dVdr} &= \\pi \\left( ${derivative} \\right)
			`);
			sol += `At stationary value of ${math(`V,`)} ${math(`\\displaystyle ${dVdr} = 0`)}`;
			sol += gatherStar(`${derivative} = 0
				\\\\ 6r \\left( 100 - r - \\pi r \\right) = 0
			`);
			sol += `Since ${math(`r \\neq 0,`)}`;
			sol += gatherStar(`100 - r - \\pi r = 0
				\\\\ r + \\pi r = 100
				\\\\ r (1 + \\pi) = 100
				\\\\ r = \\frac{100}{1 + \\pi} \\; \\blacksquare
			`);
			sol += alignStar(`l &= ${l}
				\\\\ &= 300 - 2r \\left( ${one_plus_pi}\\right)
				\\\\ &= 300 - 2 \\left( \\frac{100}{${one_plus_pi}} \\right) \\left( ${one_plus_pi}\\right)
				\\\\ &= 300 - 200
				\\\\ &= 100 \\; \\blacksquare
			`);
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
	<Answer2 answers={questions} questionMode={true} />
	<hr />
	<h3>Answers</h3>
	<Answer2 {answers} />
</section>
