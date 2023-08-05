// the expression class is a collection of terms under addition
// the termPowerMap contains a map of all the terms that have appeared in the expression in order, but may contain terms with zero coefficients
// the terms array removes any such terms with zero coefficients

// notes: when using rationalTerm within an expression,
// the rational term is lost because the expression constructor tries
// to simplify the expression by combining like terms and reconstruct the
// term afterwards. The reconstruction does not understanding the workings
// of the RationalTerm class and typesetting is lost. TODO: fix this
/** @see RationalTerm  */

import { Fraction } from '../../fraction.js';
import { Term } from '../term/index.js';

/** Expression class
 * @property {Map<string,Fraction>} termCoeffMap - the terms in the expression, where the key is the term signature and the value is the coefficient
 * @property {Map<string,Term>} termAtomMap - the terms in the expression, with coefficient adjusted to 1
 * @property {Term[]} terms - array of terms in the expression
 * @property {"expression"|"polynomial"} kind - mathlify expression class kind
 * @property {"expression"|"expression-term"|"polynomial"|"linear-polynomial"|"quadratic-polynomial"} type - mathlify expression class type
 */
export class Expression {
	/**
	 * @constructor
	 * Creates an Expression instance
	 * TODO: brackets handling
	 * @param {(number|Fraction|string|Term|{term: number|Fraction|string|Term, addition?: boolean}|(number|Fraction|string)[])[]} terms - terms of the expression
	 *
	 * The terms are added by default. Use the {term, addition} type to specify whether to add or subtract the term.
	 */
	constructor(...terms) {
		if (terms.length === 0) {
			throw new Error('Expression must have at least one term');
		}
		/** @type {Map<string,Fraction>} */
		const termCoeffMap = new Map();
		/** @type {Map<string,Term>} */
		const termAtomMap = new Map();
		terms.forEach((term) => {
			if (typeof term === 'number' || term instanceof Fraction) {
				//! numbers/Fractions
				const currentConstant = termCoeffMap.get('') ?? new Fraction(0);
				termCoeffMap.set('', currentConstant.plus(term));
			} else if (typeof term === 'string') {
				//! strings
				const currentConstant = termCoeffMap.get(term) ?? new Fraction(0);
				termCoeffMap.set(term, currentConstant.plus(1));
				if (!termAtomMap.has(term)) {
					termAtomMap.set(term, new Term(term));
				}
			} else if (term instanceof Term || Array.isArray(term)) {
				if (Array.isArray(term)) {
					term = new Term(...term);
				}
				//! Term
				// serialize variables
				const variable = term.signature;
				const currentConstant = termCoeffMap.get(variable) ?? new Fraction(0);
				termCoeffMap.set(variable, currentConstant.plus(term.coeff));
				if (!termAtomMap.has(variable)) {
					termAtomMap.set(variable, term.resetCoeff());
				}
			} else {
				//! {term, addition} type
				if (typeof term.term === 'number' || term.term instanceof Fraction) {
					const currentConstant = termCoeffMap.get('') ?? new Fraction(0);
					if (term.addition === false) {
						termCoeffMap.set('', currentConstant.minus(term.term));
					} else {
						termCoeffMap.set('', currentConstant.plus(term.term));
					}
				} else if (typeof term.term === 'string') {
					const currentConstant =
						termCoeffMap.get(term.term) ?? new Fraction(0);
					if (term.addition === false) {
						termCoeffMap.set(term.term, currentConstant.minus(1));
					} else {
						termCoeffMap.set(term.term, currentConstant.plus(1));
					}
					if (!termAtomMap.has(term.term)) {
						termAtomMap.set(term.term, new Term(term.term));
					}
				} else {
					// term.term of Term type
					const variable = term.term.signature;
					const currentConstant = termCoeffMap.get(variable) ?? new Fraction(0);
					if (term.addition === false) {
						termCoeffMap.set(variable, currentConstant.minus(term.term.coeff));
					} else {
						termCoeffMap.set(variable, currentConstant.plus(term.term.coeff));
					}
					if (!termAtomMap.has(variable)) {
						termAtomMap.set(variable, term.term.resetCoeff());
					}
				}
			}
		});
		this.termCoeffMap = termCoeffMap;
		this.termAtomMap = termAtomMap;
		/** @type {Term[]} */
		const termsArray = [];
		//! recreate terms from termCoeffMap and termAtomMap
		termCoeffMap.forEach((coeff, variable) => {
			if (coeff.is.not.zero()) {
				if (variable === '') {
					// constant term
					termsArray.push(new Term(coeff));
				} else {
					const newTerm = this.termAtomMap.get(variable);
					if (newTerm) {
						termsArray.push(newTerm.times(coeff));
					}
				}
			}
		});
		this.terms = termsArray;
		/** @type {"expression"|"polynomial"} */
		this.kind = 'expression';
		/** @type {"expression"|"expression-term"|"polynomial"|"linear-polynomial"|"quadratic-polynomial"} */
		this.type = this.terms.length <= 1 ? 'expression-term' : 'expression';
	}

	/**
	 * Expression addition
	 * @param {number|Fraction|string|Term|Expression} x - term/expression to be added
	 * @returns {Expression} - the sum of the two
	 */
	plus(x) {
		if (x instanceof Expression) {
			return new Expression(...this.terms, ...x.terms);
		}
		return new Expression(...this.terms, x);
	}

	/**
	 * negative
	 * @returns {Expression} the negative of the expression
	 */
	negative() {
		return new Expression(...this.terms.map((term) => term.negative()));
	}

	/** subtract terms from this Expression
	 * @param {number|Fraction|string|Term|Expression} x - term to be subtracted
	 * @returns {Expression} - the difference this minus x
	 */
	minus(x) {
		if (typeof x === 'number' || typeof x === 'string') {
			x = new Term(x);
		}
		return this.plus(x.negative());
	}

	/**
	 * expression multiplication
	 * @param {number|Fraction|string|Term|Expression} x - term to be multiplied
	 * @returns {Expression} - the product
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
	 * expression division
	 * @param {number|Fraction|string|Term} x - term to be divided
	 * @param {{fractionalDisplayMode: "always"|"auto"|"never"}} [options] - whether to display the term as a fraction (default: false) (3/5 x by default, 3x/5 if true)
	 * @returns {Expression} - the quotient
	 */
	divide(x, options) {
		if (!(x instanceof Term)) {
			x = new Term(x);
		}
		return this.times(x.reciprocal(options));
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

	/**
	 * gcd of the expression (only supports Fractions at the moment)
	 * @return {Fraction} - the gcd of all the terms
	 */
	gcd() {
		if (this.terms.length === 0) {
			throw new Error(`gcd is not defined for the 0 expression`);
		}
		return Fraction.gcd(...this.terms.map((term) => term.coeff));
	}

	/**
	 * boolean methods for this expression
	 */
	is = {
		/**
		 * @returns {boolean} - whether this expression is a singleton (ie can be cast to Term class)
		 * */
		term: () => this.terms.length <= 1,

		/**
		 * @returns {boolean} - whether this expression is a constant (ie can be cast to Fraction class)
		 * */
		constant: () =>
			this.terms.length === 0 ||
			(this.terms.length === 1 && this.terms[0].is.constant()),
	};

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
