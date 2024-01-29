import { Fraction } from './fraction/index.js';
export { Fraction };

/**
 * Numeral class
 * @property {Fraction} number
 */
export class Numeral {
	/** @type {Fraction} */
	number;
	/**
	 * @constructor
	 * Creates a Numeral
	 * note: fractions are automatically simplified by default
	 * @param {number|Fraction|[number,number]} number - either the fraction or the numerator of the fraction
	 * @param {{verbatim: boolean}} [options] - default: `{verbatim: false}`
	 */
	constructor(number, options) {
		if (typeof number === 'number') {
			number = new Fraction(number);
		} else if (Array.isArray(number)) {
			number = new Fraction(number[0], number[1]);
		} else {
			number = number.clone();
		}
		this.number = number;
		const { verbatim } = { verbatim: false, ...options };
		if (!verbatim) this.simplify();
	}

	/**
	 * simplifies this fraction
	 * warning: mutates current instance
	 * @returns {this}
	 */
	simplify() {
		this.number.simplify();
		return this;
	}

	/**
	 * @returns {string}
	 */
	toString() {
		return this.number.toString();
	}

	/**
	 * @returns {Numeral}
	 */
	clone() {
		return new Numeral(this.number.clone(), { verbatim: true });
	}
}
