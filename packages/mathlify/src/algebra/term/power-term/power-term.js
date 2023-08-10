// ExpansionTerm represents k(exp)

import { Expression, Fraction, Term } from '../../../core/index.js';
import { numberToFraction } from '../../../utils/toFraction.js';

/**
 * PowerTerm class extending the Term class
 * Represents a term of the form k (exp)^n
 * @property {Expression} exp - the expression under exponentiation
 * @property {Fraction} power - the power n in k (exp)^n
 * @property {Fraction} coeff - the coefficient k in k (exp)^n
 * @property {"power-term"} kind - mathlify rational class kind
 * @property {"power-term"} type - mathlify rational class type
 * @extends Term
 */
export class PowerTerm extends Term {
	/** @type {Expression} */
	exp;
	/** @type {Fraction} */
	power;
	/** @type {Fraction} */
	coeff;
	/** @type {"power-term"} */
	kind;
	/** @type {"power-term"} */
	type;
	/**
	 * @constructor
	 * Creates an Expansion Term instance
	 * @param {Expression|number|Fraction|string|Term|(number|Fraction|string|Term)[]} exp - the expression under exponentiation
	 * @param {number|Fraction} power - the power n in k (exp)^n
	 * @param {{coeff?: number|Fraction}} [options] - options object defaulting to `{coeff: 1}`
	 */
	constructor(exp, power, options) {
		const coeff = numberToFraction(options?.coeff ?? 1);
		if (!(exp instanceof Expression)) {
			exp = Array.isArray(exp) ? new Expression(...exp) : new Expression(exp);
		}
		power = numberToFraction(power);
		super(coeff, { variable: `\\left( ${exp} \\right)`, power });
		this.exp = exp;
		this.power = power;
		this.coeff = coeff;
		/** @type {"power-term"} */
		this.kind = 'power-term';
		/** @type {"power-term"} */
		this.type = 'power-term';
	}

	/**
	 * resets coeff
	 * should not be used directly: only present to ensure compatibility with Expression class
	 * @returns {PowerTerm} - the term with coeff multiplied in
	 */
	resetCoeff() {
		return new PowerTerm(this.exp, this.power, { coeff: 1 });
	}

	/**
	 * multiplies to coeff.
	 * this method is mainly to ensure compatibility with Expression class
	 * and should not be used directly unless you know what you are doing
	 * @param {number|Fraction} x - the other term to multiply with
	 */
	times(x) {
		return new PowerTerm(this.exp, this.power, { coeff: this.coeff.times(x) });
	}

	/**
	 * expands the expression
	 * @returns {Expression} - the expanded expression
	 */
	expand() {
		if (this.power.is.not.integer() || this.power.is.negative()) {
			throw new Error(
				`expansion of non-positive integers not supported at this moment. ${this} received.`
			);
		}
		let exp = new Expression(1);
		for (let i = 0; i < this.power.valueOf(); i++) {
			exp = exp.times(this.exp);
		}
		return exp.times(this.coeff);
	}

	/**
	 * toString
	 * @returns {string} - the LaTeX string representation of the Expression
	 */
	toString() {
		// special case of roots
		if (this.power.is.not.integer() && this.power.is.positive()) {
			const num = this.power.num;
			const den = this.power.den;
			const pow = `${num}`.length > 1 ? `{${num}}` : `${num}`;
			const exp =
				num === 1 ? `${this.exp}` : `\\left( ${this.exp} \\right)^${pow}`;
			const root = den === 2 ? '' : `[${den}]`;
			const rootExp = `\\sqrt${root}{${exp}}`;
			return `${new Term(this.coeff, rootExp)}`;
		}
		return super.toString();
	}
}
