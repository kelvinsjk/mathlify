import { Sum } from '../sum/index.js';
import { Fn, Brackets } from '../fn/index.js';
import { Product } from '../product/index.js';
import { Numeral } from '../numeral/index.js';

/** @typedef {import('../index.js').Expression} Expression */

/**
 * @param {Expression} exp
 */
export function remove_nested_brackets(exp) {
	if (exp.expression instanceof Sum) {
		for (const term of exp.expression._termsExp) {
			if (term.expression instanceof Fn && term.expression.fn instanceof Brackets) {
				term.expression = term.expression.fn.expression.expression;
			} else {
				term._remove_brackets();
			}
		}
	} else if (exp.expression instanceof Product) {
		for (const factor of exp.expression._factorsExp) {
			if (factor.expression instanceof Fn && factor.expression.fn instanceof Brackets) {
				const innerExp = factor.expression.fn.expression.expression;
				if (
					exp.expression.coeff.is.negative() &&
					((innerExp instanceof Product && innerExp.coeff.is.negative()) ||
						(innerExp instanceof Numeral && innerExp.is.negative()))
				) {
					exp.expression.coeff = exp.expression.coeff.negative();
					factor.expression = innerExp.negative();
				} else {
					factor.expression = innerExp;
				}
			} else {
				factor._remove_brackets();
			}
		}
	}
}
