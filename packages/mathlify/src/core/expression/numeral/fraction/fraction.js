import { gcd } from './gcd';

/**
 * Fraction class representing a rational number
 * @property {number} num - the numerator
 * @property {number} den - the denominator
 *
 */
export class Fraction {
	/** @type {number} */
	num;
	/** @type {number} */
	den;
	/**
	 * @constructor
	 * Creates a Fraction instance
	 * @param {number} num - numerator
	 * @param {number} [den=1] - denominator
	 */
	constructor(num, den = 1) {
		if (den === 0) {
			throw new RangeError('0 denominator received in fraction constructor');
		} else if (!Number.isInteger(num) || !Number.isInteger(den)) {
			console.error(`numerator and denominators should be integers. ${num} and ${den} received.`);
			throw new RangeError('non-integers received in Fraction constructor');
		}
		this.num = num;
		this.den = den;
	}

	// simplifies fraction by making
	// denominator positive, hoisting negatives
	// to the numerator if necessary
	// WARNING: mutates current instance
	_hoist_negative() {
		if (this.den < 0) {
			this.num *= -1;
			this.den *= -1;
		}
	}

	// simplifies fraction such that
	// (1) denominators are positive
	// (2) gcd(num, den) = 1
	simplify() {
		this._hoist_negative();
		// extract gcd
		const divisor = gcd(this.num, this.den);
		this.num /= divisor;
		this.den /= divisor;
	}

	/**
	 * @returns {Fraction}
	 */
	clone() {
		return new Fraction(this.num, this.den);
	}

	//! PRIMITIVE RETURN METHODS
	/**
	 * returns the float representation of this fraction
	 * @returns {number}
	 */
	valueOf() {
		return this.num / this.den;
	}

	/**
	 * returns the latex string representing this fraction
	 * @returns {string}
	 */
	toString() {
		const num = this.num < 0 ? `- ${-this.num}` : `${this.num}`;
		if (this.den === 1) {
			return num;
		}
		if (this.den < 0) {
			// \\frac{(sign) num}{(sign) den}
			const den = `- ${-this.den}`;
			return `\\frac{${num}}{${den}}`;
		} else {
			// (sign) \\frac{num}{den}
			const sign = Fraction.sign(this) === 1 ? '' : '- ';
			const num = Math.abs(this.num);
			return `${sign}\\frac{${num}}{${this.den}}`;
		}
	}
	/**
	 * @param {number} digits
	 * @returns {string}
	 */
	toFixed(digits) {
		return this.valueOf().toFixed(digits);
	}
	/**
	 * @param {number} precision
	 * @returns {string}
	 */
	toPrecision(precision) {
		return this.valueOf().toPrecision(precision);
	}

	//! Boolean checks
	is = {
		/**
		 * @returns {boolean}
		 */
		positive: () => this.valueOf() > 0,
		/**
		 * @returns {boolean}
		 */
		negative: () => this.valueOf() < 0,
		/**
		 * @returns {boolean}
		 */
		zero: () => this.valueOf() === 0,
		/**
		 * @returns {boolean}
		 */
		nonzero: () => this.valueOf() !== 0,
		/**
		 * @returns {boolean}
		 */
		integer: () => Number.isInteger(this.valueOf()),
		/**
		 * @returns {boolean}
		 */
		nonnegative: () => this.valueOf() >= 0,
	};

	//! Arithmetic methods
	/**
	 * sum of two fractions
	 * @param {Fraction} x - the fraction to add
	 * @returns {Fraction}
	 */
	plus(x) {
		const sum = new Fraction(this.num * x.den + x.num * this.den, this.den * x.den);
		sum.simplify();
		return sum;
	}

	//! Static methods

	/**
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign
	 * @param {Fraction} frac
	 * @returns {number} 1 or -1, depending on the sign. 0 or -0 are returned as-is.
	 */
	static sign(frac) {
		return Math.sign(frac.valueOf());
	}
}
