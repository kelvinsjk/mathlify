import type { AnswerObject } from '$lib/interfaces';
import {
	getRandomInt,
	expToPoly,
	solveLinear,
	Term,
	Complex,
	xComplex,
	solveQuadratic,
} from 'mathlify';
import {
	math,
	//display
} from 'mathlifier';

function qn7(variables?: { a?: number; b?: number; k?: number }): [AnswerObject, AnswerObject] {
	const { a, b, k } = {
		a: getRandomInt(-5, 5, { avoid: [0] }),
		b: getRandomInt(-5, 5, { avoid: [0] }),
		k: getRandomInt(-9, 9, { avoid: [0] }),
		...variables,
	};
	// set up: variables
	const w = new Complex(a, b);
	// set up: question
	const kW = new Term(k, 'w');
	const rhs = w.times(w.conjugate()).plus(w.times(k));

	// question
	const body = `The complex number ${math('w')} is such that
		${math(`ww^* + ${kW} = ${rhs},`)} where ${math(`w^*`)} is the complex conjugate
		of ${math(`w.`)}
		<div class="top-margin">
			Find ${math(`w`)} in the form ${math(`a+\\mathrm{i}b,`)} where ${math(`a`)}
			and ${math('b')} are real.
  `;

	// solution working
	const wUnknown = new xComplex('a', 'b');
	const lhs = wUnknown.times(wUnknown.conjugate()).plus(wUnknown.times(k));
	const eqn = lhs.minus(rhs);
	const imagEqn = expToPoly(eqn.imag);
	const bSolve = solveLinear(imagEqn);
	const wUnknown2 = new xComplex('a', bSolve);
	const lhs2 = wUnknown2.times(wUnknown2.conjugate()).plus(wUnknown2.times(k));
	const eqn2 = lhs2.minus(rhs);
	const realEqn = expToPoly(eqn2.real);
	const aSolve = solveQuadratic(realEqn)[0];
	const wSolve = new Complex(aSolve, bSolve);

	// answer
	const ans = math(`w=${wSolve}.`);

	const question: AnswerObject = {
		body,
		marks: 4,
	};
	const answer: AnswerObject = {
		body: ans,
	};

	return [question, answer];
}

export const qnLogics = {
	qn7,
};
