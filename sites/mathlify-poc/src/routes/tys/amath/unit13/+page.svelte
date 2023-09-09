<script lang="ts">
	import type { AnswerObject as QuestionType } from '$lib/components/interfaces';
	import {
		ExpansionTerm,
		Polynomial,
		castToPoly,
		RationalFn,
		EquationWorking,
		Fraction,
		Expression,
		Term,
		Point,
		cramersRule,
		ExpFn,
		LnFn,
		xPolynomial,
		RationalTerm,
		InequalityWorking,
		CosFn,
		SinFn,
		dydx,
		d2ydx2,
		SquareRoot,
		GeneralFn,
		solveQuadraticSurd,
		solveQuadraticNumerical,
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
	} from 'mathlifier';
	import Answer2 from '$lib/components/Answer2.svelte';

	const title =
		'Unit 13: Integration';

	const questions: QuestionType[] = [];
	const answers: QuestionType[] = [];
	const f = `\\operatorname{f}`;
	const fx = `${f}(x)`;
	const g = `\\operatorname{g}`;
	const gx = `${g}(x)`;
	const degree = `^\\circ`;

	const dydtString = dydx({x: 't'});
	const dxdtString = dydx({y: 'x', x: 't'});
	const dx = `\\operatorname{d}\\!x`

	function productRuleWorking(
		f: Polynomial,
		g: ExpFn|LnFn,
		options?: { aligned?: boolean },
	): { working: string;  } {
		const gPrime = g.differentiate();
		const fPrime = f.differentiate();
		return {
			working: `\\left(${fPrime}\\right)${g} + \\left(${f}\\right)\\left(${gPrime}\\right)`,
		};
	}

	//! Question 1: 2019 P2 Q1
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const x = new Polynomial('x');
		const x2 = new Polynomial([1,0,0]);
		const lnX = new LnFn();
		// part a
		(() => {
			const body = `Differentiate ${math(`${x2} ${lnX}`)}
				with respect to ${math(`x.`)}
			`;
			let sol = `Let ${math(`J`)} denote the point on 
			`;
			parts.push({ body, });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Hence find
				${math(`\\displaystyle \\int ${x} ${lnX} ${dx}.`)}
			`;
			const sol = `
			`; 
			parts.push({ body, });
			solParts.push({ body: sol });
		})();
		questions.push({ parts, });
		answers.push({ parts: solParts });
	})();

	//! Question 2: 2019 P2 Q5
	(() => {
		const threeX = new Polynomial(3);
		const twoX = new Polynomial(2);
		const cos3x = new CosFn(threeX);
		const sin2x = new SinFn(twoX);
		const t1 = cos3x.times(3);
		const t2 = sin2x.times(-4);
		const d2 = new GeneralFn(t1, t2);
		const fPiOver2 = new Fraction(5,6);
		const sqrt3 = new SquareRoot(3);
		const body = `${math(`${fx}`)} is such that
			${display(`${f}''(x) = ${d2}.`)}
			Given that ${math(`${f}(0) = 0`)}
			and ${math(`\\displaystyle ${f}\\left( \\frac{\\pi}{2} \\right) = ${fPiOver2},`)}
			show that
			${math(`\\displaystyle ${f}\\left( \\frac{\\pi}{3} \\right) = 1 + \\frac{${sqrt3}}{2}`)}
		`;
		let sol = ``
		questions.push({ body, });
		answers.push({ body: sol });
	})();

	//! Question 3: 2018 P1 Q11
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const three_over_2 = new Fraction(3,2);
		const num = new Polynomial([10,-9]);
		const den = new Polynomial([2,-3]);
		const fPrime = new RationalFn(num, den);
		const x = 2;
		const fVal = 8;
		const body = `It is given that ${math(`${fx}`)}
			is defined for ${math(`x > ${three_over_2}`)}
			and is such that
			${math(`\\displaystyle ${f}'(x) = ${fPrime}.`)}
		`;
		// part a
		(() => {
			const body = `Express ${math(`${f}'(x)`)}
				in the form
				${math(`\\displaystyle a + \\frac{b}{${den}},`)}
				where ${math(`a`)} and ${math(`b`)}
				are constants.
			`;
			let sol = `Let ${math(`J`)} denote the point on `;
			parts.push({ body, });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Hence explain whether
				${math(`${fx}`)} is an increasing or
				decreasing function.
			`;
			const sol = `
			`; 
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part c
		(() => {
			const body = `By considering ${math(`${f}''(x),`)}
				explain whether ${math(`${f}'(x)`)} is an increasing
				or decreasing function.
			`;
			const sol = ``;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part d
		(() => {
			const body = `Given that ${math(`f(${x}) = ${fVal},`)}
				obtain an expression for ${math(`${fx}.`)}
			`;
			let sol = ``;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 4: 2018 P2 Q6
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const x = new Polynomial('x');
		const cosX = new CosFn();
		const sinX = new SinFn();
		const x2 = new Polynomial([1,0,0]);
		// part a
		(() => {
			const body = `Differentiate ${math(`${x2} ${cosX}`)}
				with respect to ${math(`x.`)}
			`;
			let sol = `Let ${math(`J`)} denote the point on 
			`;
			parts.push({ body, });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Hence find
				${math(`\\displaystyle \\int ${x} ${sinX} ${dx}.`)}
			`;
			const sol = `
			`; 
			parts.push({ body, });
			solParts.push({ body: sol });
		})();
		// part c
		(() => {
			const body = `Differentiate ${math(`${x2} ${sinX}`)}
				with respect to ${math(`x`)}
				and hence, using the result found in part (ii),
				find
				${math(`\\displaystyle \\int ${x2} ${cosX} ${dx}.`)}
			`;
			const sol = `
			`; 
			parts.push({ body, });
			solParts.push({ body: sol });
		})();
		questions.push({ parts, });
		answers.push({ parts: solParts });
	})();

	//! Question 5: 2017 P1 Q1
	(() => {
		const d2 = new Polynomial([8,-6],{ascending: true});
		const P = new Point(2,8,{name:'P'});
		const gradient = 3;
		const body = `A curve is such that
			${math(`\\displaystyle ${d2ydx2()} = ${d2}`)}
			and the point ${math(`${P}`)}
			lies on the curve. The gradient of the curve at
			${math(`P`)} is ${math(`${gradient}.`)}
			Find the equation of the curve.
		`;
		const sol = ``;
		questions.push({ body, });
		answers.push({ body: sol });
	})();

	//! Question 6: 2020 P2 Q8
	(() => {
		const lnX = new LnFn();
		const x2 = Polynomial.ofDegree(2);
		const x3 = Polynomial.ofDegree(3);

		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const x = new Polynomial(1);
		const line = new Polynomial([2,-3]);
		const body = `The point ${math(`P`)} lies on the curve
			${math(`y = ${x} ${lnX}.`)} The tangent to the curve at
			${math(`P`)} is parallel to the line ${math(`y=${line}.`)}
		`;
		// part a
		(() => {
			const body = `Find the coordinates of ${math(`P.`)}`;
			let sol = alignStar(`y &= ${x} ${lnX}
				\\\\ ${dydx()} &= ${productRuleWorking(x, lnX).working}
				\\\\ &= \\ln x + 1
			`);
			sol += `Gradient of ${math(`y=${line}`)} is ${math(`2`)} so at ${math(`P,`)}`;
			sol += alignStar(`${dydx()} &= 2
				\\\\ \\ln x + 1 &= 2
				\\\\ \\ln x &= 1
				\\\\ x &= \\mathrm{e}
			`);
			const e = `\\mathrm{e}`;
			sol += `When ${math(`x=${e},`)}`
			sol += alignStar(`y = ${e} \\ln ${e} \\\\ &= ${e}`);
			sol += `Hence the coordinates of ${math(`P \\left( ${e}, ${e} \\right) \\; \\blacksquare`)}`
			parts.push({ body, });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const uplevel = `The normal to the curve 
				${math(`y = ${x} ${lnX}`)} at ${math(`P`)}
				meets the line ${math(`y=${line}`)} at the point
				${math(`Q.`)}
			`;
			const e = `\\mathrm{e}`;
			const body = `Show that the ${math(`x`)}-coordinate
				of ${math(`Q`)} is ${math(`k\\left(${e}+2\\right),`)}
				where ${math(`k`)} is a constant to be found.
			`;
			let sol = `Gradient of normal ${math(`= -\\frac{1}{2}`)}
				${newParagraph}
				Equation of normal
			`;
			sol += alignStar(` y - ${e} &= -\\frac{1}{2} \\left( x - ${e} \\right)
					\\\\ y &= -\\frac{1}{2} x + \\frac{1}{2}${e} + ${e}
					\\\\ &= -\\frac{1}{2} x + \\frac{3}{2}${e}			
			`);
			sol += `Equating the equations of the normal and ${math(`y=${line},`)}`;
			sol += alignStar(`-\\frac{1}{2} x + \\frac{3}{2}${e} &= ${line}
				\\\\ -\\frac{5}{2}x &= -3 - \\frac{3}{2}${e}
				\\\\ -\\frac{5}{2}x &= -\\frac{3}{2} \\left(2 +${e}\\right)
				\\\\ x &= \\frac{3}{5} \\left( ${e} + 2 \\right) \\; \\blacksquare
			`)
			sol += `Hence ${math(`\\displaystyle k = \\frac{3}{5} \\; \\blacksquare`)}`
			parts.push({ uplevel, body });
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
