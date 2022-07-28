import { Polynomial, Fraction, SquareRoot, numberToFraction, Expression, Term } from '../core/index';

/**
 * simplify a polynomial, returning a simplified polynomial
 * so that all the coefficients are integers, the leading coefficient is positive,
 * and gcd(...coeffs) = 1
 */
export function simplifyPoly(poly: Polynomial): Polynomial {
	let [coeffs] = Fraction.factorize(...poly.coefficients);
	if (coeffs[0].valueOf() < 0) {
		coeffs = coeffs.map((c) => c.negative());
	}
	if (!poly.ascending) {
		coeffs.reverse();
	}
	return new Polynomial(coeffs, { ascending: poly.ascending, unknown: poly.unknown });
}

/**
 * factorize a simplified quadratic polynomial into two linear factors
 *
 * Also returns the two roots of the quadratic
 */
export function factorizeQuadratic(poly: Polynomial): [Polynomial, Polynomial, [Fraction, Fraction]] {
	const [root1, root2] = solveQuadratic(poly);
	if (typeof root1 === 'number' || typeof root2 === 'number') {
		throw new Error('irrational roots');
	}
	const factor1 = new Polynomial([root1.den, -root1.num], { unknown: poly.unknown });
	const factor2 = new Polynomial([root2.den, -root2.num], { unknown: poly.unknown });
	return [factor1, factor2, [root1, root2]];
}

/**
 * factorize a simplified cubic polynomial into three linear factors or one linear + one irreducible quadratic
 *
 * Also returns the other roots
 */
export function factorizeCubic(poly: Polynomial, root: number | Fraction): [Polynomial[], [Fraction, Fraction] | null] {
	if (!poly.subIn(root).isEqualTo(0)) {
		throw new Error(`root provided is not correct`);
	}
	root = numberToFraction(root);
	const factor1 = new Polynomial([root.den, -root.num], { unknown: poly.unknown });
	// ax^3 + bx^2 + cx + d = (ex+f)(Ax^2+Bx+C);
	// comparing coefficients
	const [d, c, b, a] = poly.coefficients;
	const [f, e] = factor1.coefficients;
	// a = Ae
	const A = a.divide(e);
	// b = Af + Be
	const B = b.minus(A.times(f)).divide(e);
	// check answer: c = Bf + Ce
	// d = fC
	const C = d.divide(f);
	if (!c.isEqualTo(B.times(f).plus(C.times(e)))) {
		throw new Error(`Error encountered in comparing coefficients: check code`);
	}
	const quadratic = new Polynomial([A, B, C], { unknown: poly.unknown });
	const [root2, root3] = solveQuadratic(quadratic);
	// see if can factorize further
	if (root2 instanceof Fraction && root3 instanceof Fraction) {
		const [factor2, factor3] = factorizeQuadratic(quadratic);
		return [
			[factor1, factor2, factor3],
			[root2, root3],
		];
	}
	return [[factor1, quadratic], null];
}

/**
 * solves a quadratic equation
 *
 * throws [NaN, NaN] if complex roots found: consider using complex solver
 *
 */
export function solveQuadratic(poly: Polynomial): [Fraction, Fraction] | [number, number] {
	if (poly.degree !== 2) {
		throw new Error(`${poly} is not a quadratic polynomial`);
	}
	let [c, b, a] = poly.coefficients;
	if (a.isLessThan(0)) {
		a = a.negative();
		b = b.negative();
		c = c.negative();
	}
	const discriminant = b.square().minus(a.times(c).times(4));
	if (discriminant.valueOf() < 0) {
		return [NaN, NaN];
	}
	const sqrt = new SquareRoot(discriminant);
	if (sqrt.isRational()) {
		const sqrtValue = sqrt.coeff;
		const root1 = b.negative().minus(sqrtValue).divide(2).divide(a);
		const root2 = b.negative().plus(sqrtValue).divide(2).divide(a);
		return [root1, root2];
	}
	// irrational answers
	const sqrtValue = sqrt.valueOf();
	const root1 = (-b.valueOf() - sqrtValue) / 2 / a.valueOf();
	const root2 = (-b.valueOf() + sqrtValue) / 2 / a.valueOf();
	return [root1, root2];
}

/**
 * solves a quadratic equation to give irrational roots in surd form
 *
 * throws if complex roots found: consider using complex solver
 *
 */
export function solveQuadraticSurd(poly: Polynomial): [Expression, Expression] {
	if (poly.degree !== 2) {
		throw new Error(`${poly} is not a quadratic polynomial`);
	}
	const [c, b, a] = poly.coefficients;
	const discriminant = b.square().minus(a.times(c).times(4));
	if (discriminant.valueOf() < 0) {
		throw new Error(`complex roots found: ${poly}`);
	}
	const sqrt = new SquareRoot(discriminant);
	const surd = sqrt.divide(a.times(2));
	const root2 = new Expression(b.negative().divide(a.times(2)), new Term(surd.coeff, `${surd.variable}`));
	const root1 = new Expression(b.negative().divide(a.times(2)), new Term(surd.coeff.negative(), `${surd.variable}`));
	return [root1, root2];
}

/**
 * solves a linear equation
 */
export function solveLinear(poly: Polynomial): Fraction {
	return poly.coefficients[0].negative().divide(poly.coefficients[1]);
}

/**
 * shifts a polynomial: replace x with x+a
 */
export function shiftPoly(poly: Polynomial, a: number | Fraction): Polynomial {
	const xPlusA = poly.ascending
		? new Polynomial([a, 1], { unknown: poly.unknown, ascending: true })
		: new Polynomial([1, a], { unknown: poly.unknown });
	const zero = new Polynomial([0], { unknown: poly.unknown, ascending: poly.ascending });
	return poly.coefficients.reduce((prev, curr, i) => {
		if (i === 0) {
			return prev.plus(curr);
		}
		return prev.plus(xPlusA.pow(i).times(curr));
	}, zero);
}

/**
 * completes the square
 *
 */
export function completeSquare(poly: Polynomial): string {
	if (poly.degree !== 2) {
		throw new Error(`${poly} is not a quadratic polynomial`);
	}
	const [c, b, a] = poly.coefficients;
	const bOver2A = b.divide(a.times(2));
	const perfectSquare = new Polynomial([1, bOver2A], { unknown: poly.unknown });
	const bracketed = bOver2A.isEqualTo(0) ? `${perfectSquare}^2` : `\\left( ${perfectSquare} \\right)^2`;
	const turningPt = c.minus(b.square().divide(4).divide(a));
	const start = a.isEqualTo(1) ? `${bracketed}` : a.isEqualTo(-1) ? `- ${bracketed}` : `${a} ${bracketed}`;
	if (turningPt.isEqualTo(0)) {
		return start;
	} else {
		const sign = turningPt.isGreaterThan(0) ? ` + ` : ``;
		return `${start}${sign}${turningPt}`;
	}
}
