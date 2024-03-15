import { Sum } from '../sum/index.js';
//import { Numeral } from '../numeral/index.js';
import { Product } from '../product/index.js';
import { Quotient } from '../quotient/index.js';
import { divide_by_factor } from './factors.js';
import { denominator_lcm } from './gcd-lcm.js';

/** @typedef {import('../index.js').Expression} Expression  */

/**
 * @param {Expression} exp
 * @returns {void}
 */
export function common_denominator_(exp) {
	const sum = exp.node;
	if (!(sum.type === 'sum')) return;
	const denExp = denominator_lcm(...sum._termsExp);
	const den = denExp.node;
	if (den.type === 'numeral' && den.is.one()) {
		return;
	}
	/** @type {Expression[]} */
	const terms = [];
	for (const term of sum.clone().terms) {
		if (term.type === 'numeral') {
			if (term.is.negative()) {
				const num = new Product(term.abs(), exp._new_exp(den)).simplify();
				const q = new Quotient(exp._new_exp(num), exp._new_exp(den));
				terms.push(exp._new_exp(new Product(-1, exp._new_exp(q))));
			} else {
				terms.push(
					exp._new_exp(new Quotient(exp._new_exp(new Product(term, exp._new_exp(den)).simplify()), exp._new_exp(den))),
				);
			}
		} else if (term.type === 'quotient') {
			const multiple = divide_by_factor(denExp, term.den.node);
			const num = exp._new_exp(new Product(multiple.coeff, term.num, ...multiple._factorsExp)).simplify();
			terms.push(exp._new_exp(new Quotient(num, exp._new_exp(den))));
		} else if (term.type === 'product' && term.coeff.is.negative()) {
			if (term.factors.length === 1 && term.factors[0] instanceof Quotient) {
				const multiple = divide_by_factor(denExp, term.factors[0].den.node);
				const num = exp._new_exp(new Product(multiple.coeff, term.factors[0].num, ...multiple._factorsExp)).simplify();
				terms.push(exp._new_exp(new Product(-1, exp._new_exp(new Quotient(num, exp._new_exp(den))))));
			} else {
				const num = new Product(term.coeff.abs(), ...term._factorsExp, exp._new_exp(den)).simplify();
				const p = new Product(-1, exp._new_exp(new Quotient(exp._new_exp(num), exp._new_exp(den))));
				terms.push(exp._new_exp(p));
			}
		} else {
			terms.push(
				exp._new_exp(
					new Quotient(exp._new_exp(new Product(exp._new_exp(term), exp._new_exp(den)).simplify()), exp._new_exp(den)),
				),
			);
		}
	}
	sum._termsExp = terms;
}

/**
 *
 * @param {Expression} exp
 * @returns {Quotient|undefined}
 */
export function combine_fraction(exp) {
	/** @type {(Expression)[]} */
	const terms = [];
	const sum = exp.node;
	if (!(sum.type === 'sum')) {
		//console.warn('common denominator only supported for sums')
		return undefined;
	}
	/** @type {Expression|undefined} */
	let den = undefined;
	for (const term of sum.terms) {
		if (term.type === 'quotient') {
			den = den ?? term.den;
			terms.push(term.num);
		} else if (
			term.type === 'product' &&
			term.coeff.is.negative() &&
			term.factors.length === 1 &&
			term.factors[0].type === 'quotient'
		) {
			const q = term.factors[0];
			den = den ?? q.den;
			terms.push(exp._new_exp(new Product(-1, q.num)));
		}
		//! assumption: no other cases should be possible
	}
	if (den === undefined) return undefined;
	return new Quotient(exp._new_exp(new Sum(...terms)), den);
}
