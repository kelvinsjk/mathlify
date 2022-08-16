import type { AnswerObject } from '$lib/interfaces';
import {
	Fraction,
	getRandomAngle,
	ComplexExp,
	expToCartesian,
	Complex,
	complexToQuadratic,
	Polynomial,
	Expression,
	subComplexIntoPoly,
	longDivide,
	getRandomInt,
	gcd,
	solveLinear,
	Angle,
} from 'mathlify';
import { math, display } from 'mathlifier';

function a(variables?: {
	x?: number;
	y?: number;
	a?: number;
	b?: number;
}): [AnswerObject, AnswerObject] {
	const { x, y, a, b } = {
		x: getRandomInt(-3, 3, { avoid: [0] }),
		y: getRandomInt(-3, 3, { avoid: [0] }),
		a: getRandomInt(-60, 60, { avoid: [0] }),
		b: getRandomInt(1, 27),
		...variables,
	};
	// set up: variables
	const divisor = gcd(x, y);
	const w = new Complex(x / divisor, y / divisor);
	// set up: question
	const quad = complexToQuadratic(w);
	const linear = new Polynomial([b, -a], { unknown: 'z' });
	const cubic = quad.times(linear);
	const coeffs = cubic.coefficients;
	const middleTerms = new Polynomial([coeffs[2], coeffs[1], 0], { unknown: 'z' });
	const cubicQn = new Expression('az^3', ...middleTerms.terms, 'b');

	// question
	const body = `The complex number ${math('w')} is given by ${math(`${w}.`)}`;
	const partI = `Find ${math(`w^3`)} in the form ${math('x+\\mathrm{i}y,')} showing your working.`;
	const partII = `Given that ${math('w')} is ar root of the equation ${display(`${cubicQn}=0,`)}
		find the values of the real numbers ${math('a')} and ${math('b.')}`;
	const partIII = `Using these values of ${math('a')} and ${math('b,')} find all the roots of this 
		equation in exact form.`;

	// solution working
	const w3 = w.pow(3);
	const lhsConstants = subComplexIntoPoly(w, middleTerms);
	const aSolve = lhsConstants.imag.negative().divide(w3.imag);
	const bSolve = lhsConstants.real.negative().minus(w3.times(aSolve).real);
	const cubicSolve = new Polynomial([aSolve, coeffs[2], coeffs[1], bSolve], { unknown: 'z' });
	const [linearSolve] = longDivide(cubicSolve, quad);
	const z3Solve = solveLinear(linearSolve);

	// answer
	const ansI = `${math(`w^3 = ${w3}.`, { wrap: true })}`;
	const ansII = `${math(`a=${aSolve}, \\;`)} ${math(`b=${bSolve}.`)}`;
	const ansIII = `${math(`z=${w}, \\;`)} ${math(`z=${w.conjugate()} \\;`)} or ${math(
		`z=${z3Solve}.`,
	)}`;

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 2 },
			{ body: partII, marks: 3 },
			{ body: partIII, marks: 3 },
		],
	};
	const answer: AnswerObject = {
		parts: [{ body: ansI }, { body: ansII }, { body: ansIII }],
	};

	return [question, answer];
}

function b(variables?: {
	k?: Fraction; // angle
	n?: number;
}): [AnswerObject, AnswerObject] {
	const { k, n } = {
		k: getRandomAngle(),
		n: getRandomInt(4, 12),
		...variables,
	};
	// set up: variables
	// part i
	const x = new ComplexExp(2, k);
	const xCartesian = expToCartesian(x);

	// question
	const body = `The complex number ${math('z')} is given by ${math(
		`z=\\mathrm{e}^{\\mathrm{i}\\theta},`,
	)}
		where ${math(`r>0`)} and ${math(`-\\pi< \\theta \\leq \\pi`)}.`;
	const partI = `Given that ${math(`w=(${xCartesian})z, `)}
		find ${math(`\\left|w\\right|`)} in terms of ${math(`r`)} and ${math(`\\arg w`)} in terms 
		of ${math('\\theta.')}
	`;
	const partII = `Given that ${math(`\\displaystyle \\arg \\left( \\frac{z^{${n}}}{w^2} \\right) = 
		${k.isGreaterThan(0) ? '-\\pi' : '\\pi'},`)} find ${math('\\theta.')}
	`;

	// solution working
	// part i
	const argument = new Expression('\\theta', x.theta);
	const k2 = k
		.times(2)
		.plus(k.isGreaterThan(0) ? -1 : 1)
		.divide(n - 2);
	const theta = new Angle(k2);

	// answer
	const ansI = `${math(`\\left| w \\right|=2r,`)}
		<br>${math(`\\arg w =${argument}.`)}`;
	const ansII = `${math(`\\theta=${theta}.`)}`;

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 2 },
			{ body: partII, marks: 3 },
		],
	};
	const answer: AnswerObject = {
		parts: [{ body: ansI }, { body: ansII }],
	};

	return [question, answer];
}

export const qnLogics = {
	a,
	b,
};
