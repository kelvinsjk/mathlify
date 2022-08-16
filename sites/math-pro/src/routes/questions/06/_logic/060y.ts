import type { AnswerObject } from '$lib/interfaces';
import {
	getRandomInt,
	expToPoly,
	solveLinear,
	Term,
	Complex,
	xComplex,
	solveQuadratic,
	PowerFn,
	SinFn,
	CosFn,
	quotientRule,
	Polynomial,
	Parametric,
	Angle,
	Fraction,
} from 'mathlify';
import { math, display } from 'mathlifier';

function dydxString(y = 'y', x = 'x'): string {
	return `\\frac{\\mathrm{d}${y}}{\\mathrm{d}${x}}`;
}

function qn7(variables?: { a?: number; b?: number; k?: number }): [AnswerObject, AnswerObject] {
	const { a, b, k } = {
		a: getRandomInt(-5, 5, { avoid: [0] }),
		b: getRandomInt(-5, 5, { avoid: [0] }),
		k: getRandomInt(-9, 9, { avoid: [0] }),
		...variables,
	};
	// set up: variables
	const x = new PowerFn(2, { fx: new CosFn({ fx: 't' }) });
	const y = new PowerFn(3, { fx: new SinFn({ fx: 't' }) });
	const xTheta = new PowerFn(2, { fx: new CosFn({ fx: '\\theta' }) });
	const yTheta = new PowerFn(3, { fx: new SinFn({ fx: '\\theta' }) });
	//const para = new Parametric(x, y);
	const t1 = new Angle(0),
		t2 = new Angle(90);
	const area = '';
	const integrand = '';
	const substitution = '';
	// set up: question

	// question
	const body = `A curve has parametric equations
		${display(`x=${x}, \\quad y = ${y}, \\quad \\textrm{for } ${t1} \\leq t \\leq ${t2}.`)}
  `;
	const partI = `Sketch the curve.`;
	const partII = `The tangent to the curve at 
		${math(`\\left( ${xTheta}, ${yTheta} \\right),`)}
		where ${math(`${t1} < \\theta < ${t2},`)}
		meets the ${math(`x\\textrm{-}`)} and ${math(`y\\textrm{-axes}`)}
		at ${math(`Q`)} and ${math(`R`)} respectively. The origin is denoted by ${math(`O.`)}
		Show that the are of triangle ${math(`OQR`)} is 
		${display(`${area}.`)}
	`;
	const partIII = `Show that the area under the curve for
		${math(`${t1} \\leq t \\leq ${t2}`)} is
		${math(`\\displaystyle \\int_{${t1}}^{${t2}} ${integrand} \\; \\mathrm{d}t,`)}
		and use the substitution ${math(`${substitution}`)} to find this area.
	`;

	// solution working

	// answer
	const ans = '';

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 2 },
			{ body: partII, marks: 6 },
			{ body: partIII, marks: 5 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		body: ans,
	};

	return [question, answer];
}

function qn8(variables?: {
	a?: number;
	b?: number;
	c?: number;
	d?: number;
}): [AnswerObject, AnswerObject] {
	const a = variables?.a ?? getRandomInt(-5, 5, { avoid: [0] });
	const b =
		variables?.b ?? (Math.abs(a) === 1 ? getRandomInt(-5, 5) : getRandomInt(-9, 9, { avoid: [0] }));
	const c = variables?.a ?? getRandomInt(1, 3, { avoid: [0] });
	const avoid = (b * c) % a === 0 ? [0, (b * c) / a] : [0];
	const d = variables?.d ?? getRandomInt(-5, 5, { avoid });

	// set up: variables
	const num = new Polynomial([a, b]);
	const den = new Polynomial([c, d]);
	const f = `\\frac{${num}}{${den}}`;
	const derivative = quotientRule(num, den);
	// set up: question
	const sign = a * d - b * c > 0 ? '>' : '<';
	const increasing = a * d - b * c > 0 ? 'increasing' : 'decreasing';

	// question
	const body = `It is given that ${display(`f(x) = \\frac{ax+b}{cx+d},`)} for non-zero constants 
		${math(`a,b,c`)} and ${math(`d.`)}`;
	const partI = `Given that ${math(`ad-bc \\neq 0,`)} show by differentiation that the graph of
		${math(`y=f(x)`)} has no turning points.`;
	const partII = `What can be said about the graph of ${math(`y=f(x)`)} when ${math(`ad-bc=0?`)}`;
	const partIII = `Explain whether the function ${display(
		`f(x)=${f}`,
	)} is increasing or decreasing?`;
	const partIV = `Draw a sketch of the graph of ${display(`y=${f},`)}
		including the coordinates of the points where the graph cross the axes and the equations of any
		asymptotes.`;

	// solution working

	const ansI = `${math(`\\displaystyle f'(x) = \\frac{ad-bc}{(cx+d)^2} \\neq 0`)}
		for all ${math(`x \\in \\mathbb{R}, x \\neq -\\frac{d}{c}.`)}`;
	const ansII = `The graph is a horizontal line ${math(`\\displaystyle y=\\frac{a}{c}.`)}`;
	const ansIII = `${math(`\\displaystyle f'(x) = ${derivative.string} ${sign} 0`)}
		for all ${math(`x \\in \\mathbb{R}, x \\neq ${new Fraction(-d, c)}`)} so the function is
		${increasing}.`;
	const ansIV = '';

	const question: AnswerObject = {
		body,
		partLabelType: 'roman',
		parts: [
			{ body: partI, marks: 3 },
			{ body: partII, marks: 2 },
			{ body: partIII, marks: 1 },
			{ body: partIV, marks: 3 },
		],
	};
	const answer: AnswerObject = {
		partLabelType: 'roman',
		parts: [{ body: ansI }, { body: ansII }, { body: ansIII }, { body: ansIV }],
	};

	return [question, answer];
}

function qn9(variables?: { a?: number; b?: number; k?: number }): [AnswerObject, AnswerObject] {
	const { a, b, k } = {
		a: getRandomInt(-5, 5, { avoid: [0] }),
		b: getRandomInt(-5, 5, { avoid: [0] }),
		k: getRandomInt(-9, 9, { avoid: [0] }),
		...variables,
	};
	// set up: variables
	const x = new Polynomial([1, 4, 0], { unknown: 't' });
	const y = new Polynomial([1, 1, 0, 0], { unknown: 't' });
	const dydx = `\\frac{${y.derivative()}}{${x.derivative()}}`;

	const para = new Parametric(x, y);
	// set up: question

	// question
	const body = `${math(`${dydx}`)}<br>
		${math(`${para.dydx()}`)}
  `;

	// solution working

	// answer
	const ans = '';

	const question: AnswerObject = {
		body,
		marks: 4,
	};
	const answer: AnswerObject = {
		body: ans,
	};

	return [question, answer];
}

export const qnLogics = {
	qn7,
	qn8,
	qn9,
};
