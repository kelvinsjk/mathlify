<script lang="ts">
	import type { AnswerObject as QuestionType } from '$lib/components/interfaces';
	import {
		ExpansionTerm,
		Polynomial,
		xPolynomial,
		castToPoly,
		RationalFn,
		InequalityWorking,
	} from 'mathlify';
	import { alignStar, alignatStar, display, eqn, gatherStar, math, newline } from 'mathlifier';
	import Answer2 from '$lib/components/Answer2.svelte';

	const title = 'Unit 10: Gradients, Derivatives and Differentiation Techniques';
	//TODO: long division working;

	const questions: QuestionType[] = [];
	const answers: QuestionType[] = [];

	const dydx = `\\frac{\\operatorname{d}\\!y}{\\operatorname{d}\\!x}`;
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

	//! Question 1: 2020 P1 Q4
	(() => {
		const num = new Polynomial([2, -3]);
		const den = new Polynomial([1, 0, 4]);
		const qn = new RationalFn(num, den);
		const body = `The diagram shows part of the graph of
			${math(`\\displaystyle ${qn}.`)}
			Find the values of ${math(`x`)} for which ${math(`y`)}
			is increasing.
		`;
		const derivative = qn.differentiate();
		const quadratic = castToPoly(derivative.num);
		const sign = '>';
		const working = new InequalityWorking(quadratic, 0, { aligned: true, sign });
		working.divide(-2);
		const intervals = working.factorizeQuadratic();
		let sol = `${alignStar(`${dydx} &= ${quotientRuleWorking(qn)}
			\\\\ &= ${derivative}
		`)}
			For ${math(`y`)} to be increasing, ${math(`\\displaystyle ${dydx} ${sign} 0`)}
			${alignStar(`${derivative} &${sign} 0
				\\\\ ${working}
			`)}
			${display(`${intervals[0]} \\; \\blacksquare`)}
		`;
		questions.push({ body });
		answers.push({ body: sol });
	})();

	//! Question 2: 2015 P1 Q1
	(() => {
		const term1 = new Polynomial([0, 0, 1], { ascending: true });
		const term2 = new Polynomial([1, -1], { ascending: true });
		const fxFactorized = new ExpansionTerm(term1, term2);
		const fx = term1.times(term2);
		const fPrime = fx.differentiate();
		const sign = '>';
		const body = `The function ${math(`${f}`)} is defined, for all values of
		${math(`x,`)} by
		${display(`${fxString} = ${fxFactorized}.`)}
		Find the values of ${math(`x`)} for which ${math(`${f}`)}
		is an increasing function.
		`;
		const working = new InequalityWorking(fPrime, 0, { aligned: true, sign });
		const intervals = working.factorizeQuadratic();
		let sol = `${alignStar(`${fxString} &= ${fxFactorized}
			\\\\ &= ${fx}
			\\\\ ${fPrimeString} &= ${fPrime}
		`)}
			For ${math(`${f}`)} to be an increasing function, ${math(
			`\\displaystyle ${fPrimeString} ${sign} 0`,
		)}
			${alignStar(`${working}
			`)}
			${display(`${intervals[0]} \\; \\blacksquare`)}	
		`;
		questions.push({ body });
		answers.push({ body: sol });
	})();

	//! Question 3: 2013 P1 Q3
	(() => {
		const y = new xPolynomial([1, 'p', 'q', 10]);
		const root1 = 3,
			root2 = 7;
		const body = `It is given that
			${display(`y = ${y}`)}
			where ${math(`p`)} and ${math(`q`)} are integers.
			The only values of ${math(`x`)} for which ${math(`y`)}
			is a decreasing function of ${math(`x`)} are those values for
			which ${math(`${root1} < x < ${root2}.`)}
			Find the value of ${math(`p`)} and of ${math(`q.`)}
		`;
		const derivative = y.differentiate();
		const factor1 = new Polynomial([1, -root1]);
		const factor2 = new Polynomial([1, -root2]);
		const result = new ExpansionTerm('a', factor1, factor2);
		const sign = '<';
		const [c0, c1, c2] = derivative.coeffs;
		const [d0, d1] = castToPoly(factor1.times(factor2)).coeffs;
		const a = c2.cast.toFraction();
		const p = d1.divide(2).times(a);
		const q = d0.times(a);
		const sol = `${alignStar(`y &= ${y}
			\\\\ ${dydx} &= ${derivative}
		`)}
			For ${math(`y`)} to be a decreasing function, ${math(`\\displaystyle ${dydx} ${sign} 0`)}
			${eqn(`${derivative} ${sign} 0`, { leqno: true })}
			Since ${math(`y`)} is a decreasing function for ${math(`${root1} < x < ${root2},`)}
			${alignStar(`${result} &${sign} 0
				\\\\ a\\left(${factor1.times(factor2)}\\right) &${sign} 0
			`)}
			${eqn(`${result.expand()} < 0`, { leqno: true })}
			Comparing coefficients for ${math(`(1)`)} and ${math(`(2),`)}
			${alignatStar(
				`&x^2: \\quad & a &= ${c2}
				\\\\ &x^1: \\quad &  ${d1}a &= ${c1}
				\\\\ && p &= ${p} \\; \\blacksquare
				\\\\ &x^0: \\quad &  ${d0}a &= ${c0}
				\\\\ && q &= ${q} \\; \\blacksquare
				`,
				2,
			)}
		`;
		questions.push({ body });
		answers.push({ body: sol });
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
