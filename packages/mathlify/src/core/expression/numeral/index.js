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
	 * @param {{verbatim?: boolean}} [options] - default: `{verbatim: false}`
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
	 * @param {{mixedFractions?: boolean}} [options] - default: `{mixedFractions: false}`
	 * @returns {string}
	 */
	toString(options) {
		return this.number.toString(options);
	}

	/**
	 * @returns {string}
	 */
	toLexicalString() {
		return this.toString();
	}

	/**
	 * @returns {Numeral}
	 */
	clone() {
		return new Numeral(this.number.clone(), { verbatim: true });
	}

	// ! arithmetic methods
	/**
	 * @param {Numeral|number|Fraction} x
	 * @returns {Numeral}
	 */
	plus(x) {
		if (typeof x === 'number') {
			x = new Fraction(x);
		} else if (x instanceof Numeral) {
			x = x.number;
		}
		return new Numeral(this.number.plus(x));
	}
	/**
	 * @param {Numeral|number|Fraction} x
	 * @returns {Numeral}
	 */
	times(x) {
		if (typeof x === 'number') {
			x = new Fraction(x);
		} else if (x instanceof Numeral) {
			x = x.number;
		}
		return new Numeral(this.number.times(x));
	}
	/**
	 * @returns {Numeral}
	 */
	reciprocal() {
		return new Numeral(this.number.reciprocal());
	}
	/**
	 * @param {Numeral|number|Fraction} x
	 * @returns {Numeral}
	 */
	divide(x) {
		if (typeof x === 'number') {
			x = new Fraction(x);
		} else if (x instanceof Numeral) {
			x = x.number;
		}
		return new Numeral(this.number.divide(x));
	}
	/** @returns {Numeral} */
	abs() {
		return new Numeral(this.number.abs());
	}
	/** @returns {Numeral} */
	negative() {
		return new Numeral(this.number.negative());
	}
	/**
	 * @returns {this}
	 */
	subIn() {
		return this;
	}

	//! Boolean methods
	is = {
		/** @returns {boolean} */
		one: () => this.number.is.one(),
		/** @returns {boolean} */
		negative_one: () => this.number.is.negative_one(),
		/** @returns {boolean} */
		zero: () => this.number.is.zero(),
		/** @returns {boolean} */
		negative: () => this.number.is.negative(),
		/** @returns {boolean} */
		nonzero: () => this.number.is.nonzero(),
	};

	//! Static methods
	/**
	 * @param {Numeral|number|Fraction} x
	 * @param {Numeral|number|Fraction} y
	 * @returns {Numeral}
	 */
	static min(x, y) {
		if (x.valueOf() <= y.valueOf()) {
			return x instanceof Numeral ? x.clone() : new Numeral(x).clone();
		}
		return y instanceof Numeral ? y.clone() : new Numeral(y).clone();
	}

	//! Static methods
	/**
	 * @param {Numeral|number|Fraction} x
	 * @param {Numeral|number|Fraction} y
	 * @returns {Numeral}
	 */
	static max(x, y) {
		if (x.valueOf() >= y.valueOf()) {
			return x instanceof Numeral ? x.clone() : new Numeral(x).clone();
		}
		return y instanceof Numeral ? y.clone() : new Numeral(y).clone();
	}

	/**
	 * @param {Numeral|number|Fraction} x
	 * @param {Numeral|number|Fraction} y
	 * @returns {Numeral}
	 */
	static gcd(x, y) {
		const xFrac = x instanceof Numeral ? x.number : x instanceof Fraction ? x : new Fraction(x);
		const yFrac = y instanceof Numeral ? y.number : y instanceof Fraction ? y : new Fraction(y);
		return new Numeral(Fraction.gcd(xFrac, yFrac));
	}

	/**
	 * @param {Numeral|number|Fraction} x
	 * @param {Numeral|number|Fraction} y
	 * @returns {Numeral}
	 */
	static lcm(x, y) {
		const xFrac = x instanceof Numeral ? x.number : x instanceof Fraction ? x : new Fraction(x);
		const yFrac = y instanceof Numeral ? y.number : y instanceof Fraction ? y : new Fraction(y);
		return new Numeral(Fraction.lcm(xFrac, yFrac));
	}
}
