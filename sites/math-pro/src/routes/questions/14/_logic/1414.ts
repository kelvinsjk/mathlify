import type { AnswerObject } from '$lib/interfaces';
import {
	Fraction,
	getRandomAngle,
	ComplexExp,
	expToCartesian,
	Complex,
	getRandomInt,
	heads,
	Term,
	SquareRoot,
} from 'mathlify';
import {
	math,
	//display
} from 'mathlifier';

function a(variables?: {
	x?: number;
	y?: number;
	n1?: number;
	n2?: number;
	real?: boolean;
}): [AnswerObject, AnswerObject] {
	const x2 = getRandomInt(2, 3) * (heads() ? 1 : -1);
	const x1 = heads() ? 1 : -1;
	const [x1Actual, x2Actual] = heads() ? [x1, x2] : [x2, x1];
	const { x, y, n1, n2, real } = {
		x: x1Actual,
		y: x2Actual,
		n1: getRandomInt(2, 3),
		n2: getRandomInt(1, 3),
		real: heads(),
		...variables,
	};
	// set up: variables
	const z = new Complex(x, y);
	// set up: question
	const zNString = `z^${n1}`;
	const zN2String = `z${n2 === 1 ? '' : `^{${n2}}`}`;
	const realString = real ? 'real' : 'purely imaginary';

	// question
	const body = `It is given that ${math(`z=${z}.`)}`;
	const partI = `Without using a calculator, find the values of ${math(`${zNString}`)} and
		${math(`\\displaystyle \\frac{1}{${zN2String}}`)} in cartesian form ${math(`x + \\mathrm{i}y,`)}
		showing your working.`;
	const partII = `The real numbers ${math(`p`)} and ${math(`q`)} are such that
		${math(`\\displaystyle p${zNString} + \\frac{q}{${zN2String}}`)} is ${realString}.
		<div class="top-margin">
			Find, in terms of ${math(`p,`)} the value of ${math(`q`)} and the value of
			${math(`\\displaystyle p${zNString} + \\frac{q}{${zN2String}}.`)}
		</div>
	`;

	// solution working
	const z2 = z.pow(n1);
	const oneOverZ3 = z.reciprocal().pow(n2);
	let qSolve: Term;
	if (real) {
		// imag = 0, p Im(z2) = -q Im(1/z3)
		const coeff = z2.imag.divide(oneOverZ3.imag).negative();
		qSolve = new Term(coeff, 'p');
	} else {
		const coeff = z2.real.divide(oneOverZ3.real).negative();
		qSolve = new Term(coeff, 'p');
	}
	const result = z2.plus(oneOverZ3.times(qSolve.coeff));
	const pResult = result.isReal() ? new Term(result.real, 'p') : new Term(result.imag, 'p', 'i');

	// answer
	const ansI = `${math(`${zNString} = ${z2},`)}
		<br>${math(`\\displaystyle \\frac{1}{${zN2String}} = ${oneOverZ3}.`)}`;
	const ansII = `${math(`q = ${qSolve},`)}
		<br>${math(`\\displaystyle p${zNString} + \\frac{q}{${zN2String}} = ${pResult}.`, { wrap: true })}`;

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 4 },
			{ body: partII, marks: 3 },
		],
	};
	const answer: AnswerObject = {
		parts: [{ body: ansI }, { body: ansII }],
	};

	return [question, answer];
}

function b(variables?: {
	k?: Fraction; // angle
	n?: number;
	divide?: boolean;
	positive?: boolean;
}): [AnswerObject, AnswerObject] {
	const { k, divide, positive } = {
		k: getRandomAngle(),
		divide: heads(),
		positive: heads(),
		...variables,
	};
	let n = variables?.n ?? getRandomInt(4, 8);
	// set up: variables
	if (k.times(n).divide(2).isInteger()) {
		// avoid e^{i 0}
		n = n + 1;
	}
	const r = k.den === 4 ? new SquareRoot(2) : 2;
	const w = new ComplexExp(r, k);
	const wCartesian = expToCartesian(w);
	const wTerm = divide ? `\\displaystyle \\frac{w^n}{w^*}` : `w^n w^*`;
	const positiveString = positive ? ` and positive ` : ``;
	// set up: question

	// question
	const body = `It is given that ${math(`w=${wCartesian}.`)}`;
	const partI = `Without using a calculator, find an exact expression for ${math(`w^${n}.`)}
		Give your answer in the form ${math(`${ComplexExp.FORM},`)}
		where ${math(`r > 0`)} and ${math(`-\\pi < \\theta \\leq \\pi.`)}
	`;
	const partII = `Without using a calculator, find the three smallest positive whole number values of
		${math('n')} for which ${math(`${wTerm}`)} is a real ${positiveString} number.`;

	// solution working
	// part i
	const wN = w.pow(n);
	// n = cm/k \mp 1
	const c = positive ? 2 : 1;
	const one = divide ? -1 : 1;
	const m1 = k.isGreaterThan(0)
		? Math.ceil(
				k
					.divide(c)
					.times(one * -1)
					.valueOf(),
		  )
		: Math.floor(
				k
					.divide(c)
					.times(one * -1)
					.valueOf(),
		  );
	const nArray: Fraction[] = [];
	let m = m1;
	while (nArray.length < 3) {
		const n = k.reciprocal().times(c).times(m).plus(one);
		if (n.isInteger() && n.isGreaterThan(0)) {
			nArray.push(n);
		}
		m = k.isGreaterThan(0) ? m + 1 : m - 1;
	}

	// answer
	const ansI = `${math(`w^${n} = ${wN}.`)}`;
	const ansII = `Three smallest positive whole number values of ${math(
		`n=${nArray[0]}, ${nArray[1]}, ${nArray[2]}.`,
	)}`;

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 3 },
			{ body: partII, marks: 4 },
		],
	};
	const answer: AnswerObject = {
		parts: [{ body: ansI }, { body: ansII }],
	};

	return [question, answer];
}

export const qnLogics = {
	a,
	b,
};
