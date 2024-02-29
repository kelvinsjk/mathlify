/** @typedef {[number, '/', number]} FractionShorthand */

import { Polynomial, Numeral, Fraction } from '../core/index.js';

/**
 * creates a polynomial
 * by default, the polynomial is of descending order with variable 'x'
 * fraction shorthand: [a, '/', b] represents the fraction a/b
 * @param {(number|FractionShorthand)[]} coeffs
 * @param {{ascending?: boolean, variable?: string}} [options] - defaults to ascending polynomial with variable 'x'
 * @returns {Polynomial}
 */
export function polynomial(coeffs, options) {
	/** @type {Numeral[]} */
	const coeffsNumeral = coeffs.map((coeff) =>
		typeof coeff === 'number' ? new Numeral(coeff) : new Numeral(new Fraction(coeff[0], coeff[2])),
	);
	return new Polynomial(coeffsNumeral, options);
}
