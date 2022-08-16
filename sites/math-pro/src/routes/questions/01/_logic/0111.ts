import type { AnswerObject } from '$lib/interfaces';
import { getRandomInt, Polynomial, Rational, solveRational, heads, cramers } from 'mathlify';
import { math, display } from 'mathlifier';

// (x^2 + bx + c) / (x+d)(x+e) > 0
function a(variables?: {
	b?: number;
	c?: number;
	d?: number;
	e?: number;
	numPositive?: boolean;
	lessThan?: boolean;
}): [AnswerObject, AnswerObject] {
	// generate variables
	const { b, d, numPositive, lessThan } = {
		b: getRandomInt(-6, 6, { avoid: [0] }),
		d: getRandomInt(-9, 9),
		numPositive: heads(),
		lessThan: heads(),
		...variables,
	};
	const c = variables?.c ?? getRandomInt(Math.ceil((b * b + 1) / 4), 10);
	const e = variables?.e ?? getRandomInt(-9, 9, { avoid: [d] });
	// construct qn
	const poly1 = new Polynomial([1, b, c]);
	const poly2 = new Polynomial([1, d]).times(new Polynomial([1, e]));
	const sign = lessThan ? '<' : '>';
	const rational = numPositive ? new Rational(poly1, poly2) : new Rational(poly2, poly1);

	// typeset qn
	const body = `Without using a calculator, solve the inequality
		${display(`${rational} ${sign} 0.`)}`;

	// solution working
	const soln = solveRational(rational, 0, { lessThan });

	// answer
	const ans = math(`${soln.combinedAnswer}`);

	const question: AnswerObject = {
		body,
		marks: 4,
	};
	const answer: AnswerObject = {
		body: ans,
	};

	return [question, answer];
}

function b(variables?: {
	coeffs?: number[];
	xs?: number[];
	isIncreasing?: boolean;
}): [AnswerObject, AnswerObject] {
	// generate variables
	const [a1, b1, c1] = [
		// *1000
		getRandomInt(100, 999),
		getRandomInt(200, 1999) * (heads() ? 1 : -1),
		getRandomInt(100, 4999) * (heads() ? 1 : -1),
	];
	const xs1 = [
		// *10
		getRandomInt(-29, -5),
		getRandomInt(5, 25),
		getRandomInt(26, 49),
	];
	const ys1 = xs1.map((x) => Math.round((a1 * x * x) / 10000 + (b1 * x) / 1000 + c1 / 100) / 10);
	const xSquared = xs1.map((x) => (x * x) / 100);
	const coeffsDefault = cramers(
		xSquared[0],
		xs1[0] / 10,
		1,
		ys1[0],
		xSquared[1],
		xs1[1] / 10,
		1,
		ys1[1],
		xSquared[2],
		xs1[2] / 10,
		1,
		ys1[2],
	);
	const { coeffs, xs, isIncreasing } = {
		coeffs: coeffsDefault,
		xs: xs1,
		isIncreasing: heads(),
		...variables,
	};

	// construct qn
	const [a, b, c] = coeffs;
	const ys2 = xs.map((x) => Math.round((a * x * x) / 10 + b * x + c * 10) / 10);
	const increasing = isIncreasing ? `an increasing` : 'a decreasing';

	// typeset qn
	const body = `It is given that
		${math(`f(x)=ax^2+bx+c,`)}
		where ${math(`a,b`)} and ${math('c')}
		are constants.
	`;
	const partI = `Given that the curve with equation
		${math(`y=f(x)`)} passes through the points with coordinates
		${math(`(${(xs[0] / 10).toFixed(1)}, ${ys2[0].toFixed(1)}),`)}
		${math(`(${(xs[1] / 10).toFixed(1)}, ${ys2[1].toFixed(1)})`)} and
		${math(`(${(xs[2] / 10).toFixed(1)}, ${ys2[2].toFixed(1)}),`)}
		find the values of ${math(`a,b`)} and ${math(`c.`)}
		Give your answers correct to 3 decimal places.	
	`;
	const partII = `Find the set of values of ${math('x')} for which
		${math(`f(x)`)} is ${increasing} function.`;

	// solution working
	const xSquared2 = xs.map((x) => (x * x) / 100);

	const [aSolve, bSolve, cSolve] = cramers(
		xSquared2[0],
		xs[0] / 10,
		1,
		ys2[0],
		xSquared2[1],
		xs[1] / 10,
		1,
		ys2[1],
		xSquared2[2],
		xs[2] / 10,
		1,
		ys2[2],
	);
	const sign = isIncreasing ? '\\geq' : '\\leq';

	// answer
	const ansI = math(
		`{a=${aSolve.toFixed(3)},} \\; \\allowbreak {b=${bSolve.toFixed(
			3,
		)},} \\; \\allowbreak {c=${cSolve.toFixed(3)}.}`,
		{ wrap: true },
	);
	const ansII = math(
		`\\{ x \\in \\mathbb{R}: x ${sign} ${(-bSolve / 2 / aSolve).toPrecision(3)} \\}.`,
	);

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 3 },
			{ body: partII, marks: 2 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		parts: [{ body: ansI }, { body: ansII }],
		partLabelType: 'roman',
	};

	return [question, answer];
}

export const qnLogics = {
	a,
	b,
};
