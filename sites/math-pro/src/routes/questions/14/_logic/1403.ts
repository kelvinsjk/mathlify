import type { AnswerObject, QuestionVariables } from '$lib/interfaces';
import { getRandomInt, heads, Complex, Expression, Polynomial, complexToQuadratic } from 'mathlify';
import { math, display } from 'mathlifier';

function a(variables?: {
	x?: number;
	y?: number;
	z3?: number;
	variant?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const { variant, x, y, z3 } = {
		variant: getRandomInt(1, 2), // 1: find z2 and z3, 2: find C and D in z^3 + Bz^2 + Cz + D
		x: getRandomInt(1, 4) * (heads() ? -1 : 1),
		y: getRandomInt(1, 4) * (heads() ? -1 : 1),
		z3: getRandomInt(1, 3) * (heads() ? -1 : 1),
		...variables,
	};
	const z1 = new Complex(x, y);
	const quad = complexToQuadratic(z1);
	const linear = new Polynomial([1, -z3], { unknown: 'z' });
	const cubic = quad.times(linear);
	const [D, C, B, A] = cubic.coefficients;
	const unknownCubicStart = new Polynomial([A, B, 0, 0], { unknown: 'z' });
	const cubicUnknown = new Expression(...unknownCubicStart.terms, 'Cz+D');

	const eqn = variant === 1 ? `${cubic}.` : `${cubicUnknown}.`;
	let body = `It is given that ${math(`z_1 = ${z1}`)} is a root of the equation ${display(eqn)}`;
	if (variant === 1) {
		body += `The equation has two other roots, ${math('z_2')} and ${math(`z_3,`)}
			where ${math(`z_2`)} is complex and ${math(`z_3`)} is real. Find ${math(`z_3.`)}`;
	} else {
		body += `Find the values of the real constants ${math(`C`)} and ${math('D.')}`;
	}

	// answer
	const ans = variant === 1 ? math(`z_3 = ${z3}.`) : math(`C = ${C}, D = ${D}.`);

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		variant,
		answers:
			variant === 1
				? [{ type: 'fraction', value: z3, name: math(`z_3 = `) }]
				: [
						{ type: 'fraction', value: C, name: math(`C = `) },
						{ type: 'fraction', value: D, name: math(`D = `) },
				  ],
	};

	return [question, answer, qnVariables];
}

function b(variables?: {
	variant?: number;
	x1?: number;
	y1?: number;
	x2?: number;
	y2?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const { variant } = {
		variant: getRandomInt(1, 2), // 1: (z-alpha)(z-beta), 2: alpha^* beta* (z-alpha)(z-beta)
		...variables,
	};
	let x1: number, y1: number, x2: number, y2: number;
	let alpha: Complex, beta: Complex;
	let eqn: string;
	if (variant === 1) {
		x1 = getRandomInt(1, 4) * (heads() ? -1 : 1);
		y1 = getRandomInt(1, 4) * (heads() ? -1 : 1);
		x2 = getRandomInt(1, 5) * (heads() ? -1 : 1);
		y2 = getRandomInt(1, 5) * (heads() ? -1 : 1);
		alpha = new Complex(x1, y1);
		beta = new Complex(x2, y2);
		while (alpha.isEqualTo(beta) || alpha.times(beta).isReal() || alpha.plus(beta).isReal()) {
			x2 = getRandomInt(1, 5) * (heads() ? -1 : 1);
			y2 = getRandomInt(1, 5) * (heads() ? -1 : 1);
			beta = new Complex(x2, y2);
		}
		const sum = alpha.plus(beta).negative();
		const product = alpha.times(beta);
		eqn = `z^2 + (${sum})z + (${product}),`;
	} else {
		x1 = getRandomInt(1, 2) * (heads() ? -1 : 1);
		y1 = getRandomInt(1, 2) * (heads() ? -1 : 1);
		x2 = getRandomInt(1, 2) * (heads() ? -1 : 1);
		y2 = getRandomInt(1, 2) * (heads() ? -1 : 1);
		alpha = new Complex(x1, y1);
		beta = new Complex(x2, y2);
		while (alpha.isEqualTo(beta) || alpha.times(beta).isReal() || alpha.plus(beta).isReal()) {
			x2 = getRandomInt(1, 2) * (heads() ? -1 : 1);
			y2 = getRandomInt(1, 2) * (heads() ? -1 : 1);
			beta = new Complex(x2, y2);
		}
		const gamma = alpha.times(beta).conjugate();
		const sum = alpha.plus(beta).negative().times(gamma);
		const product = alpha.times(beta).times(gamma).real;
		const exp = new Expression(`(${gamma})z^2 + (${sum})z`, product);
		eqn = `${exp},`;
	}
	const body = `Given that ${math(`${alpha}`)} is a root of the equation
		${display(`${eqn}`)}
		find the second root of the equation.`;

	// answer
	const ans = math(`${beta}.`);

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		variant,
		answers: [{ type: 'complex', value: beta, name: `Your answer: ` }],
	};

	return [question, answer, qnVariables];
}

export const qnLogics = {
	a,
	b,
};
