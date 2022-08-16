import type { AnswerObject } from '$lib/interfaces';
import {
	Complex,
	getRandomInt,
	heads,
	Term,
	complexToQuadratic,
	Polynomial,
	Expression,
} from 'mathlify';
import { math, display } from 'mathlifier';

function a(variables?: { x?: number; y?: number; x3?: number }): [AnswerObject, AnswerObject] {
	const { x, y, x3 } = {
		x: getRandomInt(-4, 4, { avoid: [0] }),
		y: getRandomInt(-4, 4, { avoid: [0] }),
		x3: getRandomInt(-3, 3, { avoid: [0] }),
		...variables,
	};
	// set up: variables
	const z = new Complex(x, y);
	// set up: question
	const eqn = `f(z)=az^3 + bz^2 + cz + d`;

	// question
	const body = `The function ${math('f')} is defined by
		${display(`${eqn},`)}
		where ${math(`a, b, c`)} and ${math('d')} are real numbers.
		Given that ${math(`${z}`)} and ${math(`${x3}`)} are roots of
		${math(`f(z)=0,`)} find
		${math(`b, c`)} and ${math('d')} in terms of 
		${math('a.')}
	`;

	// solution working
	const quad = complexToQuadratic(z);
	const linear = new Polynomial([1, -x3], { unknown: 'z' });
	const cubic = quad.times(linear);
	const [d1, c1, b1] = cubic.coefficients;
	const d = new Term(d1, 'a');
	const c = new Term(c1, 'a');
	const b = new Term(b1, 'a');

	// answer
	const ans = `${math(`b=${b}, \\;`)} ${math(`c=${c}, \\;`)} ${math(`d=${d}.`)}`;

	const question: AnswerObject = {
		body,
		marks: 4,
	};
	const answer: AnswerObject = {
		body: ans,
	};

	return [question, answer];
}

function b(variables?: { k?: number; real?: boolean }): [AnswerObject, AnswerObject] {
	const { k, real } = {
		k: getRandomInt(2, 4) * (heads() ? 1 : -1),
		real: heads(),
		...variables,
	};
	// set up: variables
	const alpha = real ? new Complex(k, 0) : new Complex(0, k);
	// set up: question
	const num = new Expression('z', ...alpha.negative().terms);
	const alphaString = `${alpha.conjugate().negative()}1`;
	const alphaTerm = new Term(
		alphaString[0] === '-' ? -1 : 1,
		alpha.isReal() ? alpha.real.abs() : alpha.imag.abs(),
		alpha.isReal() ? 1 : 'i',
		'z',
	);
	const den = new Expression(1, alphaTerm);

	// question
	const body = `The complex number ${math('z')} has modulus ${math('1.')}
		Find the modulus of the complex number 
		${display(`\\frac{${num}}{${den}}.`)}
	`;

	// solution working

	// answer
	const ans = `${math(`\\displaystyle \\left| \\frac{${num}}{${den}} \\right| = 1.`)}`;

	const question: AnswerObject = {
		body,
		marks: 5,
	};
	const answer: AnswerObject = {
		body: ans,
	};

	return [question, answer];
}

export const qnLogics = {
	a,
	b,
};
