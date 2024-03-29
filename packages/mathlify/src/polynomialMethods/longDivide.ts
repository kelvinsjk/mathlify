import { Polynomial } from '../core';

/**
 * given p(x)/d(x),
 *
 * @returns {quotient, remainder}
 */
export function longDivide(
	poly: Polynomial,
	divisor: Polynomial,
	carryOver?: Polynomial,
): { quotient: Polynomial; remainder: Polynomial } {
	carryOver = carryOver || new Polynomial([0], { ascending: poly.ascending, variable: poly.variable });
	if (divisor.degree === 0) {
		throw new Error(`Divisor ${divisor} must have degree > 0`);
	}
	if (poly.degree < divisor.degree) {
		return { quotient: carryOver, remainder: poly };
	}
	const a = poly.coeffs[poly.coeffs.length - 1];
	const b = divisor.coeffs[divisor.coeffs.length - 1];
	const ax = new Polynomial([a], { degree: poly.degree, variable: poly.variable });
	return longDivide(
		poly.minus(
			divisor
				.divide(b)
				.times(a)
				.times(new Polynomial([1], { degree: poly.degree - divisor.degree })),
		),
		divisor,
		carryOver.plus(new Polynomial([a.divide(b)], { degree: poly.degree - divisor.degree, variable: poly.variable })),
	);
}
