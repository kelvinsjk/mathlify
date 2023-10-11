import { Polynomial, Expression } from '../../core/index.js';
import { castToPoly } from '../utils/castToPoly.js';
/**
 * @typedef {import('../../core/fraction.js').Fraction} Fraction
 */
/**
 * solve linear polynomial/equations
 * @param {Polynomial|number|Fraction|Expression} poly - the polynomial to be solved/left hand side of the equation
 * @param {Polynomial|number|Fraction|Expression} [rhs] - the right hand side of the equation (defaults to 0)
 * @param {{variable?: string}} [options] - options to specify the variable
 * @returns {Fraction} - the solution
 */
export function solveLinear(poly, rhs = 0, options) {
	const variable =
		poly instanceof Polynomial
			? poly.variable
			: rhs instanceof Polynomial
			? rhs.variable
			: options?.variable ?? 'x';
	const lhsPoly = castToPoly(poly, { variable });
	const rhsPoly = castToPoly(rhs, { variable });
	const newPoly = lhsPoly.minus(rhsPoly);
	if (newPoly.degree !== 1) {
		throw new Error(
			`${poly} = ${rhs} does not simplify to a linear polynomial`
		);
	}
	const [a, b] = newPoly.coeffs;
	return a.negative().divide(b);
}
