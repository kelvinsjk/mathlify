import { Polynomial } from '../../../core/algebra/polynomial/polynomial.js';
import { Expression } from '../../../core/algebra/expression/expression.js';
import { castExpression } from '../../expression/cast/cast-expression.js';

/**
 * @typedef {import('../../../core/fraction.js').Fraction} Fraction
 */

/**
 * @param {Polynomial|number|Fraction|Expression} poly - the polynomial
 * @param {{variable?: string}} [options] - options for the polynomial (default: {variable: 'x'}), ignored if poly is a Polynomial
 * @returns {Polynomial} - the polynomial
 */
export function castToPoly(poly, options) {
	return poly instanceof Polynomial
		? poly
		: poly instanceof Expression
		? castExpression.toPolynomial(poly, options)
		: new Polynomial([poly], { variable: options?.variable ?? 'x' });
}
