import { Variable } from '../variable/index.js';
import { Numeral } from '../numeral/index.js';
import { Expression } from '../index.js';
import { Fraction } from '../numeral/fraction/index.js';
import { Product } from '../product/index.js';
import { Sum } from '../sum/index.js';

/**
 * Quotient Class
 * @property {Expression} num - the numerator
 * @property {Expression} den - the denominator
 * */
export class Quotient {
	/**@type {Expression} */
	num;
	/**@type {Expression} */
	den;
	/**
	 * Creates a Quotient
	 * @param {Expression|Sum|Product|Variable|string|Numeral|Fraction|number} num
	 * @param {Expression|Sum|Product|Variable|string|Numeral|Fraction|number} den
	 */
	constructor(num, den) {
		num = num instanceof Expression ? num : new Expression(num);
		den = den instanceof Expression ? den : new Expression(den);
		this.num = num;
		this.den = den;
	}

	/**
	 * @returns {string}
	 */
	toString() {
		return `\\frac{${this.num}}{${this.den}}`;
	}

	/**
	 * @returns {Quotient}
	 */
	clone() {
		return new Quotient(this.num.clone(), this.den.clone());
	}

	/**
	 * @param {{product?: boolean, numeral?: boolean, sum?: boolean, quotient?: boolean}} [options]
	 * @returns {this}
	 * WARNING: mutates current instance
	 */
	simplify(options) {
		const { product, numeral, sum, quotient } = {
			product: true,
			numeral: true,
			sum: true,
			quotient: true,
			...options,
		};
		if (quotient) {
			this.num.simplify({ product, numeral, sum, quotient });
			this.den.simplify({ product, numeral, sum, quotient });
		}
		return this;
	}
}
