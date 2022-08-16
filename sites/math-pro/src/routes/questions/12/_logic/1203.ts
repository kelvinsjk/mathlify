import type { AnswerObject, QuestionVariables } from '$lib/interfaces';
import {
	getRandomInt,
	heads,
	Fraction,
	uVector,
	type Expression,
	uVectorExpression,
} from 'mathlify';
import { math, display } from 'mathlifier';

function a(variables?: {
	a?: number;
	variant?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	// set up
	const { a, variant } = {
		a: getRandomInt(1, 9),
		variant: getRandomInt(1, 2),
		...variables,
	};

	// question
	const dot = variant === 1 ? `\\mathbf{a}\\cdot\\mathbf{a}` : `|\\mathbf{a}\\times\\mathbf{a}|`;
	const body = `Given that ${math(`|\\mathbf{a}|=${a},`)} what is the value of
    ${math(`${dot}?`)}
  `;

	// answer
	const ansVal = variant === 1 ? a ** 2 : 0;
	const ans = math(`${dot} = ${ansVal}.`);

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};

	const qnVariables: QuestionVariables = {
		variant,
		answers: [{ type: 'integer', value: new Fraction(ansVal), name: 'Your answer: ' }],
	};

	return [question, answer, qnVariables];
}

function b(variables?: {
	a?: number;
	angle1?: boolean;
	variant?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	// set up
	const { a, variant, angle1 } = {
		a: getRandomInt(2, 9),
		angle1: heads(),
		variant: getRandomInt(1, 2),
		...variables,
	};
	// question
	const angle =
		variant === 1 ? (angle1 ? '60^\\circ' : '120^\\circ') : angle1 ? '30^\\circ' : '90^\\circ';
	const dot = variant === 1 ? `\\mathbf{a}\\cdot\\mathbf{b}` : `|\\mathbf{a}\\times\\mathbf{b}|`;
	const body = `Given that ${math(`|\\mathbf{a}|=${a},`)} 
		${math(`\\mathbf{b}`)} is a unit vector, and the angle between the the vectors is ${math(
		`${angle},`,
	)}
		what is the value of
    ${math(`${dot}?`)}
  `;

	// answer
	const ansVal =
		variant === 1
			? angle1
				? new Fraction(a, 2)
				: new Fraction(-a, 2)
			: angle1
			? new Fraction(a, 2)
			: new Fraction(a);
	const ans = math(`${dot} = ${ansVal}.`);

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		variant,
		answers: [{ type: 'fraction', value: ansVal, name: 'Your answer: ' }],
	};

	return [question, answer, qnVariables];
}

function c(variables?: {
	a?: number;
	l1?: number;
	m1?: number;
	l2?: number;
	m2?: number;
	angle1?: boolean;
	variant?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	// set up
	const { a, l1, l2, m1, m2, variant, angle1 } = {
		a: getRandomInt(2, 5),
		l1: getRandomInt(1, 5),
		l2: getRandomInt(1, 5),
		m1: getRandomInt(-5, 5, { avoid: [0] }),
		m2: getRandomInt(-5, 5),
		angle1: heads(),
		variant: getRandomInt(1, 2),
		...variables,
	};
	// question
	const angle =
		variant === 1 ? (angle1 ? '60^\\circ' : '120^\\circ') : angle1 ? '30^\\circ' : '90^\\circ';
	const v1 = new uVector('a', l1).plus(new uVector('b', m1));
	const v2 = new uVector('a', l2).plus(new uVector('b', m2));
	const dot = variant === 1 ? `(${v1})\\cdot(${v2})` : `\\Big|(${v1})\\times(${v2})\\Big|`;
	const body = `Given that ${math(`|\\mathbf{a}|=${a},`)} 
		${math(`\\mathbf{b}`)} is a unit vector, and the angle between the the vectors is ${math(
		`${angle},`,
	)}
		what is the value of
    ${display(`${dot}?`)}
  `;

	// answer
	const product = variant === 1 ? v1.dot(v2) : v1.cross(v2);
	let ansVal = Fraction.ZERO;
	console.log(product);
	if (variant === 1) {
		(<Expression>product).terms.forEach((t) => {
			if (t.variable === '\\left| \\mathbf{a} \\right|^2') {
				ansVal = ansVal.plus(t.coeff.times(a ** 2));
			} else if (t.variable === '\\left| \\mathbf{b} \\right|^2') {
				ansVal = ansVal.plus(t.coeff);
			} else if (t.variable === '\\mathbf{a} \\cdot \\mathbf{b}') {
				const coeff = angle1 ? t.coeff.times(a).divide(2) : t.coeff.times(a).divide(-2);
				ansVal = ansVal.plus(coeff);
			}
		});
	} else {
		(<uVectorExpression>product).vectors.forEach((t) => {
			if (t.variable === '\\mathbf{a} \\times \\mathbf{b}') {
				const coeff = angle1 ? t.coeff.abs().times(a).divide(2) : t.coeff.abs().times(a);
				ansVal = ansVal.plus(coeff);
			}
		});
	}
	const ans = math(`${ansVal}.`);

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		variant,
		answers: [{ type: 'fraction', value: ansVal, name: 'Your answer: ' }],
	};

	return [question, answer, qnVariables];
}

function d(variables?: {
	l?: number;
	m?: number;
	pos1?: boolean;
	pos2?: boolean;
	plus?: boolean;
	swap?: boolean;
	variant?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	// set up
	const { l, m, pos1, pos2, plus, swap, variant } = {
		l: getRandomInt(1, 5),
		m: getRandomInt(1, 5),
		pos1: heads(),
		pos2: heads(),
		plus: heads(),
		swap: heads(),
		variant: getRandomInt(1, 2),
		...variables,
	};
	// question
	const a1 = pos1 ? new uVector('a') : new uVector('a', l);
	const b1 = pos1 ? new uVector('b', l) : new uVector('b');
	const a2 = pos2 ? new uVector('a') : new uVector('a', m);
	const b2 = pos2 ? new uVector('c', m) : new uVector('c');
	const sign = plus ? '+' : '-';
	const dot = variant === 1 ? `\\cdot` : `\\times`;
	const v1 = `${a1} ${dot} ${b1}`;
	const v2 = swap ? `${b2} ${dot} ${a2}` : `${a2} ${dot} ${b2}`;
	const dot1 = `${v1} ${sign} ${v2}`;
	const dot2 = `\\mathbf{a} ${dot} ( p \\mathbf{b} + q\\mathbf{c} )`;
	const body = ` The expression
    ${display(`${dot1}`)}
		can be rewritten in the form
    ${display(`${dot2}.`)}
		Find the values of ${math('p')} and ${math('q.')}
  `;

	// answer
	let mAns: number;
	if (variant === 1 || (variant === 2 && !swap)) {
		mAns = plus ? m : -m;
	} else {
		mAns = plus ? -m : m;
	}
	const ans = math(`p=${l}, q=${mAns}`);

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		variant,
		answers: [
			{ type: 'integer', value: new Fraction(l), name: math(`p= `) },
			{ type: 'integer', value: new Fraction(mAns), name: math(`q= `) },
		],
	};

	return [question, answer, qnVariables];
}

export const qnLogics = {
	a,
	b,
	c,
	d,
};
