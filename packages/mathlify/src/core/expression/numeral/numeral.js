import { Fraction } from './fraction/fraction.js';
import { Float } from './float/float.js';
/** @typedef {import('../expression.js').Variable} Variable */

/**
 * The `Numeral` class represents a number.
 * At the moment, this is a wrapper around the `Fraction` class,
 * though we may add support for floats in the future
 *
 * @property {'numeral'} type
 * @property {Fraction|Float} number
 */
export class Numeral {
	/** @type {'numeral'} */
	type = 'numeral';
	/** @type {Fraction|Float} */
	number;
	/**
	 * @constructor
	 * Creates a `Numeral` instance (supports only fractions at the moment)
	 * @param {number|Fraction|Float|[number,number]} number
	 * @param {{verbatim?: boolean}} [options] - options to override default simplification behavior
	 */
	constructor(number, options) {
		if (typeof number === 'number') {
			number = Number.isInteger(number) ? new Fraction(number) : new Float(number);
		} else if (Array.isArray(number)) {
			number = new Fraction(number[0], number[1]);
		} else {
			number = number.clone();
		}
		this.number = number.simplify(options);
	}

	/**
	 * Simplifies this numeral/fraction
	 * @param {import('../expression.js').SimplifyOptions} [options]
	 * @returns {Numeral}
	 */
	simplify(options) {
		return new Numeral(this.number.simplify(options));
	}

	/** @returns {number} */
	valueOf() {
		return this.number.valueOf();
	}

	/**
	 * Returns the LaTeX string representation of this numeral
	 * @returns {string}
	 */
	toString() {
		return this.number.toString();
	}

	/**
	 * @returns {string}
	 */
	_to_lexical_string() {
		return this.toString();
	}

	/**
	 * @returns {Numeral}
	 */
	clone() {
		return new Numeral(this.number.clone(), { verbatim: true });
	}

	// * Arithmetic methods
	/**
	 * @param {Numeral|number|Fraction|Float} x
	 * @returns {Numeral}
	 */
	plus(x) {
		if (this.number instanceof Fraction) {
			if ( (typeof x === 'number' && Number.isInteger(x)) || x instanceof Fraction || (x instanceof Numeral && x.number instanceof Fraction)) {
				return new Numeral(this.number.plus(numberToFraction(x)));
			}
		}
		return new Numeral(this.valueOf() + x.valueOf());
	}
	/** @returns {Numeral} */
	negative() {
		return new Numeral(this.number.negative());
	}
	/**
	 * @param {Numeral|number|Fraction|Float} x
	 * @returns {Numeral}
	 * */
	minus(x) {
		if (this.number instanceof Fraction) {
			if ( (typeof x === 'number' && Number.isInteger(x)) || x instanceof Fraction || (x instanceof Numeral && x.number instanceof Fraction)) {
				return new Numeral(this.number.minus(numberToFraction(x)));
			}
		}
		return new Numeral(this.valueOf() - x.valueOf());
	}
	/**
	 * @param {Numeral|number|Fraction|Float} x
	 * @returns {Numeral}
	 */
	times(x) {
		if (this.number instanceof Fraction) {
			if ( (typeof x === 'number' && Number.isInteger(x)) || x instanceof Fraction || (x instanceof Numeral && x.number instanceof Fraction)) {
				return new Numeral(this.number.times(numberToFraction(x)));
			}
		}
		return new Numeral(this.valueOf() * x.valueOf());
	}
	/**
	 * @returns {Numeral}
	 */
	reciprocal() {
		return new Numeral(this.number.reciprocal());
	}
	/**
	 * @param {Numeral|number|Fraction|Float} x
	 * @returns {Numeral}
	 */
	divide(x) {
		if (this.number instanceof Fraction) {
			if ( (typeof x === 'number' && Number.isInteger(x)) || x instanceof Fraction || (x instanceof Numeral && x.number instanceof Fraction)) {
				return new Numeral(this.number.divide(numberToFraction(x)));
			}
		}
		if (x.valueOf() === 0) {
			throw new RangeError('Cannot divide by 0');
		}
		return new Numeral(this.valueOf() / x.valueOf());
	}
	/** @returns {Numeral} */
	abs() {
		return new Numeral(this.number.abs());
	}
	/**
	 * @param {Numeral|number|Fraction|Float} n
	 * @returns {Numeral}
	 */
	pow(n) {
		if (this.number instanceof Fraction) {
			if ( (typeof n === 'number' && Number.isInteger(n)) || n instanceof Fraction || (n instanceof Numeral && n.number instanceof Fraction)) {
				return new Numeral(this.number.pow(numberToFraction(n)));
			}
		}
		return new Numeral(this.valueOf() ** n.valueOf());
	}
	/**
	 * @returns {Numeral}
	 */
	square() {
		return this.times(this);
	}
	/**
	 * @returns {Numeral}
	 */
	subIn() {
		return this.clone();
	}

	/**
	 * @param {number} _x
	 * @param {string|Variable} [_variable]
	 * @returns {number}
	 */
	fn = (_x, _variable) => {
		return this.valueOf();
	};

	// * Boolean methods
	is = {
		/** @returns {boolean} */
		one: () => this.number.is.one(),
		/** @returns {boolean} */
		negative_one: () => this.number.is.negative_one(),
		/** @returns {boolean} */
		zero: () => this.number.is.zero(),
		/** @returns {boolean} */
		nonzero: () => this.number.is.nonzero(),
		/** @returns {boolean} */
		positive: () => this.number.is.positive(),
		/** @returns {boolean} */
		negative: () => this.number.is.negative(),
		/** @returns {boolean} */
		non_negative: () => this.number.is.non_negative(),
		/** @returns {boolean} */
		integer: () => this.number.is.integer(),
		/**
		 * @param {number|Numeral|Fraction} x
		 * @returns {boolean} */
		equalTo: (x) => this.minus(x).is.zero(),
		/**
		 * @param {number|Numeral|Fraction} x
		 * @returns {boolean} */
		lessThan: (x) => this.minus(x).is.negative(),
		/**
		 * @param {number|Numeral|Fraction} x
		 * @returns {boolean} */
		moreThan: (x) => this.minus(x).is.positive(),
		/**
		 * @param {number|Numeral|Fraction} x
		 * @returns {boolean} */
		atLeast: (x) => this.minus(x).is.non_negative(),
		/**
		 * @param {number|Numeral|Fraction} x
		 * @returns {boolean} */
		atMost: (x) => !this.minus(x).is.positive(),
	};

	/**
	 * @returns {number}
	 */
	floor() {
		return Math.floor(this.valueOf());
	}
	/**
	 * @returns {number}
	 */
	ceil() {
		return Math.ceil(this.valueOf());
	}

	/**
	 * numerals do not contain any variables
	 * @returns {false}
	 */
	contains() {
		return false;
	}

	// * Static methods
	/**
	 * @param {Numeral|number|Fraction|Float} x
	 * @param {Numeral|number|Fraction|Float} y
	 * @returns {Numeral}
	 */
	static min(x, y) {
		if (x.valueOf() <= y.valueOf()) {
			return x instanceof Numeral ? x.clone() : new Numeral(x).clone();
		}
		return y instanceof Numeral ? y.clone() : new Numeral(y).clone();
	}

	/**
	 * @param {Numeral|number|Fraction|Float} x
	 * @param {Numeral|number|Fraction|Float} y
	 * @returns {Numeral}
	 */
	static max(x, y) {
		if (x.valueOf() >= y.valueOf()) {
			return x instanceof Numeral ? x.clone() : new Numeral(x).clone();
		}
		return y instanceof Numeral ? y.clone() : new Numeral(y).clone();
	}

	/**
	 * @param {(Numeral|number|Fraction)[]} numerals
	 * @returns {Numeral}
	 */
	static gcd(...numerals) {
		const fractions = numerals.map((num) => numberToFraction(num));
		return new Numeral(Fraction.gcd(...fractions));
	}

	/**
	 * @param {Numeral|number|Fraction} x
	 * @param {Numeral|number|Fraction} y
	 * @returns {Numeral}
	 */
	static lcm(x, y) {
		const xFrac = numberToFraction(x);
		const yFrac = numberToFraction(y);
		return new Numeral(Fraction.lcm(xFrac, yFrac));
	}
}

/**
 * @param {Numeral|number|Fraction} x
 * @returns {Fraction}
 */
function numberToFraction(x) {
	if (typeof x === 'number') 
		return new Fraction(x);
	if (x instanceof Fraction) return x;
	if (x.number instanceof Fraction) return x.number;
	throw new TypeError(`Cannot convert float: ${x.toString()} to Fraction`);
}
