import { Product } from '../product/index.js';
import { Numeral } from '../numeral/index.js';
import { Exponent } from '../exponent/index.js';
import { Expression } from '../index.js';

///** @typedef {import('../index.js').Expression} Expression */
/** @typedef {import('../index.js').ExpressionType} ExpressionType */

// lcm divide: divides a product by a factor.
// assumes that the divisor is a factor of the product
/**
 *
 * @param {Expression} quotient
 * @param {ExpressionType} divisor
 * @returns {Product} - quotient as simplified product
 */
export function divide_by_factor(quotient, divisor) {
	if (quotient.expression instanceof Numeral) {
		// assumes that divisor is a numeral
		return new Product()._multiply_into_coeff(quotient.expression.divide(/** @type {Numeral} */ (divisor)));
	}
	const product = quotient.expression instanceof Product ? quotient.expression : new Product(quotient);
	if (divisor instanceof Numeral) {
		return new Product(...product._factorsExp)._multiply_into_coeff(product.coeff.divide(divisor));
	} else if (divisor instanceof Exponent) {
		/** @type {Expression[]} */
		const factors = [];
		for (const factor of product._factorsExp) {
			if (
				factor.expression instanceof Exponent &&
				factor.expression.base.toLexicalString() === divisor.base.toLexicalString() &&
				factor.expression.power instanceof Numeral &&
				divisor.power instanceof Numeral
			) {
				factors.push(
					new Expression(
						new Exponent(factor.expression.baseExp, new Expression(factor.expression.power.minus(divisor.power))),
					),
				);
			} else {
				factors.push(factor);
			}
		}
		return new Product(...factors)._multiply_into_coeff(product.coeff);
	} else if (divisor instanceof Product) {
		/** @type {Expression[]} */
		const factors = [];
		for (const factor of product._factorsExp) {
			let divided = false;
			if (factor.expression instanceof Exponent && factor.expression.power instanceof Numeral) {
				for (const divisorFactor of divisor.factors) {
					if (
						divisorFactor instanceof Exponent &&
						divisorFactor.base.toLexicalString() === factor.expression.base.toLexicalString() &&
						divisorFactor.power instanceof Numeral
					) {
						factors.push(
							new Expression(
								new Exponent(
									factor.expression.baseExp,
									new Expression(factor.expression.power.minus(divisorFactor.power)),
								),
							),
						);
						divided = true;
						break;
					} else if (divisorFactor.toLexicalString() === factor.expression.base.toLexicalString()) {
						factors.push(
							new Expression(new Exponent(factor.expression.baseExp, new Expression(factor.expression.power.minus(1)))),
						);
						divided = true;
						break;
					}
				}
			} else {
				for (const divisorFactor of divisor.factors) {
					if (factor.expression.toLexicalString() === divisorFactor.toLexicalString()) {
						divided = true;
						break;
					}
				}
			}
			if (!divided) {
				factors.push(factor);
			}
		}
		return new Product(...factors)._multiply_into_coeff(product.coeff.divide(divisor.coeff));
	} else {
		/** @type {Expression[]} */
		const factors = [];
		for (const factor of product.factors) {
			if (
				factor instanceof Exponent &&
				factor.base.toLexicalString() === divisor.toLexicalString() &&
				factor.power instanceof Numeral
			) {
				factors.push(new Expression(new Exponent(factor.baseExp, new Expression(factor.power.minus(1)))));
			} else if (factor.toLexicalString() !== divisor.toLexicalString()) {
				factors.push(new Expression(factor));
				// remaining case: if factor = divisor, will be divided out, so no need to include in factors
			}
		}
		return new Product(...factors)._multiply_into_coeff(product.coeff);
	}
}
