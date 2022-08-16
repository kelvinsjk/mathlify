import type { AnswerObject } from '$lib/interfaces';
import {
	Complex,
	getRandomInt,
	heads,
	Fraction,
	getRandomAngle,
	Angle,
	ComplexExp,
	expToCartesian,
	complexToQuadratic,
	Polynomial,
} from 'mathlify';
import { math, display } from 'mathlifier';

function a(variables?: { k?: Fraction; positive?: boolean }): [AnswerObject, AnswerObject] {
	const { k, positive } = {
		k: getRandomAngle(),
		positive: heads(),
		...variables,
	};
	if (k.abs().isEqualTo(new Fraction(2, 3))) {
		return a();
	}
	const n = k.den === 4 ? 2 : 3;

	// set up: variables
	const theta = new Angle(k);
	const beta = positive ? theta.divide(2) : theta.divide(2).negative();
	// 2 alpha - beta = theta
	// alpha = (theta + beta)/2
	const alpha = theta.plus(beta).divide(2);
	const power = k.den === 3 ? n : 2 * n;
	// set up: question
	const num = new ComplexExp(1, alpha);
	const den = new ComplexExp(1, beta);
	const numString = num.arg.k.isLessThan(0)
		? `\\Bigl( \\cos \\left( ${num.arg.times(
				-1,
		  )} \\right) - \\mathrm{i} \\sin \\left( ${num.arg.times(-1)} \\right) \\Bigr)^2`
		: `\\Bigl( \\cos \\left( ${num.arg} \\right) + \\mathrm{i} \\sin \\left( ${num.arg} \\right) \\Bigr)^2`;
	const denString = den.arg.k.isLessThan(0)
		? `\\cos \\left( ${den.arg.times(-1)} \\right) - \\mathrm{i} \\sin \\left( ${den.arg.times(
				-1,
		  )} \\right)`
		: `\\cos \\left( ${den.arg} \\right) + \\mathrm{i} \\sin \\left( ${den.arg} \\right)`;
	const expShow = `(\\cos \\theta + \\mathrm{i} \\sin \\theta)(1 + \\cos \\theta - \\mathrm{i} \\sin \\theta)
		= 1 + \\cos \\theta + \\mathrm{i} \\sin \\theta.`;
	const exp = `(1+z)^${power} + (1+z^*)^${power}.`;

	// question
	const body = `<strong>Do not use a calculator in answering this question.</strong>
		<div class="top-margin">
			The complex number ${math('z')} is given by
			${display(`z = \\frac{\\textstyle ${numString}}{\\textstyle ${denString}}.`)}
		</div>
	`;
	const partA = `Find ${math(`|z|`)} and ${math(`\\arg(z).`)}
		<div class="top-margin">
			Hence find the value of ${math(`z^{${n}}`)}
		</div>
	`;
	const partI = `Show that ${display(expShow)}`;
	const partII = `Hence, or otherwise, find the value of ${display(exp)}`;

	// solution working
	const z = num.pow(2).divide(den);
	const zN = expToCartesian(z.pow(n));

	// answer
	const ansA = `${math(`|z|=1, \\;`)} ${math(`\\arg (z) = ${z.arg}.`)}
		<br>${math(`z^${n}=${zN}`)}`;
	const ansII = `${math(`0.`)}`;

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partA, marks: 3 },
			{
				parts: [
					{ body: partI, marks: 2 },
					{ body: partII, marks: 2 },
				],
			},
		],
	};
	const answer: AnswerObject = {
		parts: [{ body: ansA }, { parts: [{ body: ansII }] }],
	};

	return [question, answer];
}

function b(variables?: {
	a?: number;
	b?: Fraction;
	positive?: boolean;
}): [AnswerObject, AnswerObject] {
	const { a, positive } = {
		a: getRandomInt(1, 3) * (heads() ? 1 : -1),
		positive: heads(),
		...variables,
	};
	const den = getRandomInt(2, 3);
	const num = getRandomInt(1, den - 1) * (heads() ? 1 : -1);
	const b = variables?.b ?? new Fraction(num, den);
	// set up: variables
	const alpha = new Complex(a, b);
	const z3 = positive ? b.den * b.den : b.den * b.den * -1;
	// set up: question
	const quad = complexToQuadratic(alpha, { unknown: 'x' });
	const linear = new Polynomial([1, -z3]);
	const cubicFull = quad.times(linear);
	const [a2, a3] = cubicFull.coefficients.slice(2);
	const cubicQn = `${new Polynomial([a3, a2, 0, 0])} + ax + b = 0,`;

	// question
	const body = `One of the roots of the equation ${display(cubicQn)}
		where ${math('a')} and ${math('b')} are real, is
		${math(`${alpha}.`)} Find the other roots of the equations and the values of ${math(`a`)}
		and ${math('b.')}
	`;

	// solution working
	const aSolve = alpha
		.pow(3)
		.times(a3)
		.plus(alpha.pow(2).times(a2))
		.imag.divide(alpha.imag)
		.negative();
	const bSolve = alpha
		.pow(3)
		.times(a3)
		.plus(alpha.pow(2).times(a2))
		.plus(alpha.times(aSolve))
		.real.negative();
	const root3 = new Complex(bSolve, 0)
		.divide(a3)
		.divide(alpha)
		.divide(alpha.conjugate())
		.negative();

	// answer
	const ans = `${math(`a=${aSolve}, b=${bSolve}.`)}
		<br>Other roots of the equation 
		${math(`x=${alpha.conjugate()}, `)}
		${math(`x=${root3}.`)}
	`;

	const question: AnswerObject = {
		body,
		marks: 5,
	};
	const answer: AnswerObject = {
		body: ans,
	};

	return [question, answer];
}

export const qnLogics = {
	a,
	b,
};
