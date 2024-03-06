import { Product } from '../product/index.js';
import { Sum } from '../sum/index.js';
import { Quotient } from '../quotient/index.js';
import { Exponent } from '../exponent/index.js';
import { Numeral } from '../numeral/index.js';
/** @typedef {import('../index.js').Expression} Expression */
/** @typedef {import('../index.js').ExpressionType} ExpressionType */

/**
 * expands either products, products within a sum/quotient, or exponents with positive integral powers
 * @param {Expression} expression
 * @param {{verbatim?: boolean, numeratorOnly?: boolean}} [options] - default to automatic simplification after expansion, and expands both numerator and denominator
 */
export function expand_expression_(expression, options) {
	const node = expression.node;
	if (node instanceof Product) {
		for (const factor of node._factorsExp) {
			factor._expand_(options);
		}
		expression._expand_product_(options);
	} else if (node instanceof Sum) {
		for (const term of node._termsExp) {
			term._expand_(options);
		}
		node._flatten();
	} else if (node instanceof Quotient) {
		node.num._expand_(options);
		if (!options?.numeratorOnly) node.den._expand_(options);
	} else if (
		node instanceof Exponent &&
		node.power instanceof Numeral &&
		node.power.is.integer() &&
		node.power.is.positive()
	) {
		const sum = expand_product(
			expression._new_exp(
				new Product(
					...Array.from({ length: node.power.valueOf() }, () => node.baseExp.clone()),
					//	...Array(exp.power.valueOf())
					//		.fill(exp.baseExp)
					//		.map((b) => b.clone()),
				),
			),
		);
		if (sum !== undefined) {
			expression.node = sum;
		}
	}
}

/**
 *
 * @param {Expression} expression
 * @returns {Sum|undefined}
 */
export function expand_product(expression) {
	const exp = expression.node;
	if (!(exp instanceof Product)) return undefined;
	/** @type {Sum[]} */
	const sums = [];
	/** @type {Expression[]} */
	const others = [];
	for (const term of exp._factorsExp) {
		if (term.node instanceof Sum) {
			sums.push(term.node);
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
				new_terms.push(new Product(term.coeff, ...term._factorsExp, t).simplify());
			}
		}
		terms = new_terms;
	}
	const termsExp = terms.map((term) => expression._new_exp(term));
	const sum = new Sum(...termsExp).simplify({ product: true, sum: false });
	sum._flatten();
	return sum;
}
