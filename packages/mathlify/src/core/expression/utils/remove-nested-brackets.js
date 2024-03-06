import { Sum } from '../sum/index.js';
import { Fn, Brackets } from '../fn/index.js';
import { Product } from '../product/index.js';
import { Numeral } from '../numeral/index.js';

/** @typedef {import('../index.js').Expression} Expression */

/**
 * @param {Expression} exp
 */
export function remove_nested_brackets(exp) {
	if (exp.node instanceof Sum) {
		for (const term of exp.node._termsExp) {
			if (term.node instanceof Fn && term.node.fn instanceof Brackets) {
				term.node = term.node.fn.expression.node;
			} else {
				term._remove_brackets_();
			}
		}
	} else if (exp.node instanceof Product) {
		for (const factor of exp.node._factorsExp) {
			if (factor.node instanceof Fn && factor.node.fn instanceof Brackets) {
				const innerExp = factor.node.fn.expression.node;
				if (
					exp.node.coeff.is.negative() &&
					((innerExp instanceof Product && innerExp.coeff.is.negative()) ||
						(innerExp instanceof Numeral && innerExp.is.negative()))
				) {
					exp.node.coeff = exp.node.coeff.negative();
					factor.node = innerExp.negative();
				} else {
					factor.node = innerExp;
				}
			} else {
				factor._remove_brackets_();
			}
		}
	}
}
