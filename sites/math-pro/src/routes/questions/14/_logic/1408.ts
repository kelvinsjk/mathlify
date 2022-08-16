import type { AnswerObject } from '$lib/interfaces';
import { getRandomInt, Fraction, heads, xComplex, SquareRoot, cramersFrac } from 'mathlify';
import { math, display } from 'mathlifier';

function a(variables?: { x?: number; y?: number; k?: number }): [AnswerObject, AnswerObject] {
	const { x, k } = {
		x: getRandomInt(-2, 2, { avoid: [0] }),
		k: getRandomInt(-2, 3) * 2 - 1, // z3 = k/2
		...variables,
	};
	// set up: variables
	let y = variables?.y;
	if (y === undefined) {
		// if |x|=1, y = 2,3,5,6,7. if |x|=2, y = 2,3,5.
		y = Math.abs(x) === 1 ? getRandomInt(2, 6) : getRandomInt(2, 4);
		if (y > 3) {
			// 4,5,6 -> 5,6,7
			y = y + 1;
		}
	}
	// set up: question
	const z1 = new xComplex(x, new SquareRoot(y));
	const z1ModSquare = x * x + y;
	const constantTerm = z1ModSquare * k * -1;
	const poly = `2z^3 + az^2 + bz ${k > 0 ? '' : '+'} ${constantTerm} = 0,`;

	// question
	const body = `A graphic calculator is <strong>not</strong> to be used in answering this question.`;
	const partI = `It is given that
		${math(`z_1 = ${z1}.`)} Find the value of
		${math(`z_1^3,`)} showing clearly how you obtain your answer.
	`;
	const partII = `Given that ${math(`${z1}`)} is a root of the equation
		${display(poly)}
		find the values of the real numbers ${math(`a`)} and ${math(`b.`)}
	`;
	const partIII = `For these values of ${math('a')} and ${math('b,')}
		solve the equation in part (ii), and show all the roots on an Argand diagram.
	`;

	// solution working
	const z1Cube = z1.pow(3);
	const z1Square = z1.square();
	// real eqn:
	const a1 = z1Square.real.terms[0].coeff;
	const b1 = x;
	const c1 = z1Cube.real.terms[0].coeff.times(-2).plus(z1ModSquare * k);
	const sqrtY = new SquareRoot(y);
	const a2 = z1Square.imag.terms[0].times(sqrtY.reciprocal()).coeff;
	const b2 = 1;
	const c3 =
		z1Cube.imag.terms.length === 0
			? 0
			: z1Cube.imag.terms[0].times(sqrtY.reciprocal()).coeff.times(-2);
	const [a, b] = cramersFrac(a1, b1, c1, a2, b2, c3);
	const z3 = new Fraction(k, 2);

	// answer
	const ansI = math(`z_1^3=${z1Cube}.`);
	const ansII = math(`a=${a}, \\;`) + math(`b=${b}.`);
	const ansIII =
		math(`z=${z1}, \\;`) + math(`z=${z1.conjugate()} \\;`) + ` or ` + math(`\\; z=${z3}.`);

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 3 },
			{ body: partII, marks: 4 },
			{ body: partIII, marks: 4 },
		],
	};
	const answer: AnswerObject = {
		parts: [{ body: ansI }, { body: ansII }, { body: ansIII }],
	};

	return [question, answer];
}

function b(variables?: {
	wOnTop?: boolean;
	condition?: number;
	n?: number;
}): [AnswerObject, AnswerObject] {
	const { wOnTop, condition } = {
		wOnTop: heads(),
		condition: getRandomInt(1, 4), // 1: real and postive, 2: real and negative, 3: real, 4: imaginary
		...variables,
	};
	// set up: variables
	let n = variables?.n;
	if (n === undefined) {
		n =
			condition === 1
				? getRandomInt(2, 8)
				: condition === 2
				? getRandomInt(2, 5)
				: condition === 3
				? getRandomInt(2, 4)
				: getRandomInt(2, 3);
	}
	// set up: question
	const conditionString =
		condition === 1
			? 'real and positive'
			: condition === 2
			? 'real and negative'
			: condition === 3
			? 'real'
			: 'purely imaginary';

	// question
	const body = `The complex number ${math('w')} has modulus ${math('r')} and
		argument ${math('\\theta,')} where ${math('0 < \\theta < \\frac{1}{2}\\pi,')}
		and ${math('w^*')} denotes the conjugate of ${math('w.')}
	`;
	const partI = `State the modulus and argument of ${math('p,')}
		where ${math(`\\displaystyle p = ${wOnTop ? '\\frac{w}{w^*}' : '\\frac{w^*}{w}'}.`)}
	`;
	const partII = `Given that ${math(`p^${n}`)} is ${conditionString}, find the possible value(s) of 
		${math('\\theta.')}
	`;

	// solution working

	// answer
	const ansI = math(`|p|=1, \\;`) + math(`\\arg(p)=${wOnTop ? '' : '-'} 2 \\theta.`);
	let ansII: string;
	if (condition === 1) {
		// real and positive k/n pi
		ansII = math(`\\theta = \\frac{1}{${n}} \\pi`);
		for (let k = 2; k < n / 2; k++) {
			ansII += ` or ${math(`\\theta = ${new Fraction(k, n)} \\pi`)}`;
		}
	} else if (condition === 2) {
		// real and negative (2k-1)/2n pi
		ansII = math(`\\theta = \\frac{1}{${2 * n}} \\pi`);
		for (let k = 2; 2 * k - 1 < n; k++) {
			ansII += ` or ${math(`\\theta = ${new Fraction(2 * k - 1, 2 * n)} \\pi`)}`;
		}
	} else if (condition === 3) {
		// real k/2n pi
		ansII = math(`\\theta = \\frac{1}{${2 * n}} \\pi`);
		for (let k = 2; k < n; k++) {
			ansII += ` or ${math(`\\theta = ${new Fraction(k, 2 * n)} \\pi`)}`;
		}
	} else {
		// imaginary (2k-1)/4n pi
		ansII = math(`\\theta = \\frac{1}{${4 * n}} \\pi`);
		for (let k = 2; 2 * k - 1 < n * 2; k++) {
			ansII += ` or ${math(`\\theta = ${new Fraction(2 * k - 1, 4 * n)} \\pi`)}`;
		}
	}

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 2 },
			{ body: partII, marks: 2 },
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
