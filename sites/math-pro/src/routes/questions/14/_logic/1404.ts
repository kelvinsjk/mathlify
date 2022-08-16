import type { AnswerObject, QuestionVariables } from '$lib/interfaces';
import {
	getRandomInt,
	heads,
	Fraction,
	getRandomAngle,
	ComplexExp,
	expToCartesian,
	cos,
	sin,
} from 'mathlify';
import { math, display } from 'mathlifier';

function a(variables?: {
	variant?: number;
	r?: number;
	theta?: Fraction;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const { variant, r } = {
		variant: getRandomInt(1, 2),
		r: getRandomInt(1, 5),
		...variables,
	};
	let theta = variables?.theta;
	const angles = [Fraction.ZERO, new Fraction(1, 2), Fraction.ONE, new Fraction(-1, 2)];
	if (theta === undefined) {
		theta = variant === 1 ? getRandomAngle() : angles[getRandomInt(0, angles.length - 1)];
	}
	const z = new ComplexExp(r, theta);
	const zCartesian = expToCartesian(z);

	const body = `The complex number ${math('z')} is given by
		${display(`z=${zCartesian}.`)}
		Find ${math('|z|')} and ${math('k,')} where
		${math('\\arg(z)=k\\pi')} and ${math(`-\\pi < \\arg(z) < \\pi.`)}`;

	// answer
	const ans = `${math(`|z|=${z.mod},`)}<br>${math(`\\arg(z)=${z.arg}.`)}`;

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		variant,
		answers: [
			{ type: 'sqrt', value: z.mod, name: math(`|z| = `) },
			{ type: 'fraction', value: z.arg.k, name: math(`k = `) },
		],
	};

	return [question, answer, qnVariables];
}

function b(variables?: {
	r?: number;
	theta?: Fraction;
	exp?: boolean;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const { r, theta, exp } = {
		r: getRandomInt(1, 5),
		theta: getRandomAngle({ allowReal: true, allowImag: true }),
		exp: heads(),
		...variables,
	};
	const z = new ComplexExp(r, theta);
	const zCartesian = expToCartesian(z);

	const body = `The complex number ${math('z')} is given by
		${display(`z=${exp ? `${z}` : `{\\textstyle ${z.toPolarString()}.}`}`)}
		Find ${math('z')} in cartesian form
		${math('x + \\mathrm{i}y,')} where ${math(`x, y \\in \\mathbb{R}.`)}`;

	// answer
	const ans = `${math(`z=${zCartesian}.`)}`;
	const x = cos(z.arg).times(r);
	const y = sin(z.arg).times(r);

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		answers: [
			{ type: 'sqrt', value: x, name: math(`x = `) },
			{ type: 'sqrt', value: y, name: math(`y = `) },
		],
	};

	return [question, answer, qnVariables];
}

function c(variables?: {
	n?: number;
	rBeta?: number;
	rGamma?: number;
	argAlpha?: Fraction;
	argBeta?: Fraction;
	argGamma?: Fraction;
	den?: number;
	flip?: boolean;
	exp?: boolean;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const { n, rBeta, rGamma, argAlpha, den, flip, exp } = {
		n: getRandomInt(2, 5),
		rBeta: getRandomInt(1, 3),
		rGamma: getRandomInt(1, 3),
		argAlpha: getRandomAngle(),
		den: getRandomInt(0, 2), // whether alpha, beta or gamma in denominator
		flip: heads(), // flip fraction to get alpha/(beta gamma);
		exp: heads(), // whether to use exponential form (vs polar)
		...variables,
	};
	const argBeta = getRandomAngle({ avoid: [argAlpha] });
	const argGamma = getRandomAngle({ avoid: [argAlpha, argBeta] });
	// alpha^n, r=2. beta^*, gamma.
	const alpha = new ComplexExp(2, argAlpha);
	const beta = new ComplexExp(rBeta, argBeta);
	const gamma = new ComplexExp(rGamma, argGamma);
	const symbols = [`\\alpha^${n}`, '\\beta^*', '\\gamma'];
	const numbers = [alpha.pow(n), beta.conjugate(), gamma];
	const denSymbol = symbols.splice(den, 1)[0];
	const denValue = numbers.splice(den, 1)[0];
	const numString = symbols.join(' ');
	const numValue = numbers.reduce((prev, curr) => prev.times(curr), new ComplexExp(1, 0));
	const fracString = flip
		? `\\frac{${denSymbol}}{${numString}}`
		: `\\frac{${numString}}{${denSymbol}}`;

	const body = `The complex number ${math('z')} is given by
		${display(`z=${fracString},`)}
		where
		${display(`\\begin{align*}
			\\alpha &= ${exp ? `${alpha}` : `{ \\textstyle ${alpha.toPolarString()}}`}, \\\\
			\\beta &= ${exp ? `${beta}` : `{ \\textstyle ${beta.toPolarString()}}`}, \\\\
			\\gamma &= ${exp ? `${gamma}` : `{ \\textstyle ${gamma.toPolarString()}}`}.
		\\end{align*}`)}
		Find ${math('|z|')} and ${math('k,')} where
		${math('\\arg(z)=k\\pi')} and ${math(`-\\pi < \\arg(z) < \\pi.`)}`;

	// answer
	const ansValue = flip ? denValue.divide(numValue) : numValue.divide(denValue);
	const ans = `${math(`|z|=${ansValue.mod},`)}<br>${math(`\\arg(z)=${ansValue.arg}.`)}`;

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		answers: [
			{ type: 'fraction', value: ansValue.mod.coeff, name: math(`|z| = `) },
			{ type: 'fraction', value: ansValue.arg.k, name: math(`k = `) },
		],
	};

	return [question, answer, qnVariables];
}

function d(variables?: {
	r?: number;
	realCase?: number;
	theta?: Fraction;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const { realCase, r } = {
		r: getRandomInt(1, 9),
		realCase: getRandomInt(1, 4), // 1: real, 2: real and positive, 3: real and negative, 4: purely imaginary
		...variables,
	};
	let theta = variables?.theta ?? getRandomAngle();
	if (realCase === 3) {
		// avoid even numerator
		while (theta.abs().num === 2) {
			theta = getRandomAngle();
		}
	} else if (realCase === 4) {
		// avoid denominator 3
		while (theta.den === 3) {
			theta = getRandomAngle();
		}
	}
	const z = new ComplexExp(r, theta);
	const realCaseStrings = ['real', 'real and positive', 'real and negative', 'purely imaginary'];

	const body = `The complex number ${math('z')} is given by
		${display(`z=${z}.`)}
		Find the smallest positive integer ${math('n')} such that ${math(`\\displaystyle z^n`)}
		is ${realCaseStrings[realCase - 1]}.`;

	// answer
	const ansValue =
		realCase === 1
			? theta.den
			: realCase === 2
			? theta.den * 2
			: realCase === 3
			? theta.den
			: theta.den / 2;
	const ans = `Smallest positive integer ${math(`n=${ansValue}.`)}`;

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		answers: [{ type: 'integer', value: ansValue, name: math(`n = `) }],
	};

	return [question, answer, qnVariables];
}

function e(variables?: {
	twoTheta?: boolean;
	addition?: boolean;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const { twoTheta, addition } = {
		twoTheta: heads(),
		addition: heads(),
		...variables,
	};
	const sign = addition ? '+' : '-';
	const iTheta = twoTheta ? '2 \\mathrm{i}\\theta' : '\\mathrm{i} \\theta';
	const halfTheta = '\\frac{\\theta}{2}';
	const theta = '\\theta';
	const expression = `1 ${sign} \\mathrm{e}^{${iTheta}}`;

	const body = `Which of the following is an equivalent to
		${display(`${expression}?`)}`;

	// answer
	const options = [
		math(`2 \\cos ${halfTheta} \\, \\mathrm{e}^{\\mathrm{i} ${halfTheta}}`),
		math(`2 \\sin ${halfTheta} \\, \\mathrm{e}^{\\mathrm{i} ${halfTheta}}`),
		math(`2 \\mathrm{i} \\cos ${halfTheta} \\, \\mathrm{e}^{\\mathrm{i} ${halfTheta}}`),
		math(`2 \\mathrm{i} \\sin ${halfTheta} \\, \\mathrm{e}^{\\mathrm{i} ${halfTheta}}`),
		math(`2 \\cos ${theta} \\, \\mathrm{e}^{\\mathrm{i} ${theta}}`),
		math(`2 \\sin ${theta} \\, \\mathrm{e}^{\\mathrm{i} ${theta}}`),
		math(`2 \\mathrm{i} \\cos ${theta} \\, \\mathrm{e}^{\\mathrm{i} ${theta}}`),
		math(`2 \\mathrm{i} \\sin ${theta} \\, \\mathrm{e}^{\\mathrm{i} ${theta}}`),
	];
	const value =
		addition && twoTheta ? 4 : addition && !twoTheta ? 0 : !addition && twoTheta ? 7 : 3;
	const ans = options[value];

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		answers: [{ type: 'mcq', value, options, name: '' }],
	};

	return [question, answer, qnVariables];
}

export const qnLogics = {
	a,
	b,
	c,
	d,
	e,
};
