import type { AnswerObject } from '$lib/interfaces';
import {
	Fraction,
	SquareRoot,
	getRandomAngle,
	ComplexExp,
	expToCartesian,
	getRandomInts,
	Complex,
	complexToQuadratic,
	Polynomial,
	Expression,
	solveQuadraticComplex,
	subComplexIntoPoly,
	longDivide,
} from 'mathlify';
import { math, display } from 'mathlifier';

function a(variables?: { k1?: Fraction; k2?: Fraction }): [AnswerObject, AnswerObject] {
	const { k1 } = {
		k1: getRandomAngle(),
		...variables,
	};
	const k2 = variables?.k2 ?? getRandomAngle({ avoid: [k1] });
	// set up: variables
	const z1Exp = new ComplexExp(k1.den === 4 ? new SquareRoot(2) : 2, k1);
	const z2Exp = new ComplexExp(k2.den === 4 ? new SquareRoot(2) : 2, k2);
	// set up: question
	const z1 = expToCartesian(z1Exp);
	const z2 = expToCartesian(z2Exp);

	// question
	const body = `The complex numbers ${math(`z_1`)} and ${math(`z_2`)} are given by ${math(
		`${z1}`,
	)} and ${math(`${z2}`)}
		respectively.
	`;
	const partI = `Express each of ${math(`z_1`)} and ${math(`z_2`)} in polar form 
	${math(`r(\\cos \\theta + \\mathrm{i}\\sin \\theta), `)} where ${math(`r > 0`)}
	and ${math('-\\pi < \\theta \\leq \\pi.')} Give ${math('r')} and ${math('\\theta')} in exact form.
	`;
	const partII = `Find the complex conjugate of ${math(`\\displaystyle \\frac{z_1}{z_2}`)}
		in exact polar form
	`;

	// solution working
	const z3Exp = z1Exp.divide(z2Exp).conjugate();

	// answer
	const ansI = display(`\\begin{align*}
			& z_1 = \\textstyle ${z1Exp.toPolarString()},\\\\
			& z_2 = \\textstyle ${z2Exp.toPolarString()}.
		\\end{align*}`);
	const ansII = display(
		`\\left(\\frac{z_1}{z_2}\\right)^* = {\\textstyle ${z3Exp.toPolarString()}}`,
		{},
	);

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 2 },
			{ body: partII, marks: 3 },
		],
	};
	const answer: AnswerObject = {
		parts: [{ body: ansI }, { body: ansII }],
	};

	return [question, answer];
}

function b(variables?: {
	x1?: number;
	y1?: number;
	x2?: number;
	y2?: number;
	x3?: number;
	x4?: number;
}): [AnswerObject, AnswerObject] {
	const randomPair1 = getRandomInts(2, -5, 5, { avoid: [0] });
	const randomPair2 = getRandomInts(2, -4, 4, { avoid: [0] });
	const randomPair3 = getRandomInts(2, -3, 3, { avoid: [0] });
	const { x1, y1, x2, y2, x3, x4 } = {
		x1: randomPair1[0],
		y1: randomPair1[1],
		x2: randomPair2[0],
		y2: randomPair2[1],
		x3: randomPair3[0],
		x4: randomPair3[1],
		...variables,
	};
	// set up: variables
	// part i
	const x0 = new Complex(x1, y1);
	const quad = complexToQuadratic(x0, { unknown: 'x' });
	// part ii
	const root1 = new Complex(x2, y2);
	const quadFactor = complexToQuadratic(root1, { unknown: 'x' });
	const linear1 = new Polynomial([1, -x3]);
	const linear2 = new Polynomial([1, -x4]);
	const quartic = quadFactor.times(linear1).times(linear2);
	const quarticModified = quartic.minus(new Polynomial(quartic.coefficients.slice(0, 2).reverse()));
	const eqn = new Expression(...quarticModified.terms, 'ax', 'b');

	// question
	const partI = `Solve the equation ${math(`${quad}=0.`)}`;
	const partII = `One root of the equation ${display(`${eqn}=0,`)}
		where ${math('a')} and ${math('b')} are real, is ${math(`x=${root1}.`)}
		<div class="top-margin">
			Find the values of ${math(`a`)} and ${math(`b`)} and the other roots.
		</div>
	`;

	// solution working
	// part i
	const [root1S, root2S] = solveQuadraticComplex(quad);
	// part ii
	const rhs = subComplexIntoPoly(root1, quarticModified).negative();
	const a = rhs.imag.divide(root1.imag);
	const b = rhs.real.minus(a.times(root1.real));
	const [a2, a3, a4] = quarticModified.coefficients.slice(2);
	const quarticSolve = new Polynomial([a4, a3, a2, a, b]);
	const [remainingFactor] = longDivide(quarticSolve, quadFactor);
	const [root3S, root4S] = solveQuadraticComplex(remainingFactor);

	// answer
	const ansI = `${math(`x=${root1S}`)} or ${math(`x=${root2S}.`)}`;
	const ansII = `${math(`a=${a}, \\;`)} ${math(`b=${b}.`)}
		<div class="top-margin">
		Other roots: ${math(`x=${root1.conjugate()}, \\;`)}
		${math(`x=${root3S}, \\;`)} ${math(`x=${root4S}.`)}
		</div>
	`;

	const question: AnswerObject = {
		parts: [
			{ body: partI, marks: 2 },
			{ body: partII, marks: 5 },
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
