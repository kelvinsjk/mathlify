import { Product } from '../product/index.js';
import { Sum } from '../sum/index.js';
import { Quotient } from '../quotient/index.js';
/** @typedef {import('../index.js').Expression} Expression */
/** @typedef {import('../index.js').ExpressionType} ExpressionType */

/**
 * expands either products, or products within a sum
 * @param {Expression} expression
 * @param {{verbatim?: boolean, numeratorOnly?: boolean}} [options] - default to automatic simplification
 * numeratorOnly: only expands numerator and leaves denominator as is
 */
export function expand_expression(expression, options) {
	const exp = expression.expression;
	if (exp instanceof Product) {
		for (const factor of exp._factorsExp) {
			factor.expand(options);
		}
		expression._expand_product(options);
	} else if (exp instanceof Sum) {
		for (const term of exp._termsExp) {
			term.expand(options);
		}
		exp._flatten();
	} else if (exp instanceof Quotient) {
		const { numeratorOnly } = { numeratorOnly: false, ...options };
		exp.num.expand(options);
		if (!numeratorOnly) exp.den.expand(options);
	}
}

/**
 *
 * @param {Expression} expression
 * @returns {Sum|undefined}
 */
export function expand_product(expression) {
	const exp = expression.expression;
	if (!(exp instanceof Product)) return undefined;
	/** @type {Sum[]} */
	const sums = [];
	/** @type {Expression[]} */
	const others = [];
	for (const term of exp._factorsExp) {
		if (term.expression instanceof Sum) {
			sums.push(term.expression);
		} else {
			others.push(term);
		}
	}
	if (sums.length === 0 || (sums.length === 1 && exp.coeff.is.one() && exp.factors.length === 1)) return undefined;
	/** @type {Product[]} */
	let terms = sums[0]._termsExp.map((term) => {
		return new Product(term._new_exp(new Product(exp.coeff, ...others, term)).simplify());
	});
	sums.shift();
	for (const sum of sums) {
		/** @type {Product[]} */
		const new_terms = [];
		for (const term of terms) {
			for (const t of sum._termsExp) {
				new_terms.push(term._multiply_into_factors(t).simplify());
			}
		}
		terms = new_terms;
	}
	const termsExp = terms.map((term) => expression._new_exp(term));
	const sum = new Sum(...termsExp).simplify({ product: true, sum: false });
	sum._flatten();
	return sum;
}
