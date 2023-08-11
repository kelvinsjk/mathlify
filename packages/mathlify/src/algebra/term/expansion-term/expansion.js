// ExpansionTerm represents (exp_1)^n1 (exp_2)^n2 ... (exp_n)^n3, where exp_i are expressions

import { Expression, Fraction, Term } from '../../../core/index.js';

//TODO: allow expression for first term

/**
 * RationalTerm class extending the Term class
 * @property {Term} exp1 - the first expression (currently only supports a single term)
 * @property {Expression} exp2 - the second expression
 * @property {Fraction} coeff - either 1 or -1 to indicate the sign of the term
 * @property {"expansion-term"} kind - mathlify rational class kind
 * @property {"expansion-term"} type - mathlify rational class type
 * @extends Term
 */
export class ExpansionTerm extends Term {
	/** @type {Expression[]} */
	expressions;
	/** @type {Map<string,Fraction>} */
	powerMap;
	/** @type {Term} exp1 - the first expression (currently only supports a single term) */
	exp1;
	/** @type {Expression} exp2 - the second expression */
	exp2;
	/** @type {Fraction} coeff - either 1 or -1 to indicate the sign of the term */
	coeff;
	/** @type {"expansion-term"} kind - mathlify rational class kind */
	kind;
	/** @type {"expansion-term"} type - mathlify rational class type */
	type;

	/**
	 * @constructor
	 * Creates an Expansion Term instance
	 * @param {number|Fraction|string|Term} exp1 - the first expression (currently only supports a single term)
	 * @param {Expression|number|Fraction|string|Term|(number|Fraction|string|Term)[]} exp2 - the second expression
	 * @throws {Error} if denominator is zero
	 */
	constructor(exp1, exp2) {
		let coeff = new Fraction(1);
		if (!(exp1 instanceof Term)) {
			exp1 = new Term(exp1);
		}
		if (exp1.type === 'term' || exp1.type === 'term-frac') {
			if (exp1.coeff.is.negative()) {
				exp1 = exp1.times(-1);
				coeff = coeff.times(-1);
			}
		}
		if (!(exp2 instanceof Expression)) {
			exp2 = Array.isArray(exp2)
				? new Expression(...exp2)
				: new Expression(exp2);
		}
		super(coeff, `${exp1}`, `(${exp2})`);
		this.exp1 = exp1;
		this.exp2 = exp2;
		this.coeff = coeff;
		/** @type {"expansion-term"} */
		this.kind = 'expansion-term';
		/** @type {"expansion-term"} */
		this.type = 'expansion-term';
	}

	/**
	 * resets coeff
	 * should not be used directly: only present to ensure compatibility with Expression class
	 * @returns {ExpansionTerm} - the term with coeff multiplied in
	 */
	//! this method is a bit hacky to get compatibility: may need to rethink
	resetCoeff() {
		return this.times(this.coeff);
	}

	/**
	 * multiplies to exp1.
	 * this method is mainly to ensure compatibility with Expression class
	 * and should not be used directly unless you know what you are doing
	 * @param {number|Fraction|string|Term} x - the other term to multiply with
	 */
	times(x) {
		return new ExpansionTerm(this.exp1.times(x).times(this.coeff), this.exp2);
	}

	/**
	 * expands the expression
	 * @returns {Expression} - the expanded expression
	 */
	expand() {
		return new Expression(
			...this.exp2.terms.map((term) => this.exp1.times(term))
		).times(this.coeff);
	}

	/**
	 * toString
	 * @returns {string} - the LaTeX string representation of the Expression
	 */
	toString() {
		if (`${this.exp1}` === '1') {
			return this.coeff.is.negative()
				? `- \\left( ${this.exp2} \\right)`
				: `\\left( ${this.exp2} \\right)`;
		}
		const sign = this.coeff.is.negative() ? '- ' : '';
		return `${sign}${this.exp1} \\left( ${this.exp2} \\right)`;
	}
}
