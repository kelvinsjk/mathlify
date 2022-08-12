import { solveQuadraticSurd } from './polynomials';
import { Complex, xComplex } from '../complex';
import { Polynomial, SquareRoot } from '../core';

export function solveQuadraticComplex(poly: Polynomial): [Complex, Complex] | [xComplex, xComplex] {
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
	if (discriminant.valueOf() >= 0) {
		// real roots
		const [root1, root2] = solveQuadraticSurd(poly);
		return [new xComplex(root1, 0), new xComplex(root2, 0)];
	}
	const sqrt = new SquareRoot(discriminant.abs());
	const real = b.negative().divide(2).divide(a);
	if (sqrt.isRational()) {
		const imag = sqrt.coeff.divide(2).divide(a);
		return [new Complex(real, imag.negative()), new Complex(real, imag)];
	}
	// irrational answers
	const imag = sqrt.divide(2).divide(a).abs();
	return [new xComplex(real, imag.negative()), new xComplex(real, imag)];
}
