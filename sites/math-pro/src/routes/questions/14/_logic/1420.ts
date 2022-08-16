import type { AnswerObject } from '$lib/interfaces';
import {
	Complex,
	getRandomInt,
	heads,
	Term,
	Expression,
	Fraction,
	getRandomAngle,
	Angle,
	SquareRoot,
	ComplexExp,
	expToCartesian,
	xComplex,
	expToPoly,
	solveQuadratic,
} from 'mathlify';
import { math, display } from 'mathlifier';

function a(variables?: {
	k1?: Fraction;
	k2?: Fraction;
	k3?: Fraction;
	real?: boolean;
}): [AnswerObject, AnswerObject] {
	const { k1, real } = {
		k1: getRandomAngle(),
		real: heads(),
		...variables,
	};
	let k2 = variables?.k2 ?? getRandomAngle();
	while (k2.isEqualTo(k1)) {
		k2 = getRandomAngle();
	}
	let k3 = variables?.k3 ?? getRandomAngle();
	while (k3.isEqualTo(k1) || k3.isEqualTo(k2)) {
		k3 = getRandomAngle();
	}
	// set up: variables
	const theta1 = new Angle(k1);
	const theta2 = new Angle(k2);
	const theta3 = new Angle(k3);
	if (theta1.minus(theta2).minus(theta3).k.den <= 2) {
		return a();
	}
	const r1 = k1.den === 4 ? new SquareRoot(2) : 2;
	const r2 = k2.den === 4 ? new SquareRoot(2) : 2;
	const r3 = k3.den === 4 ? new SquareRoot(2) : 2;
	const z1 = new ComplexExp(r1, theta1);
	const z1Cartesian = expToCartesian(z1);
	const z2 = new ComplexExp(r2, theta2);
	const z2Cartesian = expToCartesian(z2);
	const z3 = new ComplexExp(r3, theta3);
	// set up: question
	const frac1 = `\\frac{z_1}{z_2z_3}`;
	const frac2 = `\\frac{z_1z_4}{z_2z_3}`;
	const modFrac = `\\displaystyle \\left| ${frac2} \\right| = 1.`;
	const realString = real ? `real` : `purely imaginary`;

	// question
	const body = `Three complex numbers are
		${display(`\\begin{align*}
			z_1 &= ${z1Cartesian}, \\\\
			z_2 &= ${z2Cartesian} \\; \\textrm{ and } \\\\
			z_3 &= {\\textstyle ${z3.toPolarString()}}.
		\\end{align*}`)}
	`;
	const partI = `Find ${math(`\\displaystyle ${frac1}`)} in the form
		${math(`${ComplexExp.POLAR_FORM},`)} where
		${math(`r>0`)} and
		${math(`-\\pi < \\theta \\leq \\pi.`)}
	`;
	const uplevel = `A fourth complex number, ${math('z_4,')}
		is such that ${math(`\\displaystyle ${frac2}`)} is
		${realString} and ${math(`${modFrac}`)}
	`;
	const partII = `Find the possible values of ${math(`z_4`)}
		in the form ${math(`${ComplexExp.POLAR_FORM},`)}
		where ${math('r>0')} and ${math(`-\\pi < \\theta \\leq \\pi.`)}
	`;

	// solution working
	const result = z1.divide(z2).divide(z3);
	const z4A = real ? new ComplexExp(1, 0).divide(result) : new ComplexExp(1, 90).divide(result);
	const z4B = real ? new ComplexExp(1, 180).divide(result) : new ComplexExp(1, -90).divide(result);

	// answer
	const ansI = `${display(`${frac1} = {\\textstyle ${result.toPolarString()}.}`)}`;
	const ansII = display(`\\begin{align*}
		z_4 &= {\\textstyle ${z4A.toPolarString()}} \\textrm{ or } \\\\
		z_4 &= {\\textstyle${z4B.toPolarString()}.}
	\\end{align*}`);

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 4 },
			{ body: partII, marks: 3, uplevel },
		],
	};
	const answer: AnswerObject = {
		parts: [{ body: ansI }, { body: ansII }],
	};

	return [question, answer];
}

function b(variables?: {
	c?: number;
	k?: number;
	x?: number;
	y?: number;
}): [AnswerObject, AnswerObject] {
	const { c, x, y } = {
		c: getRandomInt(1, 2) * (heads() ? 2 : -2),
		x: getRandomInt(-5, 5, { avoid: [0] }),
		y: getRandomInt(-5, 5, { avoid: [0] }),
		...variables,
	};
	let k = variables?.k;
	if (k === undefined) {
		k =
			Math.abs(c) === 2 ? getRandomInt(-4, 4, { avoid: [0] }) : getRandomInt(-2, 2, { avoid: [0] });
	}
	// set up: variables
	const t = c * k;
	const alpha = new Complex(x, y);
	const z1 = new Complex(k, k);
	const beta = z1.square().times(alpha).plus(t).divide(z1).negative();
	// set up: question
	let zTerm: Term;
	if (beta.isPurelyImaginary()) {
		zTerm = new Term(beta.imag, 'i', 'z');
	} else if (beta.isReal()) {
		zTerm = new Term(beta.real, 'z');
	} else {
		zTerm = new Term(`(${beta})z`);
	}
	const exp = new Expression(`z^2(${alpha})`, zTerm, 't');
	const z1Unknown = new xComplex('k', 'k');

	// question
	const body = `The complex number ${math('z')} satisfies the equation
		${display(`
			${exp} = 0,
		`)}
		where ${math(`t`)} is a real number. It is given that one root is of the form
		${math(`${z1Unknown},`)} where ${math('k')} is real and non-zero.
		<div class="top-margin">
			Find ${math('t')} and ${math('k,')} and the other root of the equation.
		</div>
	`;

	// solution working
	const expStart = z1Unknown.square().times(alpha).plus(z1Unknown.times(beta));
	const imagPoly = expToPoly(expStart.imag);
	const roots = solveQuadratic(imagPoly) as [Fraction, Fraction];
	const kSolve = roots[0].isEqualTo(0) ? roots[1] : roots[0];
	const realPoly = expToPoly(expStart.real);
	const tSolve = realPoly.subIn(kSolve).negative();
	const z1Solve = new Complex(kSolve, kSolve);
	const z2 = alpha.reciprocal().times(tSolve).divide(z1Solve);

	// answer
	const ans = `${math(`t=${tSolve}, k=${kSolve}.`)}
		<br>Other root of the equation ${math(`=${z2}.`)}
	`;

	const question: AnswerObject = {
		body,
		marks: 8,
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
