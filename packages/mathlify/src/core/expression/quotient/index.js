//import { Expression } from '../index.js';

/** @typedef {import('../index.js').Expression} Expression */
/** @typedef {import('../numeral/index.js').Numeral} Numeral */
/** @typedef {import('../numeral/fraction/index.js').Fraction} Fraction */
/** @typedef {import('../variable/index.js').Variable} Variable */
/** @typedef {import('../sum/index.js').Sum} Sum */
/** @typedef {import('../product/index.js').Product} Product */
/** @typedef {import('../exponent/index.js').Exponent} Exponent*/
/** @typedef {import('../index.js').ExpressionType} ExpressionType */

/**
 * Quotient Class
 * @property {Expression} num - the numerator
 * @property {Expression} den - the denominator
 * */
export class Quotient {
	/** @type {'quotient'} */
	type = 'quotient';
	/**@type {Expression} */
	num;
	/**@type {Expression} */
	den;
	/**
	 * Creates a Quotient
	 * @param {Expression} num
	 * @param {Expression} den
	 */
	constructor(num, den) {
		this.num = num;
		this.den = den;
	}

	/**
	 * @param {{multiplicationSign?: string, mixedFractions?: boolean}} [options] - default to ''
	 * @returns {string}
	 */
	toString(options) {
		return `\\frac{${this.num.toString(options)}}{${this.den.toString(options)}}`;
	}

	/** @returns {string} */
	toLexicalString() {
		return `(${this.num._to_lexical_string()})/(${this.den._to_lexical_string()})`;
	}

	/**
	 * @returns {Quotient}
	 */
	clone() {
		return new Quotient(this.num.clone(), this.den.clone());
	}

	/**
	 * @param {{product?: boolean, numeral?: boolean, sum?: boolean, quotient?: boolean, brackets?: boolean, exponent?: boolean}} [options]
	 * @returns {this}
	 * WARNING: mutates current instance
	 */
	simplify(options) {
		const { product, numeral, sum, quotient, brackets, exponent } = {
			brackets: true,
			product: true,
			numeral: true,
			sum: true,
			quotient: true,
			exponent: true,
			...options,
		};
		this.num.simplify({ product, numeral, sum, quotient, brackets, exponent });
		this.den.simplify({ product, numeral, sum, quotient, brackets, exponent });
		if (quotient) {
			const factor = this.num._gcd(this.den);
			const num = this.num._divide_by_factor(factor);
			const den = this.den._divide_by_factor(factor);
			this.num = num;
			this.den = den;
		}
		return this;
	}

	/**
	 * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
	 * @param {{verbatim: boolean}} options
	 * @returns {Quotient}
	 */
	subIn(scope, options) {
		return new Quotient(this.num.subIn(scope, options), this.den.subIn(scope, options));
	}
}
