import type { AnswerObject, QuestionVariables } from '$lib/interfaces';
import { getRandomInt, AP, unsimplifiedExp, Term, sample, solveQuadratic } from 'mathlify';
import { math, display } from 'mathlifier';

function a(variables?: {
	a?: number;
	d?: number;
	n?: number;
	variant?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const { a, d, n, variant } = {
		a: getRandomInt(-9, 9),
		d: getRandomInt(-5, 5, { avoid: [0] }),
		n: getRandomInt(9, 20),
		variant: getRandomInt(1, 2),
		...variables,
	};
	const ap = new AP(a, d);
	const u2 = ap.u(2);
	const u3 = ap.u(3);
	const sequence = variant === 1 ? 'sequence' : 'series';
	const terms =
		variant === 1
			? `${a}, ${u2}, ${u3}, \\ldots`
			: unsimplifiedExp(a, u2, u3, u3.isLessThan(0) ? new Term(-1, '\\ldots') : '\\ldots');
	const nthTerm =
		variant === 1
			? `value of the ${math(`${n}\\textrm{th}`)} term`
			: `sum of the first ${math(`${n}`)} terms`;

	// question
	const body = `Consider the arithmetic ${sequence}
		${display(`${terms}`)}
		Find the ${nthTerm} of the ${sequence}.
	`;

	// answer
	const uN = variant === 1 ? ap.u(n) : ap.S(n);
	const ans = `${math(`${variant === 1 ? 'u' : 'S'}_{${n}} = ${uN}.`)}`;

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		variant,
		answers: [
			{ type: 'integer', value: uN, name: variant === 1 ? math(`u_{${n}}=`) : math(`S_{${n}}=`) },
		],
	};

	return [question, answer, qnVariables];
}

function b(variables?: {
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
	const u2 = ap.u(2);
	const u3 = ap.u(3);
	const uN = ap.u(n);
	const terms = unsimplifiedExp(
		a,
		u2,
		u3,
		u3.isAtLeast(0) ? '\\ldots' : new Term(-1, '\\ldots'),
		uN,
	);

	// question
	const body = `Find the sum of the following arithmetic series:
		${display(`${terms}.`)}
	`;

	// answer
	const Sn = ap.S(n);
	const ans = `${math(`S_{${n}} = ${Sn}.`)}`;

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		answers: [{ type: 'integer', value: Sn, name: math(`S_{n}=`) }],
	};

	return [question, answer, qnVariables];
}

function c(variables?: {
	a?: number;
	d?: number;
	k?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const { a, d } = {
		a: getRandomInt(-9, 9),
		d: getRandomInt(1, 5, { avoid: [0] }),
		...variables,
	};
	const ks = [100, 500, 1000];
	const ap = new AP(a, d);
	const s10 = ap.S(10),
		s100 = ap.S(100);
	const k =
		variables?.k ??
		sample(
			ks.filter((x) => {
				return x > s10.valueOf() && x < s100.valueOf();
			}),
		);
	const u2 = ap.u(2);
	const u3 = ap.u(3);
	const sequence = 'series';
	const terms = unsimplifiedExp(a, u2, u3, u3.isLessThan(0) ? new Term(-1, '\\ldots') : '\\ldots');

	// question
	const body = `Consider the arithmetic ${sequence}
		${display(`${terms}`)}
		Find the least value of ${math(`n`)} for which the sum of the first
		${math(`n`)} terms of the series exceeds ${math(`${k}.`)}
	`;

	// answer
	const quadratic = ap.sNPoly().minus(k);
	const n = Math.ceil(solveQuadratic(quadratic)[1].valueOf());
	const ans = `Least ${math(`n = ${n}.`)}`;

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		answers: [{ type: 'integer', value: n, name: 'Least ' + math(`n=`) }],
	};

	return [question, answer, qnVariables];
}

export const qnLogics = {
	a,
	b,
	c,
};
