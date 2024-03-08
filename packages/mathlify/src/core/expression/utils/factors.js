import { Product } from '../product/index.js';
import { Numeral } from '../numeral/index.js';
import { Exponent } from '../exponent/index.js';

/** @typedef {import('../index.js').Expression} Expression */
/** @typedef {import('../index.js').ExpressionType} ExpressionType */

// lcm divide: divides a product by a factor.
// assumes that the divisor is a factor of the product
/**
 *
 * @param {Expression} expression
 * @param {ExpressionType} divisor
 * @returns {Product} - quotient as simplified product
 */
export function divide_by_factor(expression, divisor) {
	if (expression.node.type === 'numeral') {
		if (divisor.type !== 'numeral') throw new TypeError('numeral can only be divided by numeral');
		return new Product(expression.node.divide(divisor));
	}
	const expressionProduct = expression.node instanceof Product ? expression.node : new Product(expression);
	if (divisor instanceof Numeral) {
		return new Product(expressionProduct.coeff.divide(divisor), ...expressionProduct._factorsExp);
	} else if (divisor instanceof Exponent) {
		/** @type {Expression[]} */
		const factors = [];
		for (const expressionFactor of expressionProduct._factorsExp) {
			if (
				expressionFactor.node instanceof Exponent &&
				expressionFactor.node.base.toLexicalString() === divisor.base.toLexicalString() &&
				expressionFactor.node.power instanceof Numeral &&
				divisor.power instanceof Numeral
			) {
				factors.push(
					expression._new_exp(
						new Exponent(
							expressionFactor.node.baseExp.clone(),
							expression._new_exp(expressionFactor.node.power.minus(divisor.power)),
						),
					),
				);
			} else if (
				expressionFactor._to_lexical_string() === divisor.base.toLexicalString() &&
				divisor.power instanceof Numeral
			) {
				factors.push(
					expression._new_exp(
						new Exponent(expressionFactor.clone(), expression._new_exp(new Numeral(1).minus(divisor.power))),
					),
				);
			} else {
				factors.push(expressionFactor);
			}
		}
		return new Product(expressionProduct.coeff, ...factors);
	} else if (divisor instanceof Product) {
		/** @type {Expression[]} */
		const factors = [];
		for (const factor of expressionProduct._factorsExp) {
			let divided = false;
			if (factor.node instanceof Exponent && factor.node.power instanceof Numeral) {
				for (const divisorFactor of divisor.factors) {
					if (
						divisorFactor instanceof Exponent &&
						divisorFactor.base.toLexicalString() === factor.node.base.toLexicalString() &&
						divisorFactor.power instanceof Numeral
					) {
						factors.push(
							expression._new_exp(
								new Exponent(factor.node.baseExp, expression._new_exp(factor.node.power.minus(divisorFactor.power))),
							),
						);
						divided = true;
						break;
					} else if (divisorFactor.toLexicalString() === factor.node.base.toLexicalString()) {
						factors.push(
							expression._new_exp(
								new Exponent(factor.node.baseExp.clone(), expression._new_exp(factor.node.power.minus(1))),
							),
						);
						divided = true;
						break;
					}
				}
			} else {
				for (const divisorFactor of divisor.factors) {
					if (
						divisorFactor instanceof Exponent &&
						factor.node.toLexicalString() === divisorFactor.base.toLexicalString() &&
						divisorFactor.power instanceof Numeral
					) {
						factors.push(
							expression._new_exp(
								new Exponent(factor.clone(), expression._new_exp(new Numeral(1).minus(divisorFactor.power))),
							),
						);
						divided = true;
						break;
					} else if (factor.node.toLexicalString() === divisorFactor.toLexicalString()) {
						divided = true;
						break;
					}
				}
			}
			if (!divided) {
				factors.push(factor);
			}
		}
		return new Product(expressionProduct.coeff.divide(divisor.coeff), ...factors);
	} else {
		/** @type {Expression[]} */
		const factors = [];
		for (const factor of expressionProduct.factors) {
			if (
				factor instanceof Exponent &&
				factor.base.toLexicalString() === divisor.toLexicalString() &&
				factor.power instanceof Numeral
			) {
				factors.push(expression._new_exp(new Exponent(factor.baseExp, expression._new_exp(factor.power.minus(1)))));
			} else if (factor.toLexicalString() !== divisor.toLexicalString()) {
				factors.push(expression._new_exp(factor));
				// remaining case: if factor = divisor, will be divided out, so no need to include in factors
			}
		}
		return new Product(expressionProduct.coeff, ...factors);
	}
}
