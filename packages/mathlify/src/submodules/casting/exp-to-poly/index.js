import { Polynomial } from '../../../core/index.js';
/** @typedef {import('../../../core').Expression} Expression */

/**
 *
 * @param {Expression} exp
 * @param {{variable?: string, ascending?: boolean}} [options]
 * @returns {Polynomial}
 */
export function expressionToPolynomial(exp, options) {
	if (exp instanceof Polynomial) return exp;
	if (exp.node.type === 'numeral') {
		return new Polynomial([exp.node], options);
	} else if (exp.node.type === 'variable') {
		const coeffs = options?.ascending ? [0, 1] : [1, 0];
		return new Polynomial(coeffs, { ...options, variable: exp.node.name });
	} else if (exp.node.type === 'exponent') {
		const n = exp.node.powerExp._getNumeral();
		if (!n.is.integer() || n.is.negative()) throw new Error(`power must be non-negative integer`);
		const base = exp.node.base;
		if (base.type !== 'variable') throw new Error(`base of an exponent must be a variable`);
		return Polynomial.ofDegree(n.valueOf(), { ...options, variable: base.name });
	} else if (exp.node.type === 'product') {
		if (exp.node._factorsExp.length !== 1) throw new Error(`expect only one factor in a product`);
		const factor = exp.node._factorsExp[0];
		return expressionToPolynomial(factor, options).times(exp.node.coeff);
	} else if (exp.node.type === 'sum') {
		// TODO: handle variable for sum;
		const polys = exp.node._termsExp.map((t) => expressionToPolynomial(t, options));
		return polys.reduce((prev, p) => prev.plus(p));
	}
	throw new Error('expression form does not fit a polynomial');
}
