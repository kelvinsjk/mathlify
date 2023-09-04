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
	} from 'mathlify';
	import { align, alignStar, alignatStar, display, eqn, gatherStar, math } from 'mathlifier';
	import Answer2 from '$lib/components/Answer2.svelte';

	const title = 'Unit 8: Trigonometric Functions and Equations';

	const questions: QuestionType[] = [];
	const answers: QuestionType[] = [];

	//! Question 1: 2019 P1 Q10a
	(() => {
		const x_plus_y = new Expression('x', 'y');
		const half = new Fraction(1, 2);
		const body = `Find the values of ${math(`x`)}
		and ${math(`y`)} which satisfy the equations
			${alignStar(`3^{${x_plus_y}} &= \\sqrt[3]{27}
				\\\\ \\frac{4^y}{2^x} &= \\left( ${half} \\right)^{-3}
			`)}
		`;
		let sol = alignStar(`3^{${x_plus_y}} &= 27^{\\frac{1}{3}}
			\\\\ &= \\left(3^{3} \\right)^{\\frac{1}{3}}
			\\\\ &= 3
		`);
		sol += eqn(`${x_plus_y} = 1`, { leqno: true });
		sol += alignStar(`\\frac{4^y}{2^x} &= \\left( ${half} \\right)^{-3}
			\\\\ 2^{2y-x} &= 2^3
		`);
		sol += eqn(`2y-x = 3`, { leqno: true });
		sol += `Adding ${math(`(1)`)} and ${math(`(2),`)}`;
		sol += alignStar(`3y &= 4
			\\\\ y &= \\frac{4}{3} \\; \\blacksquare
		`);
		const [x, y] = cramersRule([1, 1], 1, [-1, 2], 3);
		sol += `Substituting ${math(`y=${y}`)}
			into ${math(`(1),`)}
		`;
		sol += alignStar(`x + ${y} &= 1
			\\\\ x &= 1 - ${y}
			\\\\ &= ${x} \\; \\blacksquare
		`);
		questions.push({ body });
		answers.push({ body: sol });
	})();

	//! Question 2: 2020 P1 Q2
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		// part a
		(() => {
			const fifty_3 = new Fraction(50, 3);
			const body = `Given that
				${display(
					`\\left[ \\left( ${fifty_3} \\right)^{-2} \\times \\sqrt{3^3} \\right] \\div \\frac{5}{2} = 2^a \\, 3^b \\, 5^c,`,
				)}
				find the value of each of ${math(`a,b`)} and ${math(`c.`)}
			`;
			const three_2 = new Fraction(3, 2);
			const b = three_2.plus(2);
			const a = -2 + 1;
			const c = -4 - 1;
			const sol =
				alignStar(`&\\left[ \\left( ${fifty_3} \\right)^{-2} \\times \\sqrt{3^3} \\right] \\div \\frac{5}{2}
					\\\\ &= \\left[ \\left( ${fifty_3.reciprocal()} \\right)^2 \\times 3^{\\frac{3}{2}} \\right] \\times \\frac{2}{5}
					\\\\ &= \\left[ \\left( 3 \\cdot 2^{-1} \\cdot 5^{-2} \\right)^2 \\times  3^{\\frac{3}{2}} \\right] \\times 2 \\cdot 5^{-1}
					\\\\ &= \\left( 3^2 \\cdot 2^{-2} \\cdot 5^{-4} \\times  3^{\\frac{3}{2}} \\right) \\times 2 \\cdot 5^{-1}
					\\\\ &= 3^{${b}} \\cdot 2^{${a}} \\cdot 5^{${c}}
			`) +
				alignStar(
					`\\therefore a&=${a}  \\; \\blacksquare \\\\ b&=${b}  \\; \\blacksquare \\\\ c&=${c} \\; \\blacksquare`,
				);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const initial = 1000000;
			const interest = 7;
			const yearStart = 2014;
			const yearEnd = 2020;
			const years = yearEnd - yearStart;
			const body = `The value of a painting increases by ${math(`${interest}\\%`)} each
				year. Given that the value at the beginning of ${math(`${yearStart}`)}
				was ${math(`\\$${initial.toLocaleString()},`)} find its value, to
				2 significant figures, at the beginning of ${math(`${yearEnd}.`)}
			`;
			const rate = 1 + interest / 100;
			const val = initial * Math.pow(rate, 6);
			const valString = Number(val.toPrecision(2)).toLocaleString();
			const sol = alignStar(`&\\textrm{Value at beginning of } 2020
				\\\\ &= ${initial.toLocaleString()} \\times \\left(${rate.toFixed(2)}\\right)^6
				\\\\ &= \\$ ${valString} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ parts });
		answers.push({ parts: solParts });
	})();

	//! Question 3: 2020 P2 Q8
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		// part a
		(() => {
			const exp = new ExpFn();
			const rhs = new Fraction(3, 4);
			const body = `Solve the equation
				${display(`${exp} \\left( 1 + ${exp} \\right) = ${rhs}.`)}
			`;
			const lhs = new ExpansionTerm('u', new Expression(1, 'u'));
			const working = new EquationWorking(lhs, rhs);
			working.expand();
			working.times(4);
			working.rhsZero();
			const [u1, u2] = working.factorizeQuadratic({ variable: 'u' });
			let sol = `Let ${math(`u = ${exp}`)}`;
			sol += gatherStar(`${working}`);
			const x = exp.solve(u2);
			sol += alignatStar(
				`u&=${u1} &\\quad \\textrm{ or} \\quad&&  u&=${u2}
				\\\\ ${exp} &= ${u1}  &&& ${exp} &= ${u2}
				\\\\ &(\\textrm{NA as } ${exp} > 0) &&& x &= ${x}
			`,
				3,
			);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const y = new Polynomial(1, { variable: 'y' });
			const t1 = 1;
			const t2 = new LnFn(y, { base: 2 });
			const t3 = new LnFn(2, { base: 8 });
			const rhs = new LnFn(y.plus(3), { base: 2 });
			const lhs = new Expression(t1, t2, `\\frac{1}{${t3}}`);
			const body = `Solve the equation
				${display(`${lhs} = ${rhs}.`)}
			`;
			const [t3Den, t3Num] = t3.changeBase(2);
			const t2_plus_t3 = t2.plus(t3Num);
			let sol = gatherStar(`${t1} + ${t2} + \\frac{1}{\\frac{${t3Den}}{${t3Num}}} = ${rhs}
				\\\\ ${t1} + ${t2} + \\frac{${t3Num}}{${t3Den}} = ${rhs}
				\\\\ ${t1} + ${t2} + ${t3Num} = ${rhs}
				\\\\ ${t2_plus_t3} - ${rhs} = -${t1}
				\\\\ ${t2_plus_t3.minus(rhs)} = -${t1}
			`);
			const num = y.times(8);
			const den = y.plus(3);
			const rhs2 = new Fraction(2).pow(-1);
			const rational = new RationalFn(num, den);
			const working = new EquationWorking(rational, rhs2);
			working.crossMultiply();
			working.solveLinear({ variable: 'y' });
			sol += gatherStar(`${rational} = 2^{-1}
				\\\\ ${working} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part c
		(() => {
			const poly = new Polynomial([2, 7]);
			const den = 3;
			const pow = 2;
			const rational = new RationalFn(poly, den);
			const half_x = new Polynomial(new Fraction(1, 2));
			const exp = new ExpFn(half_x);
			const expT1 = exp.times(3);
			const expT2 = 4;
			const body = `In order to obtain a graphical solution of the equation
				${math(`\\displaystyle x = \\ln \\left\\{ \\left( ${rational} \\right)^${pow}  \\right\\},`)}
				a suitable straight line can be drawn on the same set of axes as the graph of
				${math(`y = ${expT1} + ${expT2}.`)}
				Make ${math(`${exp}`)} the subject of
				${math(`\\displaystyle x = \\ln \\left\\{ \\left( ${rational} \\right)^${pow}  \\right\\}`)}
				and hence find the equation of this line.
			`;
			const working = new EquationWorking('y', new Expression(expT1, expT2));
			working.swap();
			working.moveTerm(1);
			working.divide(3);
			let sol = gatherStar(`x = \\ln \\left\\{ \\left( ${rational} \\right)^${pow}  \\right\\}
				\\\\ x = 2 \\ln \\left( ${rational} \\right)
				\\\\ \\frac{x}{2} = \\ln \\left( ${rational} \\right)
				\\\\ ${exp} = ${rational}
			`);
			sol += gatherStar(`${working}`);
			sol += `Equating the two,`;
			const working2 = new EquationWorking(working.rhs, rational);
			working2.crossMultiply();
			working2.moveTerm(1);
			sol += gatherStar(`${working2}`);
			const eqn = working2.rhs;
			sol += `Hence the equation of the line is ${math(`y = ${eqn} \\; \\blacksquare`)}`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ parts });
		answers.push({ parts: solParts });
	})();

	//! Question 4: 2019 P1 Q5
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		// part a
		let percentage: number;
		(() => {
			const destroyPercent = 21;
			percentage = (100 - destroyPercent) / 100;
			const body = `A manufacturer produces a disinfectant that destroys
					${math(`${destroyPercent}\\%`)} of all known germs within one
					minute of use. If ${math(`N`)} is the number of germs present
					when the disinfectant is first used, and assuming germs
					continue to be destroyed at the same rate, explain why the number
					of germs expected to be alive after ${math(`n`)}
					minutes is given by ${math(`(${percentage})^n N.`)}
				`;
			const sol = `Since the disinfectant destroys ${math(`${destroyPercent}\\%`)}
				within one minute, ${math(`${percentage}\\%`)} of the germs will still be
				alive after one minute. After 1 minute, there will be ${math(`0.79 N`)}
				germs alive. After 2 minutes, there will be ${math(`0.79^2 N`)}
				so the number of germs expected to be alive after ${math(`n`)}
				minutes is given by ${math(`(${percentage})^n N.`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `The manufacturer decides to advertise by stating that the
				disinfectant destroys ${math(`x\\%`)}
				of all known germs within ${math(`20`)}
				minutes of use. Calculate, to
				${math(`2`)} significant figures, the value
				of ${math(`x.`)}
			`;
			const time = 20;
			const left = Math.pow(percentage, time);
			const x = (1 - left) * 100;
			let sol = `When ${math(`n=${time},`)}`;
			sol += alignStar(`&\\textrm{Germs alive}
				\\\\ &= (${percentage})^{${time}} N
				\\\\ &= ${left.toPrecision(5)} N
			`);
			sol += alignStar(`&\\textrm{Germs destroyed}
				\\\\ &= 1 - ${left.toPrecision(5)}
				\\\\ &= ${(1 - left).toPrecision(5)}
				\\\\ &= ${x.toPrecision(2)}\\% \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part c
		(() => {
			const body = `Given that the number of germs expected
					to be alive after ${math(`n`)} minutes can be expressed
					as ${math(`N\\operatorname{e}^{kn},`)}
					find the value of the constant ${math(`k.`)}
				`;
			const sol = gatherStar(`N \\operatorname{e}^{kn} = (${percentage})^n N
				\\\\ \\operatorname{e}^{kn} = (${percentage})^n
				\\\\ kn = \\ln \\left( ${percentage} \\right)^n
				\\\\ kn = n \\ln \\left( ${percentage} \\right)
				\\\\ k = \\ln \\left( ${percentage} \\right) \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ parts });
		answers.push({ parts: solParts });
	})();

	//! Question 5: 2018 P1 Q1
	(() => {
		const pow = new Polynomial([1, -1], { ascending: true });
		const finalPow = pow.minus(2);
		const body = `Given that ${math(`\\displaystyle \\sqrt{125^x} = \\frac{5^{${pow}}}{25},`)}
			find the value of ${math(`\\sqrt{125^x}`)}
		`;
		const leftPow = new Polynomial(new Fraction(3, 2));
		let sol = alignStar(`\\sqrt{125^x} &= \\frac{5^{${pow}}}{25}
			\\\\ \\sqrt{5^{3x}} &= \\frac{5^{${pow}}}{5^2}
			\\\\ 5^{${leftPow}} &= 5^{${finalPow}}
		`);
		const working = new EquationWorking(leftPow, finalPow, { aligned: true });
		const x = working.solveLinear({ variable: 'x' });
		sol += alignStar(`${working}`);
		const powVal = leftPow.subIn(x);
		const val = Math.pow(5, powVal.valueOf());
		sol += alignStar(`&\\sqrt{125^x} 
			\\\\ &= 5^{${leftPow}} 
			\\\\ &= 5^{${leftPow.subInWorking(x)}} 
			\\\\ &= 5^{${powVal}} 
			\\\\ &= ${val.toPrecision(3)} \\; \\blacksquare
		`);
		questions.push({ body });
		answers.push({ body: sol });
	})();

	//! Question 6: 2018 P1 Q6
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		// part a
		let lhs: Expression;
		let rhsNum: LnFn;
		let rhsDen: LnFn;
		(() => {
			const t1 = new LnFn(undefined, { base: 3 });
			const t2 = new LnFn(undefined, { base: 9 });
			rhsNum = new LnFn(undefined, { base: 10, coeff: 3 });
			rhsDen = new LnFn(3, { base: 10, coeff: 2 });
			lhs = new Expression(t1, t2);
			const body = `Show that
				${display(`${lhs} = \\frac{${rhsNum}}{${rhsDen}}.`)}
			`;
			const [num1, den1, rational1] = t1.changeBase(10);
			const [num2, den2, rational2] = t2.changeBase(10);
			let sol = alignStar(`&\\textrm{LHS}
				\\\\ &= ${lhs}
				\\\\ &= ${rational1} + ${rational2}
				\\\\ &= \\frac{${num1}}{${den1}} + \\frac{${num2}}{2 \\lg 3}
				\\\\ &= \\frac{2 \\lg x + \\lg x}{2 \\lg 3}
				\\\\ &= \\frac{3 \\lg x}{2 \\lg 3}
				\\\\ &= \\textrm{RHS} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const rhs = 4;
			const body = `Hence solve the equation
				${display(`${lhs} = ${rhs}.`)}
			`;
			const rational = new RationalTerm(rhsNum, rhsDen);
			const working = new EquationWorking(rational, rhs, { aligned: true });
			working.crossMultiply();
			working.divide(3);
			const eight_3 = new Fraction(8, 3);
			const ans = Math.pow(3, eight_3.valueOf());
			let sol = alignStar(`${working}
				\\\\ &= \\lg 3^{${eight_3}}
				\\\\ x &= 3^{${eight_3}}
				\\\\ &= ${ans.toPrecision(3)} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ parts });
		answers.push({ parts: solParts });
	})();

	//! Question 7: 2017 P2 Q5
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		// part a
		(() => {
			const xMinus1 = new Polynomial([1, -1]);
			const xPlus1 = new Polynomial([1, 1]);
			const one_7 = new Fraction(1, 7);
			const base = 5;
			const t1 = new LnFn(xMinus1, { base });
			const t2 = new LnFn(xPlus1, { base, coeff: -1 });
			const lhs = new Expression(t1, t2);
			const t3 = new LnFn(one_7, { base });
			const constant = 1;
			const rhs = new Expression(constant, t3);
			const body = `Solve the equation
				${display(`${lhs} = ${rhs}`)}
			`;
			let sol = gatherStar(`${lhs} = ${rhs}
				\\\\ ${t1.minus(t2.negative())} - ${t3} = ${constant}
				\\\\ \\log_5 \\left( \\frac{${xMinus1}}{${xPlus1}} \\div ${one_7} \\right) = ${constant}
				\\\\ \\log_5 \\left( \\frac{${xMinus1}}{${xPlus1}} \\times \\frac{7}{1} \\right) = ${constant}
				\\\\ \\log_5 \\frac{${xMinus1.times(7)}}{${xPlus1}} = ${constant}
				\\\\ \\frac{${xMinus1.times(7)}}{${xPlus1}} = 5^${constant}
			`);
			const rational = new RationalTerm(xMinus1.times(7), xPlus1);
			const rhs2 = Math.pow(base, constant);
			const working = new EquationWorking(rational, rhs2, { aligned: true });
			working.crossMultiply();
			working.solveLinear();
			sol += alignStar(`${working} \\; \\blacksquare`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const t1 = new LnFn(100, { base: 'y' });
			const t2 = new LnFn('y', { base: 10 });
			const body = `Solve the equation
				${math(`${t1} = ${t2},`)}
				giving your answer to 2 significant figures.
			`;
			let sol = alignStar(`${t1} &= ${t2}
				\\\\ \\frac{\\lg 100}{\\lg y} &= ${t2}
				\\\\ \\frac{\\lg 10^2}{\\lg y} &= ${t2}
				\\\\ \\frac{2\\lg 10}{\\lg y} &= ${t2}
				\\\\ \\frac{2}{\\lg y} &= ${t2}
				\\\\ \\left( ${t2} \\right)^2 &= 2
				\\\\ ${t2} &= \\pm \\sqrt{2}
			`);
			const y1 = Math.pow(10, -Math.sqrt(2));
			const y2 = Math.pow(10, Math.sqrt(2));
			sol += alignatStar(
				`y &= 10^{-\\sqrt{2}} &\\quad &\\textrm{or}\\quad& y &= 10^{\\sqrt{2}}
				\\\\ y &= ${y1.toPrecision(2)} &&& y &= ${y2.toPrecision(2)} \\; \\blacksquare
			`,
				3,
			);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ parts });
		answers.push({ parts: solParts });
	})();

	//! Question 8: 2017 P2 Q7
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		// part a
		(() => {
			const body = `The percentage, ${math(`P,`)}
				of carbon-14 remaining in a piece of fossilised
				wood is given by
				${math(`P = 100\\operatorname{e}^{-kt},`)}
				where ${math(`k`)} is a constant and
				${math(`t`)} is measured in years. It takes
				${math(`5730`)} years for the carbon-14
				to be reduced to half of the original amount. Calculate
			`;
			const year = 8000;
			const subParts = [
				{ body: `the value of ${math(`k,`)}` },
				{
					body: `the percentage of carbon-14 which would indicate a fossil age of ${math(
						`${year}`,
					)} years.`,
				},
			];
			const k = Math.log(1 / 2) / -5730;
			const sol1 =
				`Substituting ${math(`P=50`)} and ${math(`t=5730`)} into the equation,` +
				alignStar(
					`50 &= 100\\operatorname{e}^{-k(5730)}
					\\\\ \\operatorname{e}^{-5730k} &= \\frac{1}{2}
					\\\\ \\ln \\operatorname{e}^{-5730k} &= \\ln \\frac{1}{2}
					\\\\ -5730k \\ln \\operatorname{e} &= \\ln \\frac{1}{2}
					\\\\ k &= -\\frac{1}{5730}\\ln \\frac{1}{2}
					\\\\ &= ${k.toPrecision(5)}
					\\\\ &= ${k.toPrecision(3)} \\textrm{ (3 sf)} \\; \\blacksquare
				`,
				);
			const P = 100 * Math.exp(-k * year);
			const sol2 =
				`When ${math(`t=8000,`)}` +
				alignStar(
					` P &= 100\\operatorname{e}^{-k(8000)}
					\\\\ &= 100\\operatorname{e}^{${k.toPrecision(5)}(8000)}
					\\\\ &= ${P.toPrecision(3)} \\% \\textrm{ (3 sf)} \\; \\blacksquare
				`,
				);
			const solSubparts = [{ body: sol1 }, { body: sol2 }];
			parts.push({ body, parts: subParts });
			solParts.push({ parts: solSubparts });
		})();
		// part b
		(() => {
			const multiple = 50;
			const size = new Fraction(24, 10);
			const body = `The size, ${math(`S,`)}
				and intensity, ${math(`I,`)} of a naturally occurring
				event are connected by the formula
				${math(`\\displaystyle S = \\lg \\frac{I}{c},`)}
				where ${math(`c`)} is a constant.
				Calculate, to ${math(`1`)} decimal place,
				the size of the event which has intensity
				${math(`${multiple}`)} that of an event of size
				${math(`${size.toFixed(1)}.`)}
			`;
			let sol = `When event has size ${math(`2.4,`)}`;
			sol += alignStar(`2.4 &= \\lg \\frac{I}{c}
				\\\\ \\frac{I}{c} &= 10^{2.4}
				\\\\ I &= 10^{2.4} c
			`);
			sol += `For event of intensity ${math(`50`)} times,`;
			const intensity = Math.log10(50 * Math.pow(10, 2.4));
			sol += alignStar(`S &= \\lg \\frac{50 \\times 10^{2.4}c}{c}
				\\\\ &= lg \\left( 50 \\times 10^{2.4} \\right)
				\\\\ &= ${intensity.toFixed(1)} \\textrm{ (1 dp)} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ parts });
		answers.push({ parts: solParts });
	})();

	//! Question 9: 2016 P2 Q7
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		// part a
		const two_x = new ExpFn('x', { base: 2 });
		const pow1 = new Polynomial([2, -1]);
		const pow2 = new Polynomial([1, 2]);
		let working: EquationWorking;
		(() => {
			const body = `Given that ${math(`u = ${two_x},`)}
				express ${display(`2^{${pow1}} = 2^{${pow2}} - 6`)}
				as an equation in ${math(`u.`)}
			`;
			let sol = alignStar(`2^{${pow1}} &= 2^{${pow2}} - 6
				\\\\ 2^{2x} \\cdot 2^{-1} &= 2^x \\cdot 2^2 - 6
				\\\\ \\frac{1}{2} \\left(2^{2x}\\right) &= 4 \\left( 2^x \\right) - 6
			`);
			sol += `Let ${math(`u = 2^x`)}`;
			const lhs = new Polynomial([new Fraction(1, 2), 0, 0], { variable: 'u' });
			const rhs = new Polynomial([4, -6], { variable: 'u' });
			working = new EquationWorking(lhs, rhs);
			working.times(2);
			working.rhsZero();
			sol += gatherStar(`${working} \\; \\blacksquare`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Hence find the values of
			${math(`x`)} for which
			${display(`2^{${pow1}} = 2^{${pow2}} - 6,`)}
			giving your answer, where appropriate,
			to ${math(`1`)} decimal place.`;
			const [u1, u2] = working.factorizeQuadratic({ variable: 'u' });
			const x2 = Math.log(6) / Math.log(2);
			const sol = alignatStar(
				`u&=${u1} &\\quad &\\textrm{or}\\quad& u&=${u2}
				\\\\ 2^x &= ${u1} &&& 2^x &= ${u2}
				\\\\ x &= 1 \\; \\blacksquare &&& \\ln 2^x &= \\ln ${u2}
				\\\\ &&&& x \\ln 2 &= \\ln ${u2}
				\\\\ &&&& x &= \\frac{\\ln ${u2}}{\\ln 2}
				\\\\ &&&& &= ${x2.toFixed(1)} \\textrm{ (1 dp)} \\; \\blacksquare
			`,
				3,
			);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part c
		(() => {
			const body = `Explain why the equation
				${display(`2^{${pow1}} = 2^{${pow2}} - k`)}
				has no solution if ${math(`k>8.`)}
			`;
			let sol = `Modifying the working in (i) for the new equation,`;
			const poly = new xPolynomial([1, -8, new Term(2, 'k')], { variable: 'u' });
			sol += gatherStar(`\\frac{1}{2}u^2 = 4u - k
			\\\\ u^2 = 8u - 2k
			\\\\ ${poly} = 0
			`);
			const d = poly.quadraticDiscriminant();
			sol += alignStar(`&\\textrm{Discriminant}
				\\\\ &= b^2 - 4ac
				\\\\ &= 8^2 - 4(1)(2k)
				\\\\ &= ${d}
			`);
			sol += `If ${math(`k > 8,`)}`;
			const working2 = new InequalityWorking('k', 8, { sign: '>', aligned: true });
			working2.times(-8);
			working2.plus(64, { hide: true });
			working2.changeOrder([1, 0]);
			sol += alignStar(`${working2}
				\\\\ \\textrm{Discriminant} &< 0
			`);
			sol += `Hence the equation has no solution if ${math(`k > 8 \\; \\blacksquare`)}`;

			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ parts });
		answers.push({ parts: solParts });
	})();

	//! Question 10: 2015 P1 Q2
	//TODO: graphs
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const log_a_x = new LnFn('x', { base: 'a' });
		const pt1 = new Point(8, 3);
		const pt2 = `\\left( 1, b \\right)`;
		const pt3 = `\\left( c, -2 \\right)`;
		const body = `The graph of ${math(`y=${log_a_x}`)}
			passes through the points with coordinates
			${math(`${pt1},`)}
			${math(`${pt2}`)} and ${math(`${pt3}.`)}
		`;
		// part a
		(() => {
			const body = `Determine the value of each of the constants
				${math(`a,b`)}
				and ${math(`c.`)}
			`;
			let sol = `Substituting ${math(`x=${pt1.x},`)} ${math(`y=${pt1.y},`)}`;
			sol += alignStar(`3 &= \\log_a 8
				\\\\ a^3 &= 8
				\\\\ &= 2^3
				\\\\ a &= 2 \\; \\blacksquare
			`);
			sol += `Substituting ${math(`x=1,`)} ${math(`y=b,`)}`;
			sol += alignStar(`b &= \\log_2 1
				\\\\ &= 0 \\; \\blacksquare
			`);
			sol += `Substituting ${math(`x=c,`)} ${math(`y=-2,`)}`;
			sol += alignStar(`-2 &= \\log_2 c
				\\\\ c &= 2^{-2}
				\\\\ &= \\frac{1}{4} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			//TODO: graphs
			const body = `Sketch the graph of
				${math(`y = ${log_a_x}.`)}
			`;
			let sol = `TODO: graph`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 11: 2015 P1 Q3
	(() => {
		const doublingT = 3;
		const e = `\\operatorname{e}`;
		const body = `The number of bacteria in a culture
			doubles every ${math(`${doublingT} \\textrm{ hours}.`)}
			It is given that ${math(`N_0`)} is the number of bacteria
			present at a particular time and that ${math(`N`)}
			is the number of bacteria present ${math(`t`)}
			hours later. Calculate the value of the constant
			${math(`k`)} in the relationship
			${math(`N = N_0 ${e}^{kt}.`)}
		`;
		const k = Math.LN2 / doublingT;
		const sol = `When ${math(`t=${doublingT},`)} ${math(`N = 2N_0`)}
			${alignStar(`2N_0 &= N_0 ${e}^{k(${doublingT})}
				\\\\ ${e}^{3k} &= 2
				\\\\ \\ln ${e}^{3k} &= \\ln 2
				\\\\ 3k \\ln ${e} &= \\ln 2
				\\\\ 3k &= \\ln 2
				\\\\ k &= \\frac{\\ln 2}{3}
				\\\\ &= ${k.toPrecision(3)} \\textrm{ (3 sf)} \\; \\blacksquare
			`)}
		`;
		questions.push({ body });
		answers.push({ body: sol });
	})();

	//! Question 12: 2014 P2 Q1
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const start = 80;
		const e = `\\operatorname{e}`;
		const A = 60;
		const degree = `^\\circ\\textrm{C}`;
		const body = `Baby food is heated in a microwave to a temperature
			of ${math(`${start}${degree}.`)}
			It is subsequently cools in such a way that its
			temperature, ${math(`T${degree},`)}
			${math(`t \\textrm{ minutes}`)} after removal from the microwave,
			is given by
			${display(`T = 20 + A${e}^{-kt},`)}
			where ${math(`A`)} and ${math(`k`)} are constants.
		`;
		// part a
		(() => {
			const body = `Explain why ${math(`A=${A}.`)}`;
			const sol = `When ${math(`t=0,`)} ${math(`T=80`)}
				${gatherStar(`80 = 20 + A${e}^{-k(0)}
					\\\\ 20 + A (1) = 80
					\\\\ A = 60 \\; \\blacksquare
				`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		let k: number;
		// part b
		(() => {
			const t = 1;
			const temp = 65;
			const uplevel = `When ${math(`t=${t},`)}
				the temperature of the food is ${math(`${temp}${degree}.`)}
			`;
			const body = `Find the value of ${math(`k`)}
				correct to ${math(`3`)} significant figures.
			`;
			const num = temp - 20;
			const rhs = new Fraction(num, A);
			k = -Math.log(rhs.valueOf());
			const sol = `When ${math(`t=${t},`)} ${math(`T=${temp}`)}
				${gatherStar(`${temp} = 20 + 60${e}^{-k(${t})}
					\\\\ ${A} ${e}^{-k} = ${num}
					\\\\ ${e}^{-k} = ${rhs}
					\\\\ \\ln ${e}^{-k} = \\ln ${rhs}
					\\\\ -k \\ln ${e} = \\ln ${rhs}
					\\\\ -k  = \\ln ${rhs}
					\\\\ k  = -\\ln ${rhs}
					\\\\ k = ${k.toPrecision(5)}
					\\\\ k = ${k.toPrecision(3)} \\textrm{ (3 sf)} \\; \\blacksquare
				`)}
			`;
			parts.push({ uplevel, body });
			solParts.push({ body: sol });
		})();
		// part c
		(() => {
			const threshold = 40;
			const time = 4;
			const uplevel = `A baby should only be given this food when the
				temperature of the food is less than ${math(`${threshold}${degree}.`)}
			`;
			const body = `Determine, with working, whether it is safe to
				give the food ${math(`${time} \\textrm{ minutes}`)}
				after removal from the microwave.
			`;
			const T = 20 + A * Math.exp(-k * time);
			const sol = `When ${math(`t=${time},`)}
				${alignStar(`T &= 20 + ${A}${e}^{(${k.toPrecision(5)})(${time})}
					\\\\ &= ${T.toPrecision(5)}
					\\\\ &< ${threshold}
				`)}
				Hence it is safe to give the food ${math(`\\blacksquare`)}
			`;
			parts.push({ uplevel, body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 13: 2014 P2 Q5
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		// part a
		(() => {
			const x = new Polynomial(1);
			const x_minus_4 = new Polynomial([1, -4]);
			const t1 = new LnFn(x, { base: 2, coeff: 2 });
			const t2 = new LnFn(x_minus_4, { base: 2 });
			const rhs = 3;
			const lhs = new Expression(t1, t2.negative());
			const body = `Express
				${display(`${lhs} = ${rhs}`)}
				as a quadratic equation in ${math(`x`)}
				and explain why there are no real solutions.
			`;
			const rational = new RationalTerm(x.pow(2), x_minus_4);
			const working = new EquationWorking(rational, Math.pow(2, rhs));
			working.crossMultiply();
			working.rhsZero();
			let sol = gatherStar(`${lhs} = ${rhs}
				\\\\ ${t1.coeffToPower()} - ${t2} = ${rhs}
				\\\\ ${t1.minus(t2)} = ${rhs}
				\\\\ ${rational} = 2^{${rhs}}
				\\\\ ${working} \\; \\blacksquare
			`);
			const poly = castToPoly(working.lhs);
			const d = poly.quadraticDiscriminant();
			sol += alignStar(`&\\textrm{Discriminant}
				\\\\ &= b^2 - 4ac
				\\\\ &= (${poly.coeffs[1]})^2 - 4(${poly.coeffs[0]})(${poly.coeffs[2]})
				\\\\ &= ${d}
				\\\\ &< 0
			`);
			sol += `Hence there are no real solutions ${math(`\\blacksquare`)}`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const num = new LnFn('y', { base: 'x' });
			const den = new LnFn('x', { base: 'y' });
			const t2 = 8;
			const body = `Given that
				${display(`\\frac{\\left(${num}\\right)^2}{${den}} + ${t2} = 0,`)}
				express ${math(`y`)} in terms of ${math(`x.`)}
			`;
			let sol = gatherStar(`\\frac{\\left(${num}\\right)^2}{${den}} + ${t2} = 0
				\\\\ \\frac{\\left(${num}\\right)^2}{\\frac{\\log_x x}{\\log_x y}} = ${-t2}
				\\\\ \\frac{\\left(${num}\\right)^2}{\\frac{1}{\\log_x y}} = ${-t2}
				\\\\ \\left(${num}\\right)^3 = ${-t2}
				\\\\ ${num} = -2
				\\\\ y = x^{-2} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ parts });
		answers.push({ parts: solParts });
	})();

	//! Question 14: 2013 P1 Q8
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		const degree = `^\\circ\\textrm{C}`;
		const e = `\\operatorname{e}`;
		const body = `The temperature, ${math(`T${degree},`)}
			of a chicken removed from a freezer is given by
			the formula
			${display(`T = 20 - 38${e}^{-0.6t},`)}
			where ${math(`t`)} is the time in hours since
			the chicken was removed from the freezer.
		`;
		// part a
		(() => {
			const body = `Find the temperature at which
				the chicken is kept in the freezer.
			`;
			const initial = 20 - 38;
			const sol = `When ${math(`t=0,`)}
				${alignStar(`T &= 20 - 38${e}^{-0.6(0)}
					\\\\ &= ${initial}
				`)}
				Hence the chicken is kept at ${math(`${initial}${degree} \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const body = `Find the temperature of the chicken
				when ${math(`t=2.`)}`;
			const T = 20 - 38 * Math.exp(-0.6 * 2);
			const sol = `When ${math(`t=2,`)}
				${alignStar(`T &= 20 - 38${e}^{-0.6(2)}
					\\\\ &= ${T.toPrecision(3)}${degree} \\textrm{ (3 sf)} \\; \\blacksquare
				`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part c
		(() => {
			const body = `Express ${math(`t`)}
				as a function of ${math(`T.`)}
			`;
			const sol = gatherStar(`T = 20 - 38${e}^{-0.6t}
				\\\\ 38${e}^{-0.6t} = 20 - T
				\\\\ {e}^{-0.6t} = \\frac{20 - T}{38}
				\\\\ -0.6t = \\ln \\frac{20 - T}{38}
				\\\\ t = -\\frac{\\ln \\frac{20 - T}{38}}{0.6}
				\\\\ t = -\\frac{5}{3} \\ln \\frac{20-T}{28}
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part d
		(() => {
			const body = `Explain why the temperature of the
				chicken can never reach ${math(`20${degree}.`)}
			`;
			const sol = `${math(`${e}^{-0.6t}`)} is always positive for all real values of
				${math(`t`)} so ${math(`T = 20 - 38${e}^{-0.6t}`)}
				will always be smaller than ${math(`20`)} so the temperature of the chicken
				can never reach ${math(`20${degree} \\; \\blacksquare`)}
			`;
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		questions.push({ body, parts });
		answers.push({ parts: solParts });
	})();

	//! Question 15: 2013 P2 Q8b
	(() => {
		const pow1 = new Polynomial(2);
		const pow2 = new Polynomial([2, 1], { ascending: true });
		const constant = 21;
		const lhs = new ExpFn(pow1, { base: 2 });
		const t1 = new ExpFn(pow2, { base: 2 });
		const rhs = new Expression(constant, t1);
		const two_x = new ExpFn('x', { base: 2 });
		const body = `Express
			${display(`${lhs} = ${rhs}`)}
			as a quadratic equation in ${math(`${two_x}`)}
			and hence find, correct to ${math(`2`)}
			decimal places, the value of ${math(`x`)}
			which satisfies the equation
			${display(`${lhs} = ${rhs}.`)}
		`;
		let sol = alignStar(`${lhs} &= ${rhs}
				\\\\ 2^{2x} &= 2^2 \\cdot 2^x + 21
			`);
		sol += display(
			`\\left(${two_x}\\right)^2 - 4\\left(${two_x}\\right) - 21 = 0 \\; \\blacksquare`,
		);
		const poly = new Polynomial([1, -4, -21], { variable: `${two_x}` });
		const working = new EquationWorking(poly);
		const [u1, u2] = working.factorizeQuadratic();
		working.clear();
		sol += gatherStar(`${working}`);
		const x = Math.log(u2.valueOf()) / Math.log(2);
		sol += alignatStar(
			`${two_x} &= ${u1} &\\quad &\\textrm{or}\\quad& ${two_x} &= ${u2}
			\\\\ ${two_x} &= ${u2} &&& x &= ${u1} \\textrm{ rejected as } ${two_x} > 0 \\textrm{ for all } x
			\\\\ \\ln ${two_x} &= \\ln ${u2}
			\\\\ x \\ln 2 &= \\ln ${u2}
			\\\\ x &= \\frac{\\ln ${u2}}{\\ln 2}
			\\\\ &= ${x.toFixed(2)} \\textrm{ (2 dp)} \\; \\blacksquare
		`,
			3,
		);
		questions.push({ body });
		answers.push({ body: sol });
	})();

	//! Question 16: 2019 P2 Q4
	(() => {
		const parts: QuestionType['parts'] = [];
		const solParts: QuestionType['parts'] = [];
		// part a
		(() => {
			const t1 = new LnFn('x', { base: 2 });
			const t2 = new LnFn('x', { base: 16 });
			const lhs = new Expression(t1, t2);
			const body = `Solve the equation
				${display(`${lhs} = -2.5.`)}
			`;
			const rational = t2.changeBase(2)[2];
			let sol = gatherStar(`${lhs} = -2.5
				\\\\ ${t1} + ${rational} = -2.5
				\\\\ ${t1} + \\frac{${t1}}{\\log_2 2^4} = -2.5
				\\\\ ${t1} + \\frac{${t1}}{4 \\log_2 2} = -2.5
				\\\\ ${t1} + \\frac{${t1}}{4} = -2.5
				\\\\ 4 ${t1} + ${t1} = -10
				\\\\ 5 ${t1} = -10
				\\\\ ${t1} = -2
				\\\\ x = 2^{-2} 
				\\\\ x = \\frac{1}{4} \\; \\blacksquare
			`);
			parts.push({ body });
			solParts.push({ body: sol });
		})();
		// part b
		(() => {
			const lgZ = new LnFn('z', { base: 10 });
			const lgY = new LnFn('y', { base: 10 });
			const neg_lgY = lgY.negative();
			const lhs = new Expression(lgZ, neg_lgY);
			const rhs = new LnFn('(z+y)', { base: 10 });
			const body = `It is given that 
				${display(`${lhs} = ${rhs}.`)}
			`;
			const subParts = [
				{ body: `Express ${math(`z`)} in terms of ${math(`y.`)}` },
				{
					body: `State the range of values of ${math(`z`)}
					and explain clearly why ${math(`0 < y < 1.`)}
				`,
				},
			];
			const z_over_y = new RationalTerm('z', 'y');
			const z_plus_y = new Expression('z', 'y');
			const working = new EquationWorking(z_over_y, z_plus_y, { aligned: true });
			working.crossMultiply();
			working.moveTerm(0, { from: 'rhs' });
			const solI = alignStar(`${lhs} &= ${rhs}
				\\\\ ${lgZ.minus(lgY)} &= ${rhs}
				\\\\ ${working}
				\\\\ z(1-y) &= ${working.rhs}
				\\\\ z &= \\frac{${working.rhs}}{1-y}
			`);
			const solII = `Since we are working with ${math(`${lgZ}`)} and
				${math(`${lgY}`)}
				${align(
					`z &> 0 \\; \\blacksquare
					\\\\ y &> 0
					`,
					{ leqno: true },
				)}
				From part (bi), ${math(`\\displaystyle z = \\frac{y^2}{1-y}.`)}
				Since ${math(`z > 0,`)} we must have
				${display(`1-y > 0`)}
				${eqn(`y < 1`, { leqno: true })}
				Combining ${math(`(2)`)} and ${math(`(3),`)}
				${display(`0 < y < 1 \\; \\blacksquare`)}
			`;
			const solSubParts = [{ body: solI }, { body: solII }];
			parts.push({ body, parts: subParts });
			solParts.push({ parts: solSubParts });
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
	<Answer2 answers={questions} questionMode={true} />
	<hr />
	<h3>Answers</h3>
	<Answer2 {answers} />
</section>
