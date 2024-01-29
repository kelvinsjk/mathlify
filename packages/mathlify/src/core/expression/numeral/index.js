import { Fraction } from './fraction/index.js';
export { Fraction };

/**
 * Numeral class
 * @property {Fraction} number
 */
export class Numeral {
	/**
	 * @constructor
	 * Creates a Numeral
	 * note: fractions are automatically simplified
	 * @param {number|Fraction|[number,number]} number - either the fraction or the numerator of the fraction
	 */
	constructor(number) {
		if (typeof number === 'number') {
			number = new Fraction(number);
		} else if (Array.isArray(number)) {
			number = new Fraction(number[0], number[1]);
		} else {
			number = number.clone();
		}
		this.number = number;
		this.simplify();
	}

	/**
	 * simplifies this fraction
	 * warning: mutates current instance
	 */
	simplify() {
		this.number.simplify();
	}

	/**
	 * @returns {string}
	 */
	toString() {
		return this.number.toString();
	}
}
