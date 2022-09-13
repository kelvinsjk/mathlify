/**
 * applies cover-up rule (only applicable for linear functions)
 *
 * @returns an array of Rational functions
 */

import { Polynomial, Fraction } from '../core';
import { Rational } from './rationalClass';
import { solveLinear, factorizeQuadratic } from '../polynomialMethods';

export function partialFractions(
	denominators: Polynomial | Polynomial[],
	options?: { numerators?: number | Fraction | Polynomial | (number | Fraction | Polynomial)[] },
): Rational[] {
	// make denominators Array
	let unknown: string;
	if (!Array.isArray(denominators)) {
		if (denominators.degree === 1) {
			denominators = [denominators];
		} else if (denominators.degree === 2) {
			const [linear1, linear2] = factorizeQuadratic(denominators);
			denominators = [linear1, linear2];
		} else {
			throw new Error(`only linear or quadratic denominators are supported. ${denominators} received.`);
		}
	}
	unknown = denominators[0].variable;
	// make numerators Array
	const { numerators: numeratorsProvided } = {
		numerators: 1,
		...options,
	};
	let numerators: Polynomial[];
	if (Array.isArray(numeratorsProvided)) {
		numerators = numeratorsProvided.map((x) => toPolynomial(x));
	} else {
		numerators = [toPolynomial(numeratorsProvided)];
	}
	// throws is not proper
	if (numerators.length >= denominators.length) {
		throw new Error(`partial fractions failure: improper fraction detected`);
	}
	// iterate over denominator
	return denominators.map((x, i) => {
		const denArray = denominators as Polynomial[];
		const root = solveLinear(x);
		const remainingDenominators = denArray.filter((_, j) => i !== j);
		const den = remainingDenominators.reduce((prev, curr) => prev.times(curr.subIn(root)), new Fraction(1));
		const num = numerators.reduce((prev, curr) => prev.times(curr.subIn(root)), new Fraction(1));
		const A = num.divide(den);
		return new Rational(A.num, x.times(A.den));
	});
}

function toPolynomial(x: number | Fraction | Polynomial, unknown = 'x') {
	if (typeof x === 'number') {
		x = new Polynomial([x], { variable: unknown });
	} else if (x instanceof Fraction) {
		x = new Polynomial([x.den, -x.num], { variable: unknown });
	}
	return x;
}
