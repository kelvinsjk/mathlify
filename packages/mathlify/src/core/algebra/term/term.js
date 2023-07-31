// a term is a collection of symbols and a coefficient
// we have a coefficient of the Fraction type
// the symbols could be of type
//
// - surds (eg sqrt{2}) (TODO)
// - constants (eg pi, a) (TODO)
// - variable (eg x, x^2) (TODO)
// - functions (eg sin(x)) (TODO)
// we will perform automatic simplification

import { Fraction } from '../..';

/** Term class
 * @property {Fraction} coeff - the coefficient of the term
 * TODO: update the types of the Map properties
 * @property {Map<string,string>} symbols - the denominator (a positive integer)
 * @property {"term"} kind - mathlify fraction class
 * @property {"term"|"term-frac"} kind - mathlify fraction class
 */
export class Term {
	/**
	 * @constructor
	 * Creates a Term instance, automatically simplifying all terms by grouping them together
	 * under a "PowerTerm"
	 * TODO: update different types of symbols
	 * @param {(Fraction|string|number)[]} args - the constituents of the term (either number or fraction or string)
	 */
	constructor(...args) {
		// @type {Map<string,string>}
		const symbols = new Map();
		// @type {Fraction}
		let coeff = new Fraction(1);
		args.forEach((x) => {
			if (typeof x === 'number' || x instanceof Fraction) {
				coeff = coeff.times(x);
			} else {
				// TODO: update different types of symbols
				symbols.set(x, x);
			}
		});
		this.coeff = coeff;
		this.symbols = symbols;
		this.kind = 'term';
		this.type = this.symbols.size === 0 ? 'term-frac' : 'term';
	}

	// PRIMITIVE RETURN TYPES
	/**
	 * casts this term as a latex string
	 * @returns {string} the latex string representation of this term
	 */
	toString() {
		// if no terms, return the coefficient
		if (this.symbols.size === 0) {
			return `${this.coeff}`;
		}
		// TODO: join symbols
		// if there are terms, return the coefficient times the terms
		// special cases: coeff===1, coeff===-1, coeff===0
		if (this.coeff.abs().is.equalTo(1)) {
			return this.coeff.is.equalTo(1) ? `${this.symbols}` : `- ${this.symbols}`;
		}
		if (this.coeff.is.zero()) {
			return '0';
		}
		return `${this.coeff} ${this.symbols}`;
	}
}
