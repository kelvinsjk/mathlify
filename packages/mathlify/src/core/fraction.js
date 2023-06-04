import { gcd, lcm, numberToFraction } from './utils/index.js';

/** Fraction class
 * @property {number} num - the numerator (an integer)
 * @property {number} den - the denominator (a positive integer)
 *
 */
export class Fraction {
	/**
	 * Creates a Fraction instance, automatically hoisting any negatives to the
	 * numerator, and simplifying the numerator and denominator such that
	 * gcd(num, den) == 1
	 * @param {number} num - the numerator (an integer)
	 * @param {number} [den=1] - the denominator (a non-zero integer)
	 */
	constructor(num, den = 1) {
		if (!Number.isInteger(num) || !Number.isInteger(den)) {
			throw new Error(
				`Non-integer {num: ${num}, den:${den}} received in Fraction class constructor`
			);
		}
		if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) {
			throw new Error(
				`Infinity {num: ${num}, den:${den}} received in Fraction class constructor`
			);
		}
		// hoist negative
		if (den < 0) {
			num *= -1;
			den *= -1;
		}
		// gcd
		const divisor = gcd(num, den);
		this.num = num / divisor;
		this.den = den / divisor;
	}

	// PRIMITIVE RETURN TYPES
	/**
	 * casts this fraction as a float
	 * @returns {number} this fraction in js number primitive type
	 */
	valueOf() {
		return this.num / this.den;
	}

	/**
	 * casts this fraction as a latex string
	 * @returns {string} the latex string representation of this fraction
	 */
	toString() {
		if (this.den === 1) {
			return this.num < 0 ? `- ${Math.abs(this.num)}` : `${this.num}`;
		}
		const sign = this.sign() === 1 ? '' : '- ';
		return `${sign}\\frac{${Math.abs(this.num)}}{${this.den}}`;
	}

	//  BOOLEAN METHODS

	/**
	 * checks if this fraction is an integer
	 * @returns {boolean} whether this fraction is an integer
	 */
	isInteger() {
		return this.den === 1;
	}

	/**
	 * checks if two fractions are equal
	 * @param {number|Fraction} x
	 * @returns {boolean}
	 */
	isEqualTo(x) {
		return Math.abs(this.valueOf() - x.valueOf()) < Number.EPSILON;
	}

	/**
	 * checks if two fractions are not equal
	 * @param {number|Fraction} x
	 * @returns {boolean}
	 */
	isNotEqualTo(x) {
		return !this.isEqualTo(x);
	}

	/**
	 * checks if this fraction is greater than x
	 * @param {number|Fraction} x
	 * @returns {boolean}
	 */
	isGreaterThan(x) {
		return this.valueOf() > x.valueOf();
	}

	/**
	 * checks if this fraction is less than x
	 * @param {number|Fraction} x
	 * @returns {boolean}
	 */
	isLessThan(x) {
		return this.valueOf() < x.valueOf();
	}

	/**
	 * checks if this fraction is less than or equal to x
	 * @param {number|Fraction} x
	 * @returns {boolean}
	 */
	isAtMost(x) {
		return !this.isGreaterThan(x);
	}

	/**
	 * checks if this fraction is greater than or equal to x
	 * @param {number|Fraction} x
	 * @returns {boolean}
	 */
	isAtLeast(x) {
		return !this.isLessThan(x);
	}

	// ARITHMETIC METHODS

	/**
	 * the sign of this fraction
	 * @returns {number} 1 if this is positive, 0 if this is zero, and -1 otherwise
	 */
	sign() {
		return this.num < 0 ? -1 : this.num > 0 ? 1 : 0;
	}

	/**
	 * fraction addition
	 * @param {number|Fraction} x
	 * @returns {Fraction} this plus x
	 */
	plus(x) {
		x = numberToFraction(x);
		return new Fraction(this.num * x.den + this.den * x.num, this.den * x.den);
	}

	/**
	 * fraction multiplication
	 * @param {number|Fraction} x
	 * @returns {Fraction} this times x
	 */
	times(x) {
		x = numberToFraction(x);
		return new Fraction(this.num * x.num, this.den * x.den);
	}

	/**
	 * negative
	 * @returns {Fraction} negative of this fraction
	 */
	negative() {
		return this.times(-1);
	}

	/**
	 * fraction subtraction
	 * @param {number|Fraction} x
	 * @returns {Fraction} this minus x
	 */
	minus(x) {
		x = numberToFraction(x);
		return this.plus(x.negative());
	}

	/**
	 * reciprocal
	 * @returns {Fraction} reciprocal of this fraction
	 */
	reciprocal() {
		if (this.num === 0) {
			throw new Error(`cannot take reciprocal of zero`);
		}
		return new Fraction(this.den, this.num);
	}

	/**
	 * fraction division
	 * @param {number|Fraction} x
	 * @returns {Fraction} this divided by x
	 */
	divide(x) {
		x = numberToFraction(x);
		if (x.isEqualTo(0)) {
			throw new Error(`division by zero error`);
		}
		return this.times(x.reciprocal());
	}

	/**
	 * fraction exponentiation
	 * @param {number} n - power/index
	 * @returns {Fraction} this power n
	 */
	pow(n) {
		if (!Number.isInteger(n)) {
			throw new Error(
				`non-integer powers not supported. ${this}^${n} received.`
			);
		}
		let reciprocal = false;
		if (n < 0) {
			n = -n;
			reciprocal = true;
		}
		const newFraction = new Fraction(
			Math.pow(this.num, n),
			Math.pow(this.den, n)
		);
		return reciprocal ? newFraction.reciprocal() : newFraction;
	}

	/**
	 * squares this fraction
	 * @returns {Fraction} this^n
	 */
	square() {
		return this.pow(2);
	}

	/**
	 * absolute value
	 * @returns {Fraction} - the absolute value of this
	 */
	abs() {
		return new Fraction(Math.abs(this.num), this.den);
	}

	// number methods

	/**
	 * rounds off number
	 * @returns {number}
	 */
	round() {
		return Math.round(this.valueOf());
	}

	/**
	 * floor: greatest integer less than or equal to this
	 * @returns {number}
	 */
	floor() {
		return Math.floor(this.valueOf());
	}

	/**
	 * ceil: smallest integer greater than or equal to this
	 * @returns {number}
	 */
	ceil() {
		return Math.ceil(this.valueOf());
	}

	/**
	 * calls the default toFixed number method
	 * @param {number|undefined} fractionDigits - number of digits after the decimal point (0-20 inclusive)
	 * @returns {string}
	 */
	toFixed(fractionDigits) {
		return this.valueOf().toFixed(fractionDigits);
	}
	/**
	 * calls the default toPrecision number method
	 * @param {number|undefined} precision - number of significant digits (1-21 inclusive)
	 * @returns
	 */
	toPrecision(precision) {
		return this.valueOf().toPrecision(precision);
	}

	// toJSON

	/**
	 * @typedef {Object} FractionJSON
	 * @property {string} kind - 'fraction'
	 * @property {number} num - numerator
	 * @property {number} den - denominator
	 * @property {[number, number]} args - array of arguments to reconstruct current fraction
	 */

	/**
	 * serializes object. can be used with the static
	 * `Fraction.FromJSON` method to recreate this fraction
	 * class instance
	 * @returns {FractionJSON}
	 */
	toJSON() {
		return {
			kind: 'fraction',
			num: this.num,
			den: this.den,
			args: [this.num, this.den],
		};
	}

	// STATIC METHODS

	/**
	 * gcd of n fractions. if all fractions are negative, will return a negative number
	 * otherwise returns a positive fraction
	 * @param  {...(Fraction|number)} fractions
	 * @returns {Fraction} negative gcd if all fractions negative, otherwise positive gcd
	 */
	static gcd(...fractions) {
		/** @type {number[]} */
		const nums = [];
		/** @type {number[]} */
		const dens = [];
		/** @type {boolean[]} */
		fractions.forEach((f) => {
			const x = numberToFraction(f);
			nums.push(x.num);
			dens.push(x.den);
		});
		const positiveGcd = new Fraction(gcd(...nums), lcm(...dens));
		return fractions.every((x) => x.valueOf() < 0)
			? positiveGcd.negative()
			: positiveGcd;
	}
	/**
	 * get back Fraction class instance from JSON object
	 * @param {FractionJSON} f - fraction JSON object
	 * @returns {Fraction} fraction class instance
	 */
	static fromJSON(f) {
		return new Fraction(...f.args);
	}

	// STATIC PROPERTIES
	/** 1 in the fraction class */
	static ONE = new Fraction(1);
	/** 0 in the fraction class */
	static ZERO = new Fraction(0);
}
