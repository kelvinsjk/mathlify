import type { AnswerObject, QuestionVariables } from '$lib/interfaces';
import { getRandomInt, heads, Complex } from 'mathlify';
import {
	math,
	//display
} from 'mathlifier';

function a(variables?: {
	n?: number;
	variant?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const { variant } = {
		variant: getRandomInt(1, 2),
		...variables,
	};
	const n = variables?.n ?? (variant === 1 ? getRandomInt(2, 4) : getRandomInt(5, 9));
	const body = `Simplify ${math(`\\mathrm{i}^${n}.`)}`;

	// answer
	const iN = Complex.I.pow(n);
	const ans = math(`${iN}.`);

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		variant,
		answers: [{ type: 'complex', value: iN, name: 'Your answer: ' }],
	};

	return [question, answer, qnVariables];
}

function b(variables?: {
	x1?: number;
	x2?: number;
	y1?: number;
	y2?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const { x1, x2, y1, y2 } = {
		x1: getRandomInt(-5, 5),
		y1: getRandomInt(1, 5) * (heads() ? -1 : 1),
		x2: getRandomInt(1, 5) * (heads() ? -1 : 1),
		y2: getRandomInt(1, 5) * (heads() ? -1 : 1),
		...variables,
	};
	const w = new Complex(x1, y1);
	const wString = w.isPurelyImaginary() ? `${w.toString()}` : `(${w})`;
	const z = new Complex(x2, y2);
	const body = `Evaluate ${math(`${wString}(${z}).`)}`;

	// answer
	const wz = w.times(z);
	const ans = math(`${wz}.`);

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		answers: [{ type: 'complex', value: wz, name: 'Your answer: ' }],
	};

	return [question, answer, qnVariables];
}

function c(variables?: {
	x1?: number;
	x2?: number;
	y1?: number;
	y2?: number;
	variant?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const variant = variables?.variant ?? getRandomInt(1, 2);
	const { x1, y1, x2, y2 } = {
		x1: variant === 1 ? getRandomInt(-5, 5) : getRandomInt(1, 5) * (heads() ? -1 : 1),
		y1: variant === 1 ? getRandomInt(-5, 5) : getRandomInt(1, 5) * (heads() ? -1 : 1),
		x2: variant === 1 ? getRandomInt(1, 5) * (heads() ? -1 : 1) : 0,
		y2: variant === 1 ? getRandomInt(1, 5) * (heads() ? -1 : 1) : getRandomInt(1, 5),
		...variables,
	};
	if (x1 === 0 && y1 === 0) {
		return c();
	}
	const w = new Complex(x1, y1);
	const z = new Complex(x2, y2);
	const body = `Evaluate ${math(`\\displaystyle \\frac{${w}}{${z}}.`)}`;

	// answer
	const wOverZ = w.divide(z);
	const ans = math(`${wOverZ}.`);

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		variant,
		answers: [{ type: 'complex', value: wOverZ, name: 'Your answer: ' }],
	};

	return [question, answer, qnVariables];
}

function d(variables?: {
	x?: number;
	y?: number;
	n?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const { x, y, n } = {
		x: getRandomInt(1, 3) * (heads() ? -1 : 1),
		y: getRandomInt(1, 3) * (heads() ? -1 : 1),
		n: getRandomInt(2, 4),
		...variables,
	};
	const w = new Complex(x, y);
	const wN = w.pow(n);

	const body = `Evaluate ${math(`(${w})^${n}.`)}`;
	const ans = `${math(`${wN}.`)}`;

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		answers: [{ type: 'complex', value: wN, name: 'Your answer: ' }],
	};

	return [question, answer, qnVariables];
}

export const qnLogics = {
	a,
	b,
	c,
	d,
};
