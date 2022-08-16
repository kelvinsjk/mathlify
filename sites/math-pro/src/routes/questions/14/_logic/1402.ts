import type { AnswerObject, QuestionVariables } from '$lib/interfaces';
import {
	getRandomInt,
	heads,
	Complex,
	Expression,
	Imaginary,
	Term,
	factorPairs,
	Polynomial,
	solveQuadraticComplex,
	shuffle,
} from 'mathlify';
import { math, display } from 'mathlifier';

function a(variables?: {
	n?: number;
	x1?: number;
	y1?: number;
	x2?: number;
	y2?: number;
	x3?: number;
	y3?: number;
	variant?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const { variant, x1, x2, x3, y1, y2, y3 } = {
		variant: getRandomInt(1, 2),
		x1: getRandomInt(1, 5) * (heads() ? -1 : 1),
		y1: getRandomInt(1, 5) * (heads() ? -1 : 1),
		x2: getRandomInt(1, 5) * (heads() ? -1 : 1),
		y2: getRandomInt(1, 5) * (heads() ? -1 : 1),
		x3: getRandomInt(1, 5) * (heads() ? -1 : 1),
		y3: getRandomInt(1, 5) * (heads() ? -1 : 1),
		...variables,
	};
	const alpha = new Complex(x1, y1);
	const beta = variant === 1 ? new Complex(x2, y2) : new Complex(0);
	const gamma = new Complex(x3, y3);
	let eqn: string;
	if (variant === 1) {
		const lhs = new Expression(`(${alpha})z`, x2, new Imaginary(y2));
		eqn = `${lhs} = ${gamma}.`;
	} else {
		const lhs = new Expression(new Term(x1, 'z'), -x3, new Term(y1, 'i', 'z'), new Term(-y3, 'i'));
		eqn = `${lhs} = 0.`;
	}
	const body = `Solve the equation ${display(`${eqn}`)}`;

	// answer
	const z = gamma.minus(beta).divide(alpha);
	const ans = math(`${z}.`);

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		variant,
		answers: [{ type: 'complex', value: z, name: math(`z = `) }],
	};

	return [question, answer, qnVariables];
}

function b(variables?: {
	a?: number;
	b?: number;
	c?: number;
	k?: number;
	zVar?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const { b, k, zVar } = {
		b: getRandomInt(1, 3) * (heads() ? -2 : 2),
		k: getRandomInt(1, 4) * 2,
		zVar: getRandomInt(1, 2),
		...variables,
	};
	const ac = b * b + (k * k) / 4;
	const factors = factorPairs(ac).filter((pair) => pair[0] % 2 !== 0 || pair[1] % 2 !== 0); // guaranteed to be non-empty because of the factor pair [1, ac]
	let { a, c } = variables;
	if (a === undefined || c === undefined) {
		const factor = shuffle(factors[getRandomInt(0, factors.length - 1)]);
		if (b > 0 && heads()) {
			a = -factor[0];
			c = -factor[1];
		} else {
			a = factor[0];
			c = factor[1];
		}
	}
	const poly = new Polynomial([a, b, c], { unknown: 'z' });

	const body = `The roots of the equation
		${display(`${poly}=0`)}
		are ${math(`z_1`)} and ${math(`z_2,`)}
		where ${math(`\\textrm{Im}(z_1) < 0.`)}
		Find ${math(`z_${zVar}`)}.`;

	// answer
	const [z1, z2] = solveQuadraticComplex(poly) as [Complex, Complex]; // assertion: no irrational roots
	const ans = math(`z_${zVar} = ${zVar === 1 ? z1 : z2}.`);

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		answers: [{ type: 'complex', value: zVar === 1 ? z1 : z2, name: math(`z_${zVar} = `) }],
	};

	return [question, answer, qnVariables];
}

function c(variables?: {
	x?: number;
	y?: number;
	k?: number;
	variant?: number;
	positive?: boolean;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const variant = variables?.variant ?? getRandomInt(1, 2);
	const x = variables?.x ?? getRandomInt(1, 5) * (heads() ? -1 : 1);
	const { y, k, positive } = {
		y: getRandomInt(1, 5) * (heads() ? -1 : 1),
		k: variant === 1 ? -2 * x : getRandomInt(-9, 9, { avoid: [0, -1] }),
		positive: heads(),
		...variables,
	};
	const z = new Complex(x, y);
	const alpha =
		variant === 1
			? z.times(k).plus(z.times(z.conjugate()))
			: positive
			? z.times(k).plus(z).plus(z.conjugate())
			: z.times(k).plus(z).minus(z.conjugate());
	const eqn =
		variant === 1
			? `${new Expression(new Term(k, 'z'), 'zz^*')} = ${alpha}.`
			: positive
			? `${new Expression(new Term(k + 1, 'z'), 'z^*')} = ${alpha}.`
			: `${new Expression(new Term(k + 1, 'z'), new Term(-1, 'z^*'))} = ${alpha}.`;

	const body = `Find the solution ${math('z')} of the equation
		${display(`${eqn}`)}`;

	// answer
	const ans = math(`z=${z}.`);

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		variant,
		answers: [{ type: 'complex', value: z, name: math(`z = `) }],
	};

	return [question, answer, qnVariables];
}

function d(variables?: {
	x?: number;
	y?: number;
	real?: boolean;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const { x, real } = {
		x: getRandomInt(1, 9) * (heads() ? -1 : 1),
		real: heads(),
		...variables,
	};
	const y = variables?.y ?? getRandomInt(-9, 9, { avoid: [0, x] });

	const poly1 = new Polynomial([1, x], { unknown: 'a' });
	const poly2 = new Polynomial([1, y], { unknown: 'a' });
	const z = `(${poly1}) + (${poly2})\\mathrm{i}`;

	const body = `The complex number
		${display(`z=${z},`)}
		where ${math(`a \\in \\mathbb{R},`)}
		is ${real ? 'real' : 'purely imaginary'}. Find
		${math(`z.`)}
		`;
	const ansValue = real ? new Complex(x - y) : new Complex(0, y - x);
	const ans = real ? `${math(`z = ${ansValue}.`)}` : `${math(`z = ${ansValue}.`)}`;

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		answers: [{ type: 'complex', value: ansValue, name: math(`z = `) }],
	};

	return [question, answer, qnVariables];
}

export const qnLogics = {
	a,
	b,
	c,
	d,
};
