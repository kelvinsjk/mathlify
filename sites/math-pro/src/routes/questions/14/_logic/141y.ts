import type { AnswerObject } from '$lib/interfaces';
import {
	getRandomInt,
	Fraction,
	SquareRoot,
	cramersFrac,
	Term,
	solveQuadratic,
	heads,
	xComplex,
	Complex,
	complexToQuadratic,
	Polynomial,
	getRandomInts,
	Expression,
	Unknown,
	longDivide,
	solveQuadraticComplex,
	ComplexExp,
} from 'mathlify';
import { math, display } from 'mathlifier';

function qn5(variables?: { divideCase?: number; real?: boolean }): [AnswerObject, AnswerObject] {
	// generate variables
	const { divideCase, real } = {
		divideCase: getRandomInt(1, 3), // 1: w2/w*, 2: w*/w2, 3: w*w2
		real: heads(),
		...variables,
	};
	const w = new xComplex('a', 'b');
	const wTerm =
		divideCase === 1
			? `\\displaystyle \\frac{w^2}{w^*}`
			: divideCase === 2
			? `\\displaystyle \\frac{w^*}{w^2}`
			: `w^* w^2`;
	const realString = real ? 'real' : 'purely imaginary';
	// testing typesetting
	//const result = w.pow(3);

	// typeset
	const body = `The complex number ${math(`w`)} is such that
		${math(`w=${w},`)} where ${math(`a`)} and ${math(`b`)} are non-zero real numbers.
		The complex conjugate of ${math(`w`)} is denoted by ${math(`w^*.`)}
		<div class="top-margin">
			Given that ${math(`${wTerm}`)} is ${realString}, find the possible values of ${math(
		`w`,
	)} in terms of
			${math(`a.`)}
		</div>
  `;

	// answer
	const w1 = real
		? new xComplex('a', new Term('a', new SquareRoot(3)))
		: new xComplex('a', new Term('a', new SquareRoot(3).reciprocal()));

	// typeset
	const ans = `${math(`w=${w1}`)} or ${math(`w=${w1.conjugate()}.`)}`;

	const question: AnswerObject = {
		body,
		marks: 5,
	};
	const answer: AnswerObject = {
		body: ans,
	};

	return [question, answer];
}

function qn6(variables?: {
	x1?: number;
	y1?: number;
	x2?: number;
	y2?: number;
	positive?: boolean;
	a?: number;
	z3?: number;
}): [AnswerObject, AnswerObject] {
	// setup
	const x1Gen = getRandomInt(-5, 5, { avoid: [0] });
	const y1Gen = getRandomInt(-5, 5, { avoid: [0] });
	const { x1, y1, x2, y2, a, z3, positive } = {
		x1: x1Gen,
		y1: y1Gen,
		x2: getRandomInt(-5, 5, { avoid: [0, x1Gen] }),
		y2: getRandomInt(-5, 5, { avoid: [0, y1Gen] }),
		a: getRandomInt(1, 4),
		positive: heads(),
		z3: getRandomInt(-5, 5, { avoid: [0] }),
		...variables,
	};
	const alpha = new Complex(x1, y1);
	const beta = new Complex(x2, y2);
	const z1 = new Complex(positive ? 1 : -1, a);

	// question
	const sumRoots = alpha.plus(beta).negative();
	const prodRoots = alpha.times(beta);
	const eqn = `w^2 + \\left( ${sumRoots} \\right) w + \\left( ${prodRoots} \\right) = 0.`;
	// part b
	const quad = complexToQuadratic(z1);
	const linear = new Polynomial([1, -z3], { unknown: 'z' });
	const cubicFull = quad.times(linear);
	const coeffs = cubicFull.coefficients;
	const cubicStart = cubicFull.minus(coeffs[0]);
	const cubicQn = `${cubicStart}+k=0,`;
	const z1Unknown = new xComplex(positive ? 1 : -1, 'a');

	// typeset
	const body = `<strong>Do not use a calculator in answering this question.</strong>`;
	const partI = `Verify that ${math(`${alpha}`)} is a root of the equation
		${display(eqn)}
		Hence, or otherwise, find the second root of the equation in cartesian form,
		${math(`p+\\mathrm{i}q,`)} showing your working.
	`;
	const partII = `The equation 
		${display(`${cubicQn}`)}
		where ${math(`k`)} is a real constant, has a root
		${math(`z=${z1Unknown},`)} where ${math('a')} is a positive real constant.
		<div class="top-margin">
			Find the values of ${math('a')} and ${math('k,')}
			showing your working.
		</div>
	`;

	// answer
	const betaSolve = sumRoots.negative().minus(alpha);
	// part b
	// a1 z^3 + b1 z^2 + c1 z + k = ( z^2 - 2(alpha.real)z + alpha.real^2 + a^2)(a1 z - b2)
	const [c1, b1, a1] = coeffs.slice(1);
	// compare z^2: b1 = -b2 -2(alpha.real)a1
	const real = positive ? 1 : -1;
	const b2 = a1.times(-2 * real).minus(b1);
	// compare z: c1 = 2(real)b2 + (real^2 + a^2)a1
	const aSquare = c1
		.minus(b2.times(2 * real))
		.divide(a1)
		.minus(real * real);
	const aSolve = new SquareRoot(aSquare).coeff; // must be an integer
	// compare constant
	const k = aSolve.square().plus(1).times(b2.negative());

	// typeset
	const partIAns = math(`${betaSolve}.`);
	const partIIAns = `${math(`a=${aSolve}, \\;`)} ${math(`k=${k}.`)}`;

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 5 },
			{ body: partII, marks: 5 },
		],
	};
	const answer: AnswerObject = {
		parts: [{ body: partIAns }, { body: partIIAns }],
	};

	return [question, answer];
}

function qn7(variables?: {
	alphaCase?: number;
	quadrant1?: number;
	positiveBeta?: number;
	quadrant2?: number;
	x?: number;
	y?: number;
}): [AnswerObject, AnswerObject] {
	// setup
	const pair = getRandomInts(2, 2, 5);
	const { alphaCase, quadrant1, positiveBeta, quadrant2, x, y } = {
		alphaCase: getRandomInt(1, 3),
		quadrant1: getRandomInt(1, 4),
		positiveBeta: heads(),
		quadrant2: getRandomInt(1, 4),
		x: pair[0] * (heads() ? 1 : -1),
		y: pair[1],
		...variables,
	};

	// question
	let x1 = alphaCase === 3 ? 2 : 1; // alpha 1: 1+i, 2: 1+2i, 3: 2+i
	let y1 = alphaCase === 2 ? 2 : 1;
	if (quadrant1 === 2 || quadrant1 === 3) {
		x1 = -x1;
	}
	if (quadrant1 === 3 || quadrant1 === 4) {
		y1 = -y1;
	}
	const beta = positiveBeta ? 2 : -2;
	const k = alphaCase === 1 ? 5 : 2; // gamma = k alpha*
	const alpha = new Complex(x1, y1);
	const gamma = alpha.conjugate().times(k);
	const betaZ = new Term(beta, 'z');
	const eqnLHS = new Expression(`z^2 \\left(${alpha}\\right)`, betaZ, `(${gamma})`);
	// part b
	const omega =
		quadrant2 === 1
			? new Complex(1, 1)
			: quadrant2 === 2
			? new Complex(-1, 1)
			: quadrant2 === 3
			? new Complex(-1, -1)
			: new Complex(1, -1);
	const omega2 = new Complex(x, y);
	const quad1 = complexToQuadratic(omega, { unknown: '\\omega' });
	const quad2 = complexToQuadratic(omega2, { unknown: '\\omega' });
	const quartic = quad1.times(quad2);
	const quarticCoeffs = quartic.coefficients;
	const a0 = quarticCoeffs[0];
	const a2 = quarticCoeffs[2];
	const a4 = quarticCoeffs[4];
	const eqn2LHS = new Expression(
		new Unknown(a4, { unknown: '\\omega', n: 4 }),
		'p \\omega^3',
		new Unknown(a2, { unknown: '\\omega', n: 2 }),
		'q \\omega',
		a0,
	);

	// typeset qn
	const body = `<strong>Do not use a calculator in answering this question.</strong>`;
	const partI = `Find the roots of the equation
		${display(`${eqnLHS}=0,`)}
		giving your answers in cartesian form ${math(`a+\\mathrm{i}b.`)}
	`;
	const partBI = `Given that ${math(`\\omega=${omega},`)}
		find ${math(`\\omega^2,`)} ${math(`\\omega^3`)}
		and ${math(`\\omega^4`)} in cartesian form.
		<div class="top-margin">
			Given also that
				${display(`${eqn2LHS}=0,`)}
				where ${math(`p`)} and ${math(`q`)} are real, find
				${math(`p`)} and ${math(`q.`)}
		</div>	
	`;
	const partBII = `Using the values of ${math('p')} and
		${math('q')} in part (bii), express
		${display(`${eqn2LHS}`)}
		as the product of two quadratic factors.
	`;

	// answer working
	const discriminant = alpha
		.times(gamma)
		.times(-4)
		.plus(beta * beta).real;
	const root1 = new Complex(-beta, Math.sqrt(discriminant.abs().num)).divide(alpha.times(2));
	const root2 = new Complex(-beta, -Math.sqrt(discriminant.abs().num)).divide(alpha.times(2));
	// part b
	const w2 = omega.square();
	const w3 = omega.pow(3);
	const w4 = omega.pow(4);
	const rhsComplex = w4.times(a4).plus(w2.times(a2)).plus(a0).negative();
	const [p, q] = cramersFrac(
		w3.real,
		omega.real,
		rhsComplex.real,
		w3.imag,
		omega.imag,
		rhsComplex.imag,
	);
	// part bii
	const poly = new Polynomial([a4, p, a2, q, a0], { unknown: '\\omega' });
	const [quad2Solve] = longDivide(poly, quad1);

	// typeset
	const partIAns = `${math(`z = ${root1}, \\;`)} ${math(`z = ${root2}.`)}`;
	const partBIAns = `${math(`\\omega^2 = ${w2}, \\;`)} ${math(`\\omega^3 = ${w3}, \\;`)} ${math(
		`\\omega^4 = ${w4}.`,
	)}
		<div class="top-margin">
			${math(`p=${p}, \\;`)} ${math(`q=${q}.`)}
		</div>
	`;
	const partBIIAns = `${display(`\\begin{align*}
		&${eqn2LHS} \\\\
		=&(${quad1})(${quad2Solve})
	\\end{align*}`)}`;

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 3 },
			{
				parts: [
					{ body: partBI, marks: 4 },
					{ body: partBII, marks: 3 },
				],
			},
		],
	};
	const answer: AnswerObject = {
		parts: [{ body: partIAns }, { parts: [{ body: partBIAns }, { body: partBIIAns }] }],
	};

	return [question, answer];
}

function qn8(variables?: {
	x1?: number;
	y1?: number;
	x3?: Fraction;
	k?: number;
}): [AnswerObject, AnswerObject] {
	// set up
	const x3Den = getRandomInt(2, 4);
	const x3Num = getRandomInt(1, x3Den) * (heads() ? 1 : -1);
	const { x1, y1, x3, k } = {
		x3: new Fraction(x3Num, x3Den),
		x1: getRandomInt(-4, 4, { avoid: [0] }),
		y1: getRandomInt(-4, 4, { avoid: [0] }),
		k: getRandomInt(1, 5) * (heads() ? 1 : -1),
		...variables,
	};
	const alpha = new Complex(x1, y1);
	// set up question
	const linear = new Polynomial([x3.den, -x3.num]);
	const quad = complexToQuadratic(alpha);
	const quartic = quad.times(linear).times(linear);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, a1, __, a3, a4] = quartic.coefficients;
	const x4Term = new Unknown(a4, { n: 4 });
	const x3Term = new Unknown(a3, { n: 3 });
	const xTerm = new Unknown(a1, { n: 1 });
	const eqnLHS = new Expression(x4Term, x3Term, 's x^2', xTerm, 't');
	// part b
	const rhs = Math.pow(k, 3);

	// typeset
	const partA = `One of the roots of the equation
		${display(`${eqnLHS}=0,`)}
		where ${math('s')} and ${math('t')} are real, is
		${math(`${alpha}.`)}
		<div class="top-margin">
			Find the other roots of the equation and the values of
			${math('s')} and ${math('t.')}
		</div>
	`;
	const body = `The complex number ${math(`w`)} is such that ${math(`w^3 = ${rhs}.`)}`;
	const partI = `Given that one possible value of ${math('w')} is ${math(`${k},`)}
		use <strong>a non-calculator method</strong> to find the other possible values of ${math('w.')}
		<br>Give your answers in the form ${math('a+\\mathrm{i}b,')} where ${math('a')} and ${math('b')}
		are exact values.
	`;
	const partII = `Write these values of ${math(
		'w',
	)} in modulus-argument form and represent them on an Argand diagram.`;
	const partIII = `Find the sum and product of all the possible values of ${math(
		'w,',
	)} simplifying your answers.`;

	// answer working
	const alpha2 = alpha.pow(2);
	const alpha3 = alpha.pow(3);
	const alpha4 = alpha.pow(4);
	const [s, t] = cramersFrac(
		alpha2.real,
		1,
		alpha4.times(a4).plus(alpha3.times(a3)).plus(alpha.times(a1)).negative().real,
		alpha2.imag,
		0,
		alpha4.times(a4).plus(alpha3.times(a3)).plus(alpha.times(a1)).negative().imag,
	);
	const quarticSolve = new Polynomial([a4, a3, s, a1, t]);
	const [quadraticSolve] = longDivide(quarticSolve, quad);
	const [root3] = solveQuadratic(quadraticSolve);
	// part b
	const cubic = new Polynomial([1, 0, 0, -rhs]);
	const [quadraticSolveB] = longDivide(cubic, new Polynomial([1, -k]));
	const [root1, root2] = solveQuadraticComplex(quadraticSolveB);
	const root1Exp = `${Math.abs(k)} \\mathrm{e}^{${k > 0 ? '0' : '\\pi'} \\mathrm{i}}`;
	const root2Exp = new ComplexExp(Math.abs(k), k > 0 ? 120 : 60);
	const sum = root2 instanceof xComplex ? root2.plus(root1).plus(k) : root1.plus(root2).plus(k);
	const product = root2Exp.times(root2Exp.conjugate()).times(k);

	// typeset answer
	const ansA = `Other roots: ${math(`x=${alpha.conjugate()}, \\;`)} ${math(`x=${root3}.`)}
		<div class="top-margin">
			${math(`s=${s}, \\; t=${t}.`)}
		</div>
	`;
	const ansI = math(`w = ${root1}, \\;`) + math(`w = ${root2}.`);
	const ansII =
		math(`w = ${root1Exp}, \\;`) +
		math(`w = ${root2Exp}, \\;`) +
		math(`w = ${root2Exp.conjugate()}.`);
	const ansIII = `Sum of roots ${math(`= ${sum}.`)} <br>Product of roots ${math(`= ${product}.`)}`;

	const question: AnswerObject = {
		parts: [
			{ body: partA, marks: 5 },
			{
				body,
				parts: [
					{ body: partI, marks: 3 },
					{ body: partII, marks: 2 },
					{ body: partIII, marks: 2 },
				],
			},
		],
	};
	const answer: AnswerObject = {
		parts: [{ body: ansA }, { parts: [{ body: ansI }, { body: ansII }, { body: ansIII }] }],
	};

	return [question, answer];
}

export const qnLogics = {
	qn5,
	qn6,
	qn7,
	qn8,
};
