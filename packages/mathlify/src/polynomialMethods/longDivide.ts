import { Polynomial } from '../core';

/**
 * given p(x)/d(x),
 *
 * @returns [q(x), r(x)]: quotient q(x) and remainder r(x)
 */
export function longDivide(poly: Polynomial, divisor: Polynomial, carryOver?: Polynomial): [Polynomial, Polynomial] {
	carryOver = carryOver || new Polynomial([0], { ascending: poly.ascending, unknown: poly.unknown });
	if (divisor.degree === 0) {
		throw new Error(`Divisor ${divisor} must have degree > 0`);
	}
	if (poly.degree < divisor.degree) {
		return [carryOver, poly];
	}
	const a = poly.coeffs[poly.coeffs.length - 1];
	const b = divisor.coeffs[divisor.coeffs.length - 1];
	const ax = new Polynomial([a], { degree: poly.degree, unknown: poly.unknown });
	return longDivide(
		poly.minus(
			divisor
				.divide(b)
				.times(a)
				.times(new Polynomial([1], { degree: poly.degree - divisor.degree })),
		),
		divisor,
		carryOver.plus(new Polynomial([a.divide(b)], { degree: poly.degree - divisor.degree, unknown: poly.unknown })),
	);
}
