import { Polynomial } from '../../core/algebra/polynomial/polynomial.js';
import { Expression } from '../../core/algebra/expression/expression.js';
import { castToPoly } from './utils/castToPoly.js';
/**
 * @typedef {import('../../core/fraction.js').Fraction} Fraction
 */
/**
 * solve linear polynomial/equations
 * @param {Polynomial|number|Fraction|Expression} poly - the polynomial to be solved/left hand side of the equation
 * @param {Polynomial|number|Fraction|Expression} [rhs] - the right hand side of the equation (defaults to 0)
 * @returns {Fraction} - the solution
 */
export function solveLinear(poly, rhs = 0) {
	const variable =
		poly instanceof Polynomial
			? poly.variable
			: rhs instanceof Polynomial
			? rhs.variable
			: 'x';
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

//TODO: Implement Interval Class

/**
 * solve linear inequalities
 * @param {Polynomial|number|Fraction|Expression} poly - the polynomial to be solved/left hand side of the equation
 * @param {{rhs?: Polynomial|number|Fraction|Expression, sign?: '<'|'>'|'leq'|'geq'|'\\leq'|'\\geq'}} [options] - options for the rhs of the equation and the sign (defaults to `{rhs: 0, sign: '<'}`)
 * @returns {string} - the solution
 */
export function solveLinearInequality(poly, options) {
	const { rhs = 0, sign = '<' } = options || {};
	const variable =
		poly instanceof Polynomial
			? poly.variable
			: rhs instanceof Polynomial
			? rhs.variable
			: 'x';
	const lhsPoly = castToPoly(poly, { variable });
	const rhsPoly = castToPoly(rhs, { variable });
	const newPoly = lhsPoly.minus(rhsPoly);
	const root = solveLinear(newPoly);
	const x = newPoly.variable;
	const signStr = signSwitch(sign, newPoly.coeffs[1]);
	return `${x} ${signStr} ${root}`;
}

/**
 *
 * @param {"<"|">"|"geq"|"leq"|"\\geq"|'\\leq'} sign
 * @param {Fraction} leadingCoeff
 * @returns {string}
 */
function signSwitch(sign, leadingCoeff) {
	if (leadingCoeff.is.negative()) {
		switch (sign) {
			case '<':
				return '>';
			case '>':
				return '<';
			case 'leq':
				return '\\geq';
			case 'geq':
				return '\\leq';
			case '\\leq':
				return '\\geq';
			case '\\geq':
				return '\\leq';
		}
	}
	if (sign === 'leq' || sign === 'geq') {
		return `\\${sign}`;
	}
	return sign;
}
