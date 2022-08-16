import type { AnswerObject, QuestionVariables } from '$lib/interfaces';
import {
	getRandomInt,
	heads,
	Fraction,
	GP,
	getRandomFrac,
	unsimplifiedExp,
	Term,
	bisection,
} from 'mathlify';
import { math, display } from 'mathlifier';

function a(variables?: {
	a?: number;
	r?: Fraction;
	variant?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const { a, r, variant } = {
		a: getRandomInt(-3, 3, { avoid: [0] }),
		r: getRandomFrac({ numRange: [-3, 3], denRange: [1, 3], avoid: [0, 1, -1] }),
		variant: getRandomInt(1, 2),
		...variables,
	};

	const gp = new GP(a, r);
	const n1 = 7;
	const n2 = 6;
	const u2 = gp.u(2);
	const u3 = gp.u(3);
	const sequence = variant === 1 ? 'sequence' : 'series';
	const terms =
		variant === 1
			? `${a}, ${u2}, ${u3}, \\ldots`
			: unsimplifiedExp(
					a,
					u2,
					u3,
					(u3.isLessThan(0) && r.isGreaterThan(0)) || (u3.isGreaterThan(0) && r.isLessThan(0))
						? new Term(-1, '\\ldots')
						: '\\ldots',
			  );
	const nthTerm =
		variant === 1
			? `exact value of the ${math(`${n1}\\textrm{th}`)} term`
			: `exact sum of the first ${math(`${n2}`)} terms`;

	// question
	const body = `Consider the geometric ${sequence}
		${display(`${terms}`)}
		Find the ${nthTerm} of the ${sequence}.
	`;

	// answer
	const uN = variant === 1 ? gp.u(n1) : gp.S(n2);
	const ans = `${math(`${variant === 1 ? `u_{${n1}}` : `S_{${n2}}`} = ${uN}.`)}`;

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		variant,
		answers: [
			{ type: 'integer', value: uN, name: variant === 1 ? math(`u_{${n1}}=`) : math(`S_{${n2}}=`) },
		],
	};

	return [question, answer, qnVariables];
}

function b(variables?: {
	a?: number;
	r?: Fraction;
	convergentWording?: boolean;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const { a, r, convergentWording } = {
		a: getRandomInt(-9, 9),
		r: getRandomFrac({ avoid: [0] }),
		convergentWording: heads(),
		...variables,
	};
	const isItConvergent = convergentWording
		? `Is the series convergent?`
		: 'Does the sum to infinity exist for the series?';
	const gp = new GP(a, r);
	const u2 = gp.u(2);
	const u3 = gp.u(3);
	const terms = unsimplifiedExp(
		a,
		u2,
		u3,
		(u3.isLessThan(0) && r.isGreaterThan(0)) || (u3.isGreaterThan(0) && r.isLessThan(0))
			? new Term(-1, '\\ldots')
			: '\\ldots',
	);

	const body = `Consider the following geometric series:
		${display(`${terms}`)}
		${isItConvergent}
		`;

	// answer
	const options = ['Yes', 'No'];
	const value = r.abs().isLessThan(1) ? 0 : 1;
	let ans: string;
	if (convergentWording) {
		ans =
			value === 0
				? `Yes, the series is convergent since ${math(
						heads() ? `|r|=${r.abs()}<1.` : `-1<r=${r}<1.`,
				  )}`
				: `No, the series is not convergent since ${math(`|r|=${r.abs()} \\not < 1.`)}`;
	} else {
		ans =
			value === 0
				? `Yes, the sum to infinity exists since ${math(
						heads() ? `|r|=${r.abs()}<1.` : `-1<r=${r}<1.`,
				  )}`
				: `No, the sum to infinity does not exist since ${math(`|r|=${r.abs()} \\not < 1.`)}`;
	}
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

function c(variables?: {
	a?: number;
	r?: Fraction;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const { rDen, a } = {
		a: getRandomInt(-9, 9, { avoid: [0] }),
		rDen: getRandomInt(2, 9),
		...variables,
	};
	const rNum = getRandomInt(-(rDen - 1), rDen - 1, { avoid: [0] });
	const r = variables?.r ?? new Fraction(rNum, rDen);

	const gp = new GP(a, r);
	const u1 = gp.u(1);
	const u2 = gp.u(2);
	const u3 = gp.u(3);

	const terms = unsimplifiedExp(
		u1,
		u2,
		u3,
		(u3.isLessThan(0) && r.isGreaterThan(0)) || (u3.isGreaterThan(0) && r.isLessThan(0))
			? new Term(-1, '\\ldots')
			: '\\ldots',
	);

	// question
	const body = `Consider the infinite geometric series
		${display(`${terms}`)}
		Find the sum to infinity.
	`;

	// answer
	const sN = gp.SInfty();
	const ans = `${math(`S_\\infty = ${sN}.`)}`;

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		answers: [{ type: 'fraction', value: sN, name: math(`S_\\infty = `) }],
	};

	return [question, answer, qnVariables];
}

function d(variables?: {
	kPercent?: number;
	rPercent?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const { rPercent } = {
		rPercent: getRandomInt(80, 99),
		...variables,
	};
	const kPercent =
		variables?.kPercent ??
		getRandomInt(
			Math.floor(Math.pow(rPercent / 100, 20) * 100),
			Math.floor(Math.pow(rPercent / 100, 10) * 100),
		);

	// question
	const body = `A geometric series has positive first term ${math(`a`)} and
		common ratio ${math(`${rPercent / 100}.`)} Find the least value of ${math('n')}
		such that the sum of the first ${math('n')} terms of the series, ${math('S_n,')}
		is within ${math(`${kPercent}\\%`)} of the sum to infinity.
	`;

	// answer
	const gp = new GP(1, new Fraction(rPercent, 100));
	const eqn = (x: number) => {
		const sInfty = gp.SInfty().valueOf();
		const sN = (1 - Math.pow(rPercent / 100, x)) / (1 - rPercent / 100);
		return sInfty - sN - (kPercent / 100) * sInfty;
	};
	const n = Math.ceil(bisection(eqn, 1, 100));
	const ans = `Least ${math(`n = ${n}.`)}`;

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		answers: [{ type: 'integer', value: n, name: `Least ` + math(`n = `) }],
	};

	return [question, answer, qnVariables];
}

export const qnLogics = {
	a,
	b,
	c,
	d,
};
