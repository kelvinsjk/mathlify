import type { AnswerObject } from '$lib/interfaces';
import {
	getRandomInt,
	expToPoly,
	heads,
	Complex,
	Polynomial,
	xComplex,
	longDivide,
	solveQuadraticSurd,
	Angle,
} from 'mathlify';
import { math, display } from 'mathlifier';

function qn1(variables?: {
	k?: number; // k + ki
	quadrant?: number;
	b?: number; // in w^2 + bw + (a+yi)
}): [AnswerObject, AnswerObject] {
	// set up
	const { k, quadrant, b } = {
		k: getRandomInt(1, 3),
		quadrant: getRandomInt(1, 4),
		b: getRandomInt(1, 2) * (heads() ? -2 : 4), //
		...variables,
	};
	// qn construction
	let z: Complex;
	if (quadrant === 1) {
		z = new Complex(k, k);
	} else if (quadrant === 2) {
		z = new Complex(-k, k);
	} else if (quadrant === 3) {
		z = new Complex(-k, -k);
	} else {
		z = new Complex(k, -k);
	}
	const zSquare = z.square();
	const x = Math.abs(b) === 4 ? 4 : 1;
	const y = zSquare.imag.divide(-4);
	const c = new Complex(x, y);
	const polyStart = new Polynomial([1, b, 0], { unknown: 'w' });
	const poly = `${polyStart} + {\\left( \\textstyle ${c} \\right)}`;

	// question
	const body = `<strong>Do not use a graphic calculator in answering this question.</strong>`;
	const partI = `The roots of the equation 
	${math(`z^2 = ${zSquare}`)} are ${math(`z_1`)} and ${math(`z_2.`)} Find ${math(`z_1`)}
	and ${math(`z_2`)} in cartesian form ${math(`x+\\mathrm{i}y,`)} showing your working.`;
	const partII = `Hence, or otherwise, find in cartesian form the roots
	${math(`w_1`)} and ${math(`w_2`)} of the equation ${display(`${poly}=0.`)}`;

	// solution working
	// part i
	// z2 is purely imaginary so (x+yi)^2 = z2 means
	// x2-y2 = 0 and 2xy = z2.imag
	// y = z2.imag/2x
	// x2 - (z2.imag/2x)^2 = 0
	// 4x^4 = z2.imag^2
	// x^4 = z2.imag^2/4
	const xSolve = Math.sqrt(Math.sqrt(zSquare.imag.square().divide(4).valueOf()));
	const ySolve = zSquare.imag.divide(xSolve * 2);
	const z1 = new Complex(xSolve, ySolve);
	const z2 = z1.negative();
	// part ii
	// w = -b/2 \pm sqrt(dis)/2
	const w1 = z1.minus(b).divide(2);
	const w2 = z2.minus(b).divide(2);

	// answer
	const ansI = math(`z_1 = ${z1}, \\;`) + math(`z_2 = ${z2}.`);
	const ansII = math(`w_1 = ${w1}, \\;`) + math(`w_2 = ${w2}.`);

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 4 },
			{ body: partII, marks: 3 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		parts: [{ body: ansI }, { body: ansII }],
		partLabelType: 'roman',
	};

	return [question, answer];
}

function qn2(variables?: { a?: number; xUnknown?: boolean }): [AnswerObject, AnswerObject] {
	// generate variables
	const { a, xUnknown } = {
		a: getRandomInt(-5, 5, { avoid: [0] }),
		xUnknown: heads(),
		...variables,
	};
	// construct qn
	const z = xUnknown ? new xComplex('c', a) : new xComplex(a, 'c');
	const real = xUnknown ? 'purely imaginary' : 'real';

	// typeset qn
	const body = `<strong>Do not use a calculator in answering this question.</strong>
	<div class="top-margin">
		The complex number ${math('z')} is given by ${math(`z=${z},`)}
		where ${math('c')} is a non-zero real number.
	</div>
	`;
	const partI = `Find ${math('z^3')} in the form ${math('x+\\mathrm{i}y.')}`;
	const partII = `Given that ${math('z^3')} is ${real}, find the possible values of ${math('z.')}`;
	const partIII = `For the value of ${math('z')} found in part (ii) for which ${math('c<0,')}
		find the smallest positive integer ${math('n')} such that ${math(`\\left| z^n \\right| > 1000.`)}
		<div class="top-margin">
			State the modulus and argument of ${math(`z^n`)} when ${math('n')} takes this value.
		</div>
	`;

	// solution working
	const z3 = z.pow(3);
	const z3String = `(${z3.real})+(${z3.imag})\\mathrm{i}`;
	const poly = expToPoly(xUnknown ? z3.real : z3.imag, { n: 3 });
	const [quad] = longDivide(poly, new Polynomial([1, 0], { unknown: 'c' }));
	const [root1, root2] = solveQuadraticSurd(quad);
	const z1 = xUnknown ? new xComplex(root1, a) : new xComplex(a, root1);
	const z2 = xUnknown ? new xComplex(root2, a) : new xComplex(a, root2);
	// |z| = 2 |a|
	const n = Math.ceil(Math.log(1000) / Math.log(2 * Math.abs(a)));
	let angle: Angle;
	if (xUnknown) {
		angle = a > 0 ? new Angle(120) : new Angle(-120); // 2nd or 3rd quadrant
	} else {
		angle = a > 0 ? new Angle(-60) : new Angle(-120); // 1st or 3rd quadrant
	}
	const modulus = Math.pow(2 * Math.abs(a), n);
	const argument = angle.times(n);

	// answer
	const ansI = math(`z^3 = {${z3String}}.`, { wrap: true });
	const ansII = `${math(`z=${z1}`)} or ${math(`z=${z2}.`)}`;
	const ansIII = `Smallest positive integer ${math(`n = ${n}.`)}
		<div class="top-margin">
			${math(`\\left| z^n \\right| = ${modulus},`)}<br>
			${math(`\\arg z^n = ${argument}.`)}
		</div>
	`;

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 2 },
			{ body: partII, marks: 2 },
			{ body: partIII, marks: 4 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		parts: [{ body: ansI }, { body: ansII }, { body: ansIII }],
		partLabelType: 'roman',
	};

	return [question, answer];
}

export const qnLogics = {
	qn1,
	qn2,
};
