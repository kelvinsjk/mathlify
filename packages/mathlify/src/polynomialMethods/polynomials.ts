import { Polynomial, Fraction, SquareRoot, numberToFraction, Expression, Term } from '../core/index';

/**
 * simplify a polynomial, returning a simplified polynomial
 * so that all the coefficients are integers, the leading coefficient is positive,
 * and gcd(...coeffs) = 1
 */
export function simplifyPoly(poly: Polynomial): Polynomial {
	let [coeffs] = Fraction.factorize(...poly.coeffs);
	if (coeffs[0].valueOf() < 0) {
		coeffs = coeffs.map((c) => c.negative());
	}
	if (!poly.ascending) {
		coeffs.reverse();
	}
	return new Polynomial(coeffs, { ascending: poly.ascending, variable: poly.variable });
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
	const factor1 = new Polynomial([root1.den, -root1.num], { variable: poly.variable });
	const factor2 = new Polynomial([root2.den, -root2.num], { variable: poly.variable });
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
	const factor1 = new Polynomial([root.den, -root.num], { variable: poly.variable });
	// ax^3 + bx^2 + cx + d = (ex+f)(Ax^2+Bx+C);
	// comparing coefficients
	const [d, c, b, a] = poly.coeffs;
	const [f, e] = factor1.coeffs;
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
	const quadratic = new Polynomial([A, B, C], { variable: poly.variable });
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
export function solveQuadratic(
	poly: Polynomial | (number | Fraction)[],
): [Fraction, Fraction, 'frac'] | [number, number, 'float'] | [number, number, 'NaN'] {
	if (!(poly instanceof Polynomial)) {
		poly = new Polynomial(poly);
	}
	if (poly.degree !== 2) {
		throw new Error(`${poly} is not a quadratic polynomial`);
	}
	let [c, b, a] = poly.coeffs;
	if (a.isLessThan(0)) {
		a = a.negative();
		b = b.negative();
		c = c.negative();
	}
	const discriminant = b.square().minus(a.times(c).times(4));
	if (discriminant.valueOf() < 0) {
		return [NaN, NaN, 'NaN'];
	}
	const sqrt = new SquareRoot(discriminant);
	if (sqrt.isRational()) {
		const sqrtValue = sqrt.coeff;
		const root1 = b.negative().minus(sqrtValue).divide(2).divide(a);
		const root2 = b.negative().plus(sqrtValue).divide(2).divide(a);
		return [root1, root2, 'frac'];
	}
	// irrational answers
	const sqrtValue = sqrt.valueOf();
	const root1 = (-b.valueOf() - sqrtValue) / 2 / a.valueOf();
	const root2 = (-b.valueOf() + sqrtValue) / 2 / a.valueOf();
	return [root1, root2, 'float'];
}

/**
 * solves a quadratic equation to give irrational roots in surd form
 *
 * throws if complex roots found: consider using complex solver
 *
 */
export function solveQuadraticSurd(poly: Polynomial | (number | Fraction)[]): [Expression, Expression] {
	if (!(poly instanceof Polynomial)) {
		poly = new Polynomial(poly);
	}
	if (poly.degree !== 2) {
		throw new Error(`${poly} is not a quadratic polynomial`);
	}
	let [c, b, a] = poly.coeffs;
	if (a.isLessThan(0)) {
		[c, b, a] = [c.negative(), b.negative(), a.negative()];
	}
	const discriminant = b.square().minus(a.times(c).times(4));
	if (discriminant.valueOf() < 0) {
		throw new Error(`complex roots found: ${poly}`);
	}
	const sqrt = new SquareRoot(discriminant);
	const surd = sqrt.divide(a.times(2));
	const root2 = new Expression(b.negative().divide(a.times(2)), new Term(surd.coeff, `${surd.variableString}`));
	const root1 = new Expression(
		b.negative().divide(a.times(2)),
		new Term(surd.coeff.negative(), `${surd.variableString}`),
	);
	return [root1, root2];
}

/**
 * solves a linear equation
 */
export function solveLinear(poly: Polynomial | (number | Fraction)[]): Fraction {
	if (!(poly instanceof Polynomial)) {
		poly = new Polynomial(poly);
	}
	return poly.coeffs[0].negative().divide(poly.coeffs[1]);
}

/**
 * shifts a polynomial: replace x with x+a
 */
export function shiftPoly(poly: Polynomial, a: number | Fraction): Polynomial {
	const xPlusA = poly.ascending
		? new Polynomial([a, 1], { variable: poly.variable, ascending: true })
		: new Polynomial([1, a], { variable: poly.variable });
	const zero = new Polynomial([0], { variable: poly.variable, ascending: poly.ascending });
	return poly.coeffs.reduce((prev, curr, i) => {
		if (i === 0) {
			return prev.plus(curr);
		}
		return prev.plus(xPlusA.pow(i).times(curr));
	}, zero);
}

/**
 * completes the square
 */
export function completeSquare(poly: Polynomial): string {
	if (poly.degree !== 2) {
		throw new Error(`${poly} is not a quadratic polynomial`);
	}
	const { a, completedSquare, c } = completeSquareParams(poly);
	const bOver2A = completedSquare.coeffs[1];
	const bracketed = bOver2A.isEqualTo(0) ? `${completedSquare}^2` : `\\left( ${completedSquare} \\right)^2`;
	const exp = new Expression(new Term(a, `${bracketed}`), c);
	return `${exp}`;
}

/**
 * completes the square
 * returns a (x+b)^2 + c
 * as `{a, completedSquare: (x+b), c}`
 *
 */
export function completeSquareParams(poly: Polynomial): { a: Fraction; completedSquare: Polynomial; c: Fraction } {
	if (poly.degree !== 2) {
		throw new Error(`${poly} is not a quadratic polynomial`);
	}
	const [c1, b1, a] = poly.coeffs;
	const b = b1.divide(2).divide(a);
	const c = c1.minus(b1.square().divide(4).divide(a));
	return { a, c, completedSquare: new Polynomial([1, b], { variable: poly.variable }) };
}
