import { Polynomial, Expression } from '../../core/index.js';
import { castToPoly } from '../utils/castToPoly.js';
import { ExpansionTerm } from '../term/index.js';
/**
 * @typedef {import('../../core/fraction.js').Fraction} Fraction
 */

/**
 * complete the square
 * @param {Polynomial|Expression} poly - the quadratic polynomial
 * @returns {Expression} -
 */
export function completeSquare(poly) {
	const newPoly = castToPoly(poly);
	if (newPoly.degree !== 2) {
		throw new Error(`${poly} is not a quadratic polynomial`);
	}
	const [c, b, a] = newPoly.coeffs;
	const linear = new Polynomial([1, b.divide(2).divide(a)], {
		variable: newPoly.variable,
	});
	return new Expression(
		new ExpansionTerm(a, [linear, 2]),
		c.minus(b.square().divide(a).divide(4))
	);
}
