import { Sum } from '../sum/index.js';
import { Numeral } from '../numeral/index.js';
import { Product } from '../product/index.js';
import { Quotient } from '../quotient/index.js';
import { divide_by_factor } from './factors.js';
import { denominator_lcm } from './gcd-lcm.js';

/** @typedef {import('../index.js').Expression} Expression  */

/**
 * @param {Expression} exp
 */
export function common_denominator(exp) {
	const sum = exp.expression;
	if (!(sum instanceof Sum)) throw new Error('common denominator only supported for sums');
	const denExp = denominator_lcm(...sum._termsExp);
	const den = denExp.expression;
	if (den instanceof Numeral && den.is.one()) {
		return;
	}
	/** @type {Expression[]} */
	const terms = [];
	// for circular dependency workaround
	const dummy = sum._termsExp[0];
	for (const term of sum.terms) {
		if (term instanceof Numeral) {
			if (term.is.negative()) {
				const num = new Product(term.abs(), dummy._new_exp(den)).simplify();
				const q = new Quotient(dummy._new_exp(num), dummy._new_exp(den));
				terms.push(dummy._new_exp(new Product(-1, dummy._new_exp(q))));
			} else {
				terms.push(
					dummy._new_exp(
						new Quotient(dummy._new_exp(new Product(term, dummy._new_exp(den)).simplify()), dummy._new_exp(den)),
					),
				);
			}
		} else if (term instanceof Quotient) {
			const multiple = divide_by_factor(denExp, term.den.expression);
			const num = dummy._new_exp(new Product(multiple.coeff, term.num, ...multiple._factorsExp)).simplify();
			terms.push(dummy._new_exp(new Quotient(num, dummy._new_exp(den))));
		} else if (term instanceof Product && term.coeff.is.negative()) {
			if (term.factors.length === 1 && term.factors[0] instanceof Quotient) {
				const multiple = divide_by_factor(denExp, term.factors[0].den.expression);
				const num = dummy
					._new_exp(new Product(multiple.coeff, term.factors[0].num, ...multiple._factorsExp))
					.simplify();
				terms.push(dummy._new_exp(new Product(-1, dummy._new_exp(new Quotient(num, dummy._new_exp(den))))));
			} else {
				const num = new Product(term.coeff.abs(), ...term._factorsExp, dummy._new_exp(den)).simplify();
				const p = new Product(-1, dummy._new_exp(new Quotient(dummy._new_exp(num), dummy._new_exp(den))));
				terms.push(dummy._new_exp(p));
			}
		} else {
			terms.push(
				dummy._new_exp(
					new Quotient(
						dummy._new_exp(new Product(dummy._new_exp(term), dummy._new_exp(den)).simplify()),
						dummy._new_exp(den),
					),
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
	const sum = exp.expression;
	if (!(sum instanceof Sum)) {
		throw new Error('common denominator only supported for sums');
	}
	const dummy = sum._termsExp[0];
	/** @type {Expression|undefined} */
	let den = undefined;
	for (const term of sum.terms) {
		if (term instanceof Quotient) {
			den = den ?? term.den;
			terms.push(term.num);
		} else if (
			term instanceof Product &&
			term.coeff.is.negative() &&
			term.factors.length === 1 &&
			term.factors[0] instanceof Quotient
		) {
			const q = term.factors[0];
			den = den ?? q.den;
			terms.push(dummy._new_exp(new Product(-1, q.num)));
		}
		//! assumption: no other cases should be possible
	}
	if (den === undefined) return undefined;
	return new Quotient(dummy._new_exp(new Sum(...terms)), den);
}
