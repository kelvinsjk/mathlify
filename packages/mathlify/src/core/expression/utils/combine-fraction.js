import { Expression, Sum, Numeral, Product, Quotient } from '../index.js';
import { divide_by_factor } from './factors.js';
import { denominator_lcm } from './gcd-lcm.js';

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
	for (const term of sum.terms) {
		if (term instanceof Numeral) {
			if (term.is.negative()) {
				const num = new Product(term.abs(), new Expression(den)).simplify();
				const q = new Quotient(num, den);
				terms.push(new Expression(new Product(-1, new Expression(q))));
			} else {
				terms.push(new Expression(new Quotient(new Product(term, new Expression(den)).simplify(), den)));
			}
		} else if (term instanceof Quotient) {
			const multiple = divide_by_factor(denExp, term.den.expression);
			const num = new Expression(
				new Product(term.num, ...multiple._factorsExp)._multiply_into_coeff(multiple.coeff),
			).simplify();
			terms.push(new Expression(new Quotient(num, den)));
		} else if (term instanceof Product && term.coeff.is.negative()) {
			if (term.factors.length === 1 && term.factors[0] instanceof Quotient) {
				const multiple = divide_by_factor(denExp, term.factors[0].den.expression);
				const num = new Expression(
					new Product(multiple.coeff, term.factors[0].num, ...multiple._factorsExp),
				).simplify();
				terms.push(new Expression(new Product(-1, new Expression(new Quotient(num, den)))));
			} else {
				const num = new Product(term.coeff.abs(), ...term._factorsExp, new Expression(den)).simplify();
				const p = new Product(-1, new Expression(new Quotient(num, den)));
				terms.push(new Expression(p));
			}
		} else {
			terms.push(new Expression(new Quotient(new Product(new Expression(term), new Expression(den)).simplify(), den)));
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
	/** @type {(Expression|Product)[]} */
	const terms = [];
	const sum = exp.expression;
	if (!(sum instanceof Sum)) {
		throw new Error('common denominator only supported for sums');
	}
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
			terms.push(new Product(q.num)._multiply_into_coeff(-1));
		}
		//! assumption: no other cases should be possible
	}
	if (den === undefined) return undefined;
	return new Quotient(new Sum(...terms), den);
}
