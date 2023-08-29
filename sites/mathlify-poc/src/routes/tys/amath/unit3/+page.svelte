<script lang="ts">
	import type { AnswerObject as QuestionType } from '$lib/components/interfaces';
	import {
		ExpansionTerm,
		Fraction,
		Expression,
		Polynomial,
		xPolynomial,
		castToPoly,
		EquationWorking,
		RationalFn,
		longDivision,
		partialFraction,
		RationalTerm,
		factorizeQuadratic,
		solveLinear,
		solveQuadratic,
		solveQuadraticSurd,
		discriminant,
		SLE,
	} from 'mathlify';
	import { alignStar, alignatStar, display, eqn, gatherStar, math, newline } from 'mathlifier';
	import Answer2 from '$lib/components/Answer2.svelte';

	const title = 'Unit 3: Polynomials, Cubic Equations and Partial Fractions';
	//TODO: long division working;

	const questions: QuestionType[] = [];
	const answers: QuestionType[] = [];

	//! Question 1: 2020 P1 Q3
	(() => {
		const num = new Polynomial([4, -7, 9]);
		const den = new Polynomial([2, -1, -3]);
		const qn = new RationalFn(num, den);
		const body = `Express ${math(`\\displaystyle ${qn}`)}
			in partial fractions.
		`;
		const longDivisionExp = qn.longDivide();
		let sol = `By long division
			${display(`${qn} = ${longDivisionExp}`)}
		`;
		const { working, result } = partialFraction(longDivisionExp.terms[1] as RationalFn);
		sol += gatherStar(working);
		const finalAns = new Expression(2).plus(result);
		sol += alignStar(`&${qn} \\\\ &= ${finalAns} \\; \\blacksquare`);
		questions.push({ body });
		answers.push({ body: sol });
	})();

	//! Question 2: 2019 P1 Q7
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const poly = new Polynomial([1, 1, -1, -1]);
		const linear = new Polynomial([1, -1]);
		// part a
		(() => {
			const body = `Show that ${math(`${linear}`)}
				is a factor of ${math(`${poly}.`)}
			`;
			const sol = `Let ${display(`f(x) = ${poly}`)}
				${alignStar(`f(1) &= ${poly.subInWorking(1)}
					\\\\ &= ${poly.subIn(1)}
				`)}
				Since ${math(`f(1) = 0,`)} by the factor theorem,
				${math(`${linear}`)} is a factor of ${math(`${poly}. \\; \\blacksquare`, { wrap: true })}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const qn = new RationalFn(4, poly);
			const body = `Express ${math(`\\displaystyle ${qn}`)}
				as the sum of three partial fractions.
			`;
			const { working, result } = partialFraction(qn, linear);
			const sol = `Since ${math(`${linear}`)} is a factor of ${math(`${poly},`)}
				${display(`${poly} = (${linear})(ax^2 + bx+c)`)}
				Comparing coefficients,
				${alignatStar(
					`&x^3: \\quad &  a &= 1
						\\\\ &x^2: \\quad &  -a + b &= 1
						\\\\ && b &= 2
						\\\\ &x^0: \\quad &  -c &= -1
						\\\\ && c &= 1
					`,
					2,
				)}
				${alignStar(`${qn} &= \\frac{4}{(${linear})(x^2 + 2x + 1)}
					\\\\ &= \\frac{4}{(${linear})(x+1)^2}
				`)}
				${gatherStar(working)}
				${alignStar(`&${qn} \\\\ &= ${result} \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ parts });
		answers.push({ parts: solParts });
	})();

	//! Question 3: 2018 P1 Q3
	(() => {
		const num = new Polynomial([7, -12, 17]);
		const den1 = new Polynomial([2, -1]);
		const den2 = new Polynomial([1, 0, 4]);
		const qn = new RationalTerm(num, new ExpansionTerm(den1, den2));
		const rational = new RationalFn(num, den1.times(den2));
		const body = `Express ${math(`\\displaystyle ${qn}`)}
			in partial fractions.
		`;
		const { working, result } = partialFraction(rational, den1);
		let sol = gatherStar(working);
		sol += alignStar(`&${qn} \\\\ &= ${result} \\; \\blacksquare`);
		questions.push({ body });
		answers.push({ body: sol });
	})();

	//! Question 4: 2017 P1 Q8
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const poly = new Polynomial([3, -1, 27, -9]);
		const linear = new Polynomial([3, -1]);
		// part a
		let factor2: Expression;
		(() => {
			const body = `By long division, divide ${math(`${poly}`)}
				by ${math(`${linear}.`)}
			`;
			factor2 = longDivision(poly, linear);
			const sol = `By long division,
				${alignStar(`& \\frac{${poly}}{${linear}}
					\\\\ &= ${factor2} \\; \\blacksquare
				`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const num = new Polynomial([6, 11, -5], { ascending: true });
			const qn = new RationalFn(num, poly);
			const body = `Express ${math(`\\displaystyle ${qn}`)}
				in partial fractions.
			`;
			const { working, result } = partialFraction(qn, linear);
			const sol = `From part (i), 
				${gatherStar(`${poly} = (${linear})(${factor2})
					\\\\ ${qn} = \\frac{${num}}{(${linear})(${factor2})}
				`)}
				${gatherStar(working)}
				${alignStar(`&${qn} \\\\ &= ${result} \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ parts });
		answers.push({ parts: solParts });
	})();

	//! Question 5: 2016 P1 Q5
	(() => {
		const num = new Polynomial([2, 4, -31]);
		const den = new Polynomial([1, 1, -6]);
		const qn = new RationalFn(num, den);
		const body = `Express ${math(`\\displaystyle ${qn}`)}
			in partial fractions.
		`;
		const longDivisionExp = qn.longDivide();
		let sol = `By long division
			${display(`${qn} = ${longDivisionExp}`)}
		`;
		const { working, result } = partialFraction(longDivisionExp.terms[1] as RationalFn);
		sol += gatherStar(working);
		const finalAns = new Expression(2).plus(result);
		sol += alignStar(`&${qn} \\\\ &= ${finalAns} \\; \\blacksquare`);
		questions.push({ body });
		answers.push({ body: sol });
	})();

	//! Question 6: 2014 P1 Q4
	(() => {
		const num1 = new Polynomial([1, 2]);
		const num = new ExpansionTerm([num1, 2]);
		const den1 = new Polynomial([1, 0, 0]);
		const den2 = new Polynomial([1, -2]);
		const qn = new RationalTerm(num, new ExpansionTerm(den1, den2));
		const rational = new RationalFn(num1.square(), den1.times(den2));
		const body = `Express ${math(`\\displaystyle ${qn}`)}
			as the sum of ${math(`3`)} partial fractions.
		`;
		const { working, result } = partialFraction(rational, den2);
		let sol = gatherStar(working);
		sol += alignStar(`&${qn} \\\\ &= ${result} \\; \\blacksquare`);
		questions.push({ body });
		answers.push({ body: sol });
	})();

	//! Question 7: 2014 P2 Q2
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const poly = new Polynomial([2, -3, -11, 6]);
		// part a
		const body = `Given that
			${display(`f(x) = ${poly},`)}
		`;
		(() => {
			const linear = new Polynomial([1, -2]);
			const body = `find the remainder when
				by ${math(`f(x)`)} is divided by
				${math(`${linear},`)}
			`;
			const sol = `By the remainder theorem,
				${alignStar(`& \\textrm{Remainder}
					\\\\ &= f(2)
					\\\\ &= ${poly.subInWorking(2)}
					\\\\ &= ${poly.subIn(2)} \\; \\blacksquare
				`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const factor = new Polynomial([1, 2]);
			const body = `Show that ${math(`${factor}`)}
				is a factor of ${math(`f(x)`)}
				and hence solve the equation ${math(`f(x) = 0.`)}
			`;
			let sol = `${alignStar(`f(-2) &= ${poly.subInWorking(-2)}
				\\\\ &= -16-12+22+6
				\\\\ &= ${poly.subIn(-2)}
				`)}
				Hence, by the factor theorem, ${math(`${factor}`)} is a factor of ${math(`f(x). \\; \\blacksquare`)}
			`;
			const quadratic = longDivision(poly, factor);
			const factors = factorizeQuadratic(quadratic);
			const root1 = solveLinear(factor);
			const [root2, root3] = solveQuadratic(quadratic);
			sol += `${display(`${poly} = (${factor})(ax^2 + bx + c)`)}
			Comparing coefficients,
				${alignatStar(
					`&x^3: \\quad &  a &= 2
						\\\\ &x^2: \\quad &  2a + b &= -3
						\\\\ && b &= -7
						\\\\ &x^0: \\quad &  2c &= 6
						\\\\ && c &= 3
					`,
					2,
				)}
				${gatherStar(`f(x) = 0
					\\\\ (${factor})(${quadratic}) = 0
					\\\\ (${factor})${factors} = 0
					`)}
				${math(`x = ${root1},`)} ${math(`x = ${root2}`)} or 
				${math(`x = ${root3} \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 8: 2013 P1 Q6
	(() => {
		const num = new Polynomial([7, 2]);
		const den1 = new Polynomial([1, 0, 4]);
		const den2 = new Polynomial([1, -2]);
		const qn = new RationalTerm(num, new ExpansionTerm(den1, den2));
		const rational = new RationalFn(num, den1.times(den2));
		const body = `Express ${math(`\\displaystyle ${qn}`)}
			in partial fractions.
		`;
		const { working, result } = partialFraction(rational, den2);
		let sol = gatherStar(working);
		sol += alignStar(`&${qn} \\\\ &= ${result} \\; \\blacksquare`);
		questions.push({ body });
		answers.push({ body: sol });
	})();

	//! Question 9: 2020 P1 Q8
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const poly = new Polynomial([2, -3, -11, 6]);
		const linear1 = new Polynomial([1, -2]);
		const x1 = solveLinear(linear1);
		const linear2 = new Polynomial([1, 1]);
		const x2 = solveLinear(linear2);
		(() => {
			// part a
			const poly = new xPolynomial([1, 0, 'a', 0]);
			const body = `The remainder when
				${math(`${poly},`)}
				where ${math(`a`)} is a constant, is
				divided by ${math(`${linear1}`)}
				is the same as the remainder when it is divided
				by ${math(`${linear2}.`)}
				Find the value of ${math(`a.`)}
			`;
			const working = new EquationWorking(poly.subIntoVariable(x1), poly.subIntoVariable(x2), {
				aligned: true,
			});
			working.solveLinear({ variable: 'a' });
			const sol = `Let ${math(`f(x) = ${poly}`)}
				${newline}
				By the remainder theorem,
				${alignStar(`f(${x1}) &= f(${x2})
					\\\\ ${working} \\; \\blacksquare
				`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const poly = new Polynomial([1, -2, -4, 3]);
			const body = `Solve the equation ${display(`${poly} = 0,`)}
				expressing non-integer roots in surd form.
			`;
			const x = 3;
			const factor = new Polynomial([1, -x]);
			let sol = `Let ${display(`g(x) = ${poly}`)}
				Considering ${math(`g(${x}),`)}
				${alignStar(`g(${x}) &= ${poly.subInWorking(x)}
				\\\\ &= ${poly.subIn(x)}
				`)}
				Hence, by the factor theorem, ${math(`${factor}`)} is a factor of ${math(`g(x)`)}
			`;
			const quadratic = longDivision(poly, factor);
			const [x0, _, x2, x3] = poly.coeffs;
			const [c, b, a] = castToPoly(quadratic).coeffs;
			sol += `${display(`${poly} = (${factor})(ax^2 + bx + c)`)}
			Comparing coefficients,
				${alignatStar(
					`&x^3: \\quad &  a &= ${x3}
						\\\\ &x^2: \\quad &  ${-x}a + b &= ${x2}
						\\\\ && b &= ${b}
						\\\\ &x^0: \\quad &  ${-x}c &= ${x0}
						\\\\ && c &= ${c}
					`,
					2,
				)}
				${gatherStar(`f(x) = 0
					\\\\ (${factor})(${quadratic}) = 0
					`)}
				`;
			const [root2, root3] = solveQuadraticSurd(quadratic);
			sol += `${alignatStar(
				`
				& x=${x} \\quad  \\textrm{ or } \\quad &  &${quadratic} = 0
				\\\\ && x &= \\frac{-${b} \\pm \\sqrt{${b}^2 - 4(${a})(${c})}}{2(${a})}
				\\\\ && x &= \\frac{-1 \\pm \\sqrt{5}}{2}
				`,
				2,
			)}
			${math(`x = ${x},`)} ${math(`x = ${root2}`)} or
			${math(`x = ${root3} \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ parts });
		answers.push({ parts: solParts });
	})();

	//! Question 10: 2018 P2 Q8
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const poly = new Polynomial([2, 5, 0, -18]);
		// part a
		const body = `The equation of a polynomial is given by
			${display(`p(x) = ${poly}.`)}
		`;
		(() => {
			const linear = new Polynomial([1, 2]);
			const body = `Find the remainder when
				by ${math(`p(x)`)} is divided by
				${math(`${linear},`)}
			`;
			const x = solveLinear(linear);
			const sol = `By the remainder theorem,
				${alignStar(`& \\textrm{Remainder}
					\\\\ &= p(${x})
					\\\\ &= ${poly.subInWorking(x)}
					\\\\ &= ${poly.subIn(x)} \\; \\blacksquare
				`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		const factor = new Polynomial([2, -3]);
		(() => {
			const body = `Show that ${math(`${factor}`)}
				is a factor of ${math(`p(x).`)}
			`;
			const x = solveLinear(factor);
			let sol = `${alignStar(`p\\left(${x}\\right) &= ${poly.subInWorking(x)}
				\\\\ &= ${x.pow(3).times(2)} + ${x.pow(2).times(5)} - 18
				\\\\ &= ${poly.subIn(x)}
				`)}
				Hence, by the factor theorem, ${math(`${factor}`)} is a factor of ${math(`p(x). \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part c
		(() => {
			const body = `Show that the equation ${math(`p(x)=0`)}
				has only one real root.
			`;
			const quadratic = castToPoly(longDivision(poly, factor));
			const [x0, _, x2, x3] = poly.coeffs;
			const [c, b, a] = quadratic.coeffs;
			const [b1, a1] = factor.coeffs;
			let sol = `${display(`${poly} = (${factor})(ax^2 + bx + c)`)}
			Comparing coefficients,
				${alignatStar(
					`&x^3: \\quad &  ${a1}a &= ${x3}
						\\\\ && a &= ${a}
						\\\\ &x^2: \\quad &  ${b1}a + ${a1}b &= ${x2}
						\\\\ && b &= ${b}
						\\\\ &x^0: \\quad &  ${b1}c &= ${x0}
						\\\\ && c &= ${c}
					`,
					2,
				)}
				${gatherStar(`f(x) = 0
					\\\\ (${factor})(${quadratic}) = 0
					\\\\ ${factor} = 0 \\quad \\textrm{ or } \\quad ${quadratic} = 0
					`)}
				`;
			const d = discriminant(quadratic);
			sol += `${alignStar(`&\\textrm{Discriminant of } ${quadratic}
					\\\\ &= b^2 - 4ac
					\\\\ &= ${b}^2 - 4(${a})(${c})
					\\\\ &= ${d}
					\\\\ &< 0
			`)}
				Hence ${math(`${quadratic} = 0`)} has no real roots,
				so ${math(`p(x) = 0`)} has only one real root ${math(`x=\\frac{3}{2}. \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part d
		(() => {
			const body = `Use your answers to parts (ii) and (iii)
				to solve the equation
				${display(`2^{3y+1} + 5\\left(2^{2y}\\right) = 18.`)}
			`;
			const xVal = Math.log(1.5) / Math.log(2);
			const sol = `${alignStar(`2^{3y+1} + 5\\left(2^{2y}\\right) &= 18
				\\\\ 2^{3y}\\cdot 2^1 + 5\\left(2^{2y}\\right) - 18 &= 0
				\\\\ 2\\left(2^{3y}\\right) + 5\\left(2^{2y}\\right) - 18 &= 0
				`)}
				Replacing ${math(`2^{y}`)} with ${math(`x,`)}
				${display(`${poly} = 0`)}
				From part (iii), ${math(`p(x) = 0`)} has only one real root ${math(`x=\\frac{3}{2}`)}
				${alignStar(`2^{y} &= \\frac{3}{2}
					\\\\ \\ln 2^y &= \\ln \\left(\\frac{3}{2}\\right)
					\\\\ y \\ln 2 &= \\ln \\left(\\frac{3}{2}\\right)
					\\\\ y &= \\frac{\\ln \\left(\\frac{3}{2}\\right)}{\\ln 2}
					\\\\ &\\approx ${xVal.toPrecision(3)} \\; \\blacksquare
				`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 11: 2015 P2 Q8
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		// part a
		(() => {
			const poly = new Polynomial([2, -3, 0, -5]);
			const linear = new Polynomial([2, 1]);
			const body = `Find the remainder when ${math(`${poly}`)}
				is divided by ${math(`${linear}.`)}
			`;
			const negativeHalf = new Fraction(-1, 2);
			const sol = `By the remainder theorem,
				${alignStar(`& \\textrm{Remainder}
					\\\\ &= f\\left(-\\frac{1}{2}\\right)
					\\\\ &= ${poly.subInWorking(negativeHalf)}
					\\\\ &= ${poly.subIn(negativeHalf)} \\; \\blacksquare
				`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		const poly = new Polynomial([2, -3, 0, 1]);
		const linear = new Polynomial([1, -1]);
		let final: ExpansionTerm;
		(() => {
			const body = `Factorise completely the cubic
				polynomial ${math(`${poly}.`)}
			`;
			const factor = new Polynomial([1, -1]);
			const [x0, _, x2, x3] = poly.coeffs;
			const quadratic = longDivision(poly, factor);
			const [c, b] = castToPoly(quadratic).coeffs;
			const factors = factorizeQuadratic(quadratic);
			final = ExpansionTerm.product(factor, factors);
			let sol = `Let
				${display(`f(x) = ${poly}`)}
				Consider ${math(`f(1),`)}
				${alignStar(`f(1) &= ${poly.subInWorking(1)}
					\\\\ &= ${poly.subIn(1)}
				`)}
				Hence, by the factor theorem, ${math(`${factor}`)} is a factor of ${math(`f(x).`)}
				${display(`${poly} = (${factor})(ax^2 + bx+c)`)}
				Comparing coefficients,
				${alignatStar(
					`&x^3: \\quad &  a &= ${x3}
						\\\\ &x^2: \\quad &  -a + b &= ${x2}
						\\\\ && b &= ${b}
						\\\\ &x^0: \\quad &  -c &= ${x0}
						\\\\ && c &= ${c}
					`,
					2,
				)}
				${alignStar(`& ${poly}
					\\\\ &= (${factor})(${quadratic})
					\\\\ &= (${factor})${factors}
					\\\\ &= ${final} \\; \\blacksquare
				`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part c
		(() => {
			const num = new Polynomial([4, -5, -8], { ascending: true });
			const qn = new RationalFn(num, poly);
			const body = `Express ${math(`\\displaystyle ${qn}`)}
				as the sum of ${math(`3`)} partial fractions.
			`;
			const { working, result } = partialFraction(qn, linear);
			const sol = `From part (ii),
				${display(`${qn} = \\frac{${num}}{${final}}`)} 
				${gatherStar(working)}
				${alignStar(`&${qn} \\\\ &= ${result} \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ parts });
		answers.push({ parts: solParts });
	})();

	//! Question 12: 2013 P2 Q3
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const poly = new xPolynomial([1, 0, 'a', 'b']);
		const factor = new Polynomial([1, 3]);
		const x = solveLinear(factor);
		const divisor = new Polynomial([1, -4]);
		const x2 = solveLinear(divisor);
		const body = `The function ${math(`f(x)=${poly},`)}
			where ${math(`a`)} and ${math(`b`)} are constants, is exactly
			divisible by ${math(`x+3.`)}
			Given that ${math(`f(x)`)} leaves a remainder of ${math(`56`)} 
			when divided by ${math(`${divisor},`)}
		`;
		let a: Fraction, b: Fraction;
		(() => {
			// part a
			const body = `find the value of ${math(`a`)}
				and of
				${math(`b,`)}
			`;
			const coeffs1 = [x, 1],
				val1 = x.pow(3).negative();
			const coeffs2 = [x2, 1],
				val2 = new Fraction(56).minus(x2.pow(3));
			[a, b] = new SLE([coeffs1, coeffs2], [val1, val2], { variables: ['a', 'b'] }).solve({
				returnFraction: true,
			});
			const sol = `By the factor theorem,
				${alignStar(`f(${x}) &= 0
					\\\\ ${x.pow(3)} -3a + b &= 0
				`)}
				${eqn(`-3a+b = ${val1}`, { leqno: true })}
				By the remainder theorem,
				${alignStar(`f(${x2}) &= 56
					\\\\ ${x2.pow(3)} +4a + b &= 56
				`)}
				${eqn(`4a + b = ${val2}`, { leqno: true })}
				Taking ${math(`(2) - (1),`)}
				${alignStar(`7a &= ${val2} - ${val1}
					\\\\ a &= ${a} \\; \\blacksquare
				`)}
				Substituting ${math(`a = ${a}`)} into ${math(`(1),`)}
				${alignStar(`-3(${a}) + b &= ${val1}
					\\\\ b &= ${b} \\; \\blacksquare
				`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `determine, showing all necessary working, the number of real roots of the equation
				${math(`f(x)=0.`)}
			`;
			const poly = new Polynomial([1, 0, a, b]);
			const quadratic = castToPoly(longDivision(poly, factor));
			const [x0, _, x2, x3] = poly.coeffs;
			const [c2, b2, a2] = quadratic.coeffs;
			const [b1, a1] = factor.coeffs;
			let sol = `${display(`${poly} = (${factor})(Ax^2 + Bx + C)`)}
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
				${gatherStar(`f(x) = 0
					\\\\ (${factor})(${quadratic}) = 0
					\\\\ ${factor} = 0 \\quad \\textrm{ or } \\quad ${quadratic} = 0
					`)}
				`;
			const d = discriminant(quadratic);
			sol += `${alignStar(`&\\textrm{Discriminant of } ${quadratic}
					\\\\ &= b^2 - 4ac
					\\\\ &= (${b2})^2 - 4(${a2})(${c2})
					\\\\ &= ${d}
					\\\\ &< 0
			`)}
				Hence ${math(`${quadratic} = 0`)} has no real roots,
				so ${math(`f(x) = 0`)} has only one real root ${math(`x=-3. \\; \\blacksquare`)}
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
	<Answer2 answers={questions} questionMode={true} />
	<hr />
	<h3>Answers</h3>
	<Answer2 {answers} />
</section>
