import { Sum } from '../sum/index.js';
import { Product } from '../product/index.js';
import { Quotient } from '../quotient/index.js';
import { Numeral } from '../numeral/index.js';

/** @typedef {import('../index.js').ExpressionType} ExpressionType*/
/** @typedef {import('../index.js').Expression} Expression*/

/**
 * @param {Expression} exp
 * @param {{product?: boolean, sum?: boolean, quotient?: boolean}} [options] - options for which types to simplify. all true by default
 * @returns {ExpressionType|undefined}
 */
export function remove_singletons(exp, options) {
	const { product, sum, quotient } = {
		product: true,
		sum: true,
		quotient: true,
		...options,
	};
	if (sum && exp.expression instanceof Sum) {
		if (exp.expression.terms.length === 0) {
			return new Numeral(0);
		} else if (exp.expression.terms.length === 1) {
			return exp.expression.terms[0];
		}
	} else if (product && exp.expression instanceof Product) {
		if (exp.expression._factorsExp.length === 0) {
			return exp.expression.coeff;
		} else if (exp.expression.coeff.is.zero()) {
			return new Numeral(0);
		} else if (exp.expression._factorsExp.length === 1 && exp.expression.coeff.is.one()) {
			return exp.expression.factors[0];
		}
	} else if (quotient && exp.expression instanceof Quotient) {
		if (exp.expression.num.expression instanceof Numeral && exp.expression.num.expression.number.is.zero()) {
			// zero numerator
			return new Numeral(0);
		} else if (exp.expression.den.expression instanceof Numeral && exp.expression.den.expression.number.is.one()) {
			// one denominator
			return exp.expression.num.expression;
		} else if (exp.expression.num.expression instanceof Numeral && exp.expression.den.expression instanceof Numeral) {
			// both numerator and denominator are numerals: change to fraction
			return exp.expression.num.expression.divide(exp.expression.den.expression);
		}
	}
	return undefined;
}
