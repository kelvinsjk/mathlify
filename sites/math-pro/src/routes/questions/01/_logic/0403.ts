import type { AnswerObject, QuestionVariables } from '$lib/interfaces';
import { getRandomInt, Fraction, AP, GP, getRandomFrac, Term, sample } from 'mathlify';
import { math, display } from 'mathlifier';

function a(variables?: {
	a?: number;
	r?: Fraction;
	d?: number;
	variant?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const { a, r, d, variant } = {
		a: getRandomInt(1, 9, { avoid: [0] }),
		d: getRandomInt(-4, 4, { avoid: [0] }) * 2,
		r: getRandomFrac({ numRange: [1, 3], denRange: [1, 3], avoid: [0, 1, -1] }),
		variant: getRandomInt(1, 2),
		...variables,
	};

	let body: string, ans: string;
	const ap = new AP(a, d);
	const gpU1 = r.isGreaterThan(1) ? r.minus(1) : Fraction.ONE.minus(r);
	const p = gpU1.divide(r);

	if (variant === 1) {
		// AP
		body = `The sum of the first ${math(`n`)} terms of a series is given by
			${display(`S_n = ${ap.sNPoly()}.`)}
			Find an expression, in terms of ${math(`n,`)} for the ${math(`n\\textrm{th}`)} term
			of the series, ${math(`u_n.`)}
		`;
		ans = `${math(`u_n = ${ap.uNPoly()}.`)}`;
	} else {
		// GP
		const rString = r.den === 1 ? `${r}` : `\\left( ${r} \\right)`;
		body = `The sum of the first ${math(`n`)} terms of a series is given by
			${display(`S_n = ${r.isGreaterThan(1) ? `${rString}^n - 1` : `1 - ${rString}^n`}.`)}
			An expression for the ${math(`n\\textrm{th}`)} term
			of the series, ${math(`u_n,`)} can be expressed in the form ${display(
			`\\displaystyle u_n = p q^n,`,
		)}
			where ${math(`p`)} and ${math('q')} are rational numbers. Find ${math(`p`)} and ${math('q.')}
		`;
		const rString2 = r.den === 1 && p.isEqualTo(1) ? `${r}` : `\\left( ${r} \\right)`;
		ans = `${math(`u_n = ${new Term(p, `${rString2}^n`)}.`)}`;
	}

	// question

	// answer
	const apUN = ap.uNPoly();

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
				? [{ type: 'polynomial', value: apUN, name: math(`u_n =`) }]
				: [
						{ type: 'fraction', value: p, name: math(`p=`) },
						{ type: 'fraction', value: r, name: math(`q=`) },
				  ],
	};

	return [question, answer, qnVariables];
}

function b(variables?: {
	a?: number;
	r?: Fraction;
	d?: number;
	variant?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const { a, r, d, variant } = {
		a: getRandomInt(-9, 9),
		r: getRandomFrac({ avoid: [0, 1, -1] }).abs(),
		d: getRandomInt(1, 9, { avoid: [0] }) * 2,
		variant: getRandomInt(1, 2),
		...variables,
	};
	const ap = new AP(a, d);
	const apSn = ap.sNPoly();
	const rString = r.den === 1 && r.num > 0 ? `${r}^n` : `\\left(${r}\\right)^n`;
	const gpSn = `1-${rString}`;
	const coeff = new Fraction(a).divide(Fraction.ONE.minus(r)).divide(r);
	const gpUn = new Term(coeff, coeff.abs().isEqualTo(1) ? `${r}^n` : `\\left(${r}\\right)^n`);

	const body = `A series is such that the sum of the first ${math(`n`)} terms of the series is
		given by ${display(`S_n = ${variant === 1 ? apSn : gpSn}.`)}
		How do we prove  that the series is ${variant === 1 ? 'arithmetic' : 'geometric'}?
	`;

	// answer
	const options = [
		`${math(`S_n - S_{n-1} = \\textrm{constant}`)}`,
		`${math(`u_n - u_{n-1} = \\textrm{constant}`)}`,
		`${math(`\\displaystyle \\frac{S_n}{S_{n-1}} = \\textrm{constant}`)}`,
		`${math(`\\displaystyle \\frac{u_n}{u_{n-1}} = \\textrm{constant}`)}`,
		`By observing the pattern for ${math(`S_1, S_2, S_3, \\ldots`)}`,
		`By observing the pattern for ${math(`u_1, u_2, u_3, \\ldots`)}`,
	];
	const value = variant === 1 ? 1 : 3;
	let ans: string;
	if (variant === 1) {
		ans = `${math(`u_n \\allowbreak = {S_n - S_{n-1}} \\allowbreak = ${ap.uNPoly()}.`)}
			<br>Since ${math(`u_n - u_{n-1} = ${d}`)} which is a constant, the series is arithmetic.
		`;
	} else {
		ans = `${math(`u_n \\allowbreak = {S_n - S_{n-1}} \\allowbreak = ${gpUn}.`)}
			<br>Since ${math(`\\frac{u_n}{u_{n-1}} = ${r}`)} which is a constant, the series is geometric.
		`;
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
	rPercent?: number;
	n?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const as = [10, 20, 50, 100, 200, 500];
	const { a, rPercent, n } = {
		a: sample(as),
		rPercent: getRandomInt(1, 10),
		n: getRandomInt(2, 6) * 5,
		...variables,
	};

	// question
	const body = `A bank offers a savings account with a compound interest rate of
		${math(`${rPercent}\\%`)} per annum, computed at the end of each year.
		<div class="top-margin">
			Mr. Lee decides to deposit ${math(`\\$${a}`)} at the start of every year
			into the savings account. How much (correct to the nearest dollar), will be
			inside the account at the end of ${math(`${n}`)} years?
		</div>
	`;

	// answer
	const r = new Fraction(100 + rPercent, 100);
	const gp = new GP(r.times(a), r);
	const sN = Math.round(gp.S(n).valueOf());
	const ans = `${math(`\\$ ${sN}.`)}`;

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

export const qnLogics = {
	a,
	b,
	c,
};
