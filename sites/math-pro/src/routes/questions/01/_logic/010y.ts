import type { AnswerObject } from '$lib/interfaces';
import { getRandomInt, Polynomial, Fraction, solveQuadratic, sample, cramersFrac } from 'mathlify';
import {
	math,
	//display
} from 'mathlifier';

function qn9(variables?: { a?: Fraction; b?: Fraction; c?: number }): [AnswerObject, AnswerObject] {
	// generate variables
	const dens = [1, 2, 2, 3];
	const den = sample(dens);
	const aDefault =
		den === 1
			? new Fraction(getRandomInt(1, 3))
			: den === 2
			? new Fraction(getRandomInt(1, 3) * 2 - 1, 2)
			: new Fraction(getRandomInt(1, 8, { avoid: [3, 6] }), 3);
	const bDefault =
		den === 1
			? new Fraction(getRandomInt(-9, 9, { avoid: [0] }))
			: den === 2
			? new Fraction(getRandomInt(-10, 9) * 2 + 1, 2)
			: aDefault.num % 3 === 1
			? new Fraction(getRandomInt(-7, 6) * 3 + 2, 3)
			: new Fraction(getRandomInt(-6, 7) * 3 + 1, 3);
	const { a, b, c } = {
		a: aDefault,
		b: bDefault,
		c: getRandomInt(1, 19),
		...variables,
	};

	// construct qn
	const uN = new Polynomial([a, b, c], { unknown: 'n' });
	const u1 = uN.subIn(1);
	let two = 2,
		three = 3;
	let first = `first three`;
	if (a.den === 3) {
		two = 3;
		three = 4;
		first = `first, third and fourth`;
	}
	const u2 = uN.subIn(two);
	const u3 = uN.subIn(three);
	const u10 = uN.subIn(10);
	const hundred =
		Math.max(u1.valueOf(), u2.valueOf(), u3.valueOf(), u10.valueOf()) >= 100 ? 500 : 100;

	// typeset qn
	const partI = `The ${first} terms of a sequence are given by
		${math(`u_1 = ${u1},`)} ${math(`u_${two} = ${u2},`)} ${math(`u_${three} = ${u3}.`)}
		Given that ${math(`u_n`)} is a quadratic polynomial
		in ${math(`n,`)} find ${math(`u_n`)} in terms of ${math('n.')}
	`;
	const partII = `Find the set of value of ${math('n')}
		for which ${math(`u_n`)} is greater than ${math(`${hundred}.`)}
	`;

	// solution working
	const secondRow = a.den !== 3 ? [4, 2, 1] : [9, 3, 1];
	const thirdRow = a.den !== 3 ? [9, 3, 1] : [16, 4, 1];
	const [aSolve, bSolve, cSolve] = cramersFrac(1, 1, 1, u1, ...secondRow, u2, ...thirdRow, u3);
	const uNPoly = new Polynomial([aSolve, bSolve, cSolve], { unknown: 'n' });
	const n = Math.ceil(solveQuadratic(uNPoly.minus(hundred))[1].valueOf());

	// answer
	const ansI = math(`u_n = ${uNPoly}.`);
	const ansII = math(`\\{ n \\in \\mathbb{Z}: \\allowbreak { n \\geq ${n} }  \\}.`, { wrap: true });

	const question: AnswerObject = {
		parts: [
			{ body: partI, marks: 4 },
			{ body: partII, marks: 2 },
		],
	};
	const answer: AnswerObject = {
		parts: [{ body: ansI }, { body: ansII }],
	};

	return [question, answer];
}
export const qnLogics = {
	qn9,
};
