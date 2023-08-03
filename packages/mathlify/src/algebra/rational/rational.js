// the termPowerMap contains a map of all the terms that have appeared in the expression in order, but may contain terms with zero coefficients
// the terms array removes any such terms with zero coefficients

import { Expression, Fraction, Term } from '../../core/index.js';

// TODO: hoist negative denominator

/** Expression class
 * @property {Expression} numerator - the numerator of the term
 * @property {Expression} denominator - the denominator of the term
 * @property {"rational"} kind - mathlify rational class kind
 * @property {"rational"|"rational-expression"} type - mathlify rational class type
 */
export class RationalTerm {
	/**
	 * @constructor
	 * Creates a Rational Term instance
	 * @param {((number|Fraction|string|Term|{term: number|Fraction|string|Term, addition?: boolean}|(number|Fraction|string)[])[])|Expression} numerator - the numerator
	 * @param {((number|Fraction|string|Term|{term: number|Fraction|string|Term, addition?: boolean}|(number|Fraction|string)[])[])|Expression} denominator - the denominator
	 */
	constructor(numerator, denominator) {
		if (!(numerator instanceof Expression)) {
			numerator = Array.isArray(numerator)
				? new Expression(...numerator)
				: new Expression(numerator);
		}
		if (!(denominator instanceof Expression)) {
			denominator = Array.isArray(denominator)
				? new Expression(...denominator)
				: new Expression(denominator);
		}
		if (`${denominator}` === '0') {
			throw new Error('denominator cannot be zero');
		}
		this.numerator = numerator;
		this.denominator = denominator;
		this.kind = 'rational';
		this.type = `${denominator}` === '1' ? 'rational-expression' : 'rational';
	}

	/** add terms to this Expression
	 * @param {number|Fraction|string|Term} x - term to be added
	 * @returns {Expression} - the new Expression
	 */
	plus(x) {
		return new Expression(...this.terms, x);
	}

	/** subtract terms from this Expression
	 * @param {number|Fraction|string|Term} x - term to be subtracted
	 * @returns {Expression} - the new Expression
	 */
	minus(x) {
		return new Expression(...this.terms, { term: x, addition: false });
	}

	/**
	 * expression multiplication
	 * @param {number|Fraction|string|Term|Expression} x - term to be multiplied
	 * @returns {Expression} - the new Expression
	 */
	times(x) {
		if (x instanceof Expression) {
			/** @type {Term[]} */
			const newTerms = [];
			this.terms.forEach((term) => {
				x.terms.forEach((xTerm) => {
					newTerms.push(term.times(xTerm));
				});
			});
			return new Expression(...newTerms);
		}
		const newTerms = this.terms.map((term) => term.times(x));
		return new Expression(...newTerms);
	}

	/**
	 * sub in a value for a variable
	 * @param {{[key: string]: number|Fraction}|number|Fraction} variableToValue - the values to sub in with the key being the variable signature.
	 * @returns {Expression} - the new Expression
	 */
	subIn(variableToValue) {
		const newTerms = this.terms.map((term) => term.subIn(variableToValue));
		return new Expression(...newTerms);
	}

	/** methods to cast this term to other types */
	cast = {
		/**
		 * cast to Term type
		 * @returns {Term} the term representation of this term
		 */
		toTerm: () => {
			if (this.terms.length === 0) {
				return new Term(0);
			} else if (this.terms.length === 1) {
				return this.terms[0];
			}
			throw new Error(`cannot cast ${this} to Term: more than 1 term detected`);
		},
		/**
		 * cast to Fraction type
		 * @returns {Fraction} the fraction representation of this term
		 */
		toFraction: () => {
			if (this.terms.length === 0) {
				return new Fraction(0);
			} else if (this.terms.length === 1) {
				return this.terms[0].cast.toFraction();
			}
			throw new Error(
				`cannot cast ${this} to Fraction: more than 1 term detected`
			);
		},
	};

	/** toString
	 * @returns {string} - the LaTeX string representation of the Expression
	 */
	toString() {
		if (this.terms.length === 0) {
			return '0';
		}
		return this.terms.reduce((prev, term, i) => {
			if (i !== 0 && term.coeff.is.positive()) {
				return `${prev} + ${term}`;
			}
			const space = i === 0 ? '' : ' ';
			return `${prev}${space}${term}`;
		}, '');
	}
}
