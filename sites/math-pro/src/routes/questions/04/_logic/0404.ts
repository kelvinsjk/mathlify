import type { AnswerObject, QuestionVariables } from '$lib/interfaces';
import { getRandomInt, Fraction, AP, GP, getRandomFrac } from 'mathlify';
import {
	math,
	//display
} from 'mathlifier';

function a(variables?: {
	a?: number;
	d?: number;
	n?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const { a, d, n } = {
		a: getRandomInt(-9, 9),
		d: getRandomInt(-5, 5, { avoid: [0] }),
		n: getRandomInt(9, 20),
		...variables,
	};
	const ap = new AP(a, d);
	const uNPoly = ap.uNPoly();
	if (d < 0 && a - d > 0) {
		uNPoly.changeAscending();
	}

	// question
	const body = `Evaluate
		${math(`\\displaystyle \\sum_{r=1}^{${n}} \\left( ${uNPoly.replaceXWith('r')} \\right).`)}
	`;

	// answer
	const sN = ap.S(n);
	const ans = `${math(
		`\\displaystyle \\sum_{r=1}^{${n}} \\left( ${uNPoly.replaceXWith('r')} \\right) = ${sN}.`,
	)}`;

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		answers: [{ type: 'integer', value: sN, name: 'Your answer:' }],
	};

	return [question, answer, qnVariables];
}

function b(variables?: {
	r?: Fraction;
	n?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const { r, n } = {
		r: getRandomFrac({ numRange: [1, 3], denRange: [1, 3], avoid: [0, 1, -1] }),
		n: getRandomInt(5, 6),
		...variables,
	};

	const gp = new GP(r, r);
	const rString = r.den === 1 ? `${r}^n` : `\\left( ${r} \\right)^r`;

	// question
	const body = `Evaluate ${math(`\\displaystyle \\sum_{r=1}^{${n}} ${rString}.`)}
	`;

	// answer
	const sN = gp.S(n);
	const ans = `${math(`\\displaystyle \\sum_{r=1}^{${n}} ${rString} = ${sN}.`)}`;

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		answers: [{ type: 'fraction', value: sN, name: 'Your answer: ' }],
	};

	return [question, answer, qnVariables];
}

function c(variables?: { r?: Fraction }): [AnswerObject, AnswerObject, QuestionVariables] {
	const { rDen } = {
		rDen: getRandomInt(2, 9),
	};
	const rNum = getRandomInt(-(rDen - 1), rDen - 1, { avoid: [0] });
	const r = variables?.r ?? new Fraction(rNum, rDen);

	const gp = new GP(r, r);
	const rString = r.den === 1 && r.num > 0 ? `${r}^n` : `\\left( ${r} \\right)^r`;

	// question
	const body = `Evaluate ${math(`\\displaystyle \\sum_{r=1}^{\\infty} ${rString}.`)}
	`;

	// answer
	const sN = gp.SInfty();
	const ans = `${math(`\\displaystyle \\sum_{r=1}^{\\infty} ${rString} = ${sN}.`)}`;

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		answers: [{ type: 'fraction', value: sN, name: 'Your answer: ' }],
	};

	return [question, answer, qnVariables];
}

export const qnLogics = {
	a,
	b,
	c,
};
