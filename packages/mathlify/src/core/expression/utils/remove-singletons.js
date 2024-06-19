//import { Sum } from '../sum/index.js';
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
	if (sum && exp.node.type === 'sum') {
		if (exp.node.terms.length === 0) {
			return new Numeral(0);
		} else if (exp.node.terms.length === 1) {
			return exp.node.terms[0];
		}
	} else if (product && exp.node.type === 'product') {
		if (exp.node._factorsExp.length === 0) {
			return exp.node.coeff;
		} else if (exp.node.coeff.is.zero()) {
			return new Numeral(0);
		} else if (exp.node._factorsExp.length === 1 && exp.node.coeff.is.one()) {
			return exp.node.factors[0];
		}
	} else if (quotient && exp.node.type === 'quotient') {
		if (exp.node.num.node.type === 'numeral' && exp.node.num.node.number.is.zero()) {
			// zero numerator
			return new Numeral(0);
		} else if (exp.node.den.node.type === 'numeral' && exp.node.den.node.number.is.one()) {
			// one denominator
			return exp.node.num.node;
		} else if (exp.node.num.node.type === 'numeral' && exp.node.den.node.type === 'numeral') {
			// both numerator and denominator are numerals: change to fraction
			return exp.node.num.node.divide(exp.node.den.node);
		} else if (
			(exp.node.num.node.type === 'numeral' && exp.node.num.node.is.negative()) ||
			(exp.node.num.node.type === 'product' && exp.node.num.node.coeff.is.negative())
		) {
			// hoist negative
			return new Product(-1, exp._new_exp(new Quotient(exp.node.num.negative(), exp.node.den)));
		}
	} else if (exp.node.type === 'exponent') {
		if (exp.node.power.type === 'numeral' && exp.node.power.number.is.zero()) {
			return new Numeral(1);
		} else if (exp.node.power.type === 'numeral' && exp.node.power.is.one()) {
			return exp.node.base;
		}
	}
	return undefined;
}
