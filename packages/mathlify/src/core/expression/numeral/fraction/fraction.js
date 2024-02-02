import { gcd } from './gcd.js';
import { lcm } from './lcm.js';

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

	/**
	 * simplifies fraction by making
	 * denominator positive, hoisting negatives
	 * to the numerator if necessary
	 * @returns {this}
	 * WARNING: mutates current instance
	 *
	 *  */
	_hoist_negative() {
		if (this.den < 0) {
			this.num *= -1;
			this.den *= -1;
		}
		return this;
	}

	/**
	 * simplifies fraction such that
	 * (1) denominators are positive
	 * (2) gcd(num, den) = 1
	 * @returns {this}
	 */
	simplify() {
		this._hoist_negative();
		// extract gcd
		const divisor = gcd(this.num, this.den);
		this.num /= divisor;
		this.den /= divisor;
		return this;
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
	 * @param {{mixedFractions?: boolean}} [options] - default: `{mixedFractions: false}`
	 * @returns {string}
	 */
	toString(options) {
		let { mixedFractions } = { mixedFractions: false, ...options };
		const num = this.num < 0 ? `- ${-this.num}` : `${this.num}`;
		if (this.den === 1) {
			return num;
		}
		if (this.den < 0) {
			// \\frac{(sign) num}{(sign) den}
			const den = `- ${-this.den}`;
			return `\\frac{${num}}{${den}}`;
		}
		// (sign) \\frac{num}{den}
		const sign = Fraction.sign(this) === 1 ? '' : '- ';
		if (mixedFractions && Math.abs(this.valueOf()) > 1) {
			const whole = Math.floor(this.abs().valueOf());
			const num = Math.abs(this.num) % this.den;
			return `${sign}${whole}\\frac{${num}}{${this.den}}`;
		} else {
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
		/** @returns {boolean} */
		positive: () => this.valueOf() > 0,
		/** @returns {boolean} */
		negative: () => this.valueOf() < 0,
		/** @returns {boolean} */
		zero: () => this.valueOf() === 0,
		/** @returns {boolean} */
		nonzero: () => !this.is.zero(),
		/** @returns {boolean} */
		integer: () => Number.isInteger(this.valueOf()),
		/** @returns {boolean} */
		nonnegative: () => this.valueOf() >= 0,
		/** @returns {boolean} */
		one: () => this.num === this.den,
		/** @returns {boolean} */
		negative_one: () => this.num === -this.den,
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
	/**
	 * product of two fractions
	 * @param {Fraction} x - the fraction to multiply
	 * @returns {Fraction}
	 */
	times(x) {
		const product = new Fraction(this.num * x.num, this.den * x.den);
		product.simplify();
		return product;
	}
	/**
	 * reciprocal of this fraction
	 * @returns {Fraction}
	 */
	reciprocal() {
		if (this.is.zero()) throw new RangeError('reciprocal of 0 is undefined');
		const reciprocal = new Fraction(this.den, this.num);
		reciprocal.simplify();
		return reciprocal;
	}
	/**
	 * division
	 * @param {Fraction} x - the fraction to divide by
	 */
	divide(x) {
		if (x.is.zero()) throw new RangeError('division by 0 is undefined');
		return this.times(x.reciprocal());
	}
	/**
	 * absolute value of this fraction
	 * @returns {Fraction}
	 */
	abs() {
		return new Fraction(Math.abs(this.num), Math.abs(this.den));
	}
	/**
	 * negation of this fraction
	 * @returns {Fraction}
	 */
	negative() {
		return new Fraction(-this.num, this.den);
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

	/**
	 * (absolute) gcd of fractions
	 * @param {...Fraction} fractions
	 * @returns {Fraction}
	 */
	static gcd(...fractions) {
		if (fractions.length === 0) {
			throw new RangeError('no fractions received in gcd');
		}
		if (fractions.length === 1) {
			const f = fractions[0];
			if (f.is.zero()) {
				throw new RangeError('gcd(0) is undefined');
			}
			return f.abs();
		}
		if (fractions.length === 2) {
			const [a, b] = fractions;
			return new Fraction(gcd(a.num, b.num), lcm(a.den, b.den)).simplify();
		}
		let divisor = fractions[0];
		fractions.shift();
		for (let frac of fractions) {
			divisor = Fraction.gcd(divisor, frac);
		}
		return divisor;
	}

	/**
	 * lcm of fractions
	 * @param {...(Fraction|number)} fractions
	 * @returns {Fraction}
	 */
	static lcm(...fractions) {
		const fs = fractions.map((f) => (f instanceof Fraction ? f : new Fraction(f)));
		if (fs.length === 0) {
			throw new RangeError('no fractions received in lcm');
		}
		if (fs.length === 1) {
			const f = fs[0];
			if (f.is.zero()) {
				throw new RangeError('lcm(0) is undefined');
			}
			return f.abs();
		}
		if (fs.length === 2) {
			const [a, b] = fs;
			return new Fraction(lcm(a.num, b.num), gcd(a.den, b.den)).simplify();
		}
		let multiple = fs[0];
		fs.shift();
		for (let frac of fs) {
			multiple = Fraction.lcm(multiple, frac);
		}
		return multiple;
	}
}
