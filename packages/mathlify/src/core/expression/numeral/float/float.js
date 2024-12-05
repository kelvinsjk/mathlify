/** @typedef {import('../fraction/fraction.js').Fraction} Fraction */

/**
 * The `Float` class represents a floating point number
 * @property {'float'} type
 * @property {number} value 
 * @property {'fixed'|'precision'} displayMode
 * @property {number} precision
 *
 */
export class Float {
	/** @type {'float'} */
	type = 'float';
	/** @type {number} */
	value;
	/** @type {'fixed'|'precision'} */
	displayMode;
	/** @type {number} */
	precision;
	/**
	 * @constructor
	 * Creates a `Float` instance
	 * @param {number} value
	 * @param {{displayMode?: 'fixed'|'precision', precision?: number}} [options]
	 */
	constructor(value, options) {
		this.value = value;
		this.displayMode = options?.displayMode ?? 'precision';
		this.precision = options?.precision ?? 5;
	}

	/**
	 * @returns {Float}
	 */
	clone() {
		return new Float(this.value, { displayMode: this.displayMode, precision: this.precision });
	}

	//* PRIMITIVE RETURN METHODS
	/**
	 * @returns {number}
	 */
	valueOf() {
		return this.value;
	}

	simplify() {
		return this.clone();
	}

	/**
	 * returns the latex string representing this decimal
	 * @param {{displayMode?: 'fixed'|'precision', precision?: number}} [options]
	 * @returns {string}
	 */
	toString(options) {
		const displayMode = options?.displayMode ?? this.displayMode;
		const precision = options?.precision ?? this.precision;
		if (this.valueOf().toString().length < 6) return this.valueOf().toString();
		return displayMode === 'fixed' ? this.toFixed(precision) : this.toPrecision(precision);
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

	// * Boolean checks
	is = {
		/** @returns {boolean} */
		positive: () => this.valueOf() > 0,
		/** @returns {boolean} */
		negative: () => this.valueOf() < 0,
		/** @returns {boolean} */
		non_negative: () => this.valueOf() >= 0,
		/** @returns {boolean} */
		zero: () => this.valueOf() === 0,
		/** @returns {boolean} */
		nonzero: () => !this.is.zero(),
		/** @returns {boolean} */
		integer: () => Number.isInteger(this.valueOf()),
		/** @returns {boolean} */
		one: () => this.valueOf() === 1,
		/** @returns {boolean} */
		negative_one: () => this.valueOf() === -1,
	};

	//* Arithmetic methods
	/**
	 * sum of two floats
	 * @param {Float|Fraction|number} x - the float to add
	 * @returns {Float}
	 */
	plus(x) {
		return new Float(
			this.valueOf() + x.valueOf(),
			{ displayMode: this.displayMode, precision: this.precision },
		)
	}
	/**
	 * product of two floats
	 * @param {Float|Fraction|number} x - the float to multiply by
	 * @returns {Float}
	 */
	times(x) {
		return new Float(
			this.valueOf() * x.valueOf(),
			{ displayMode: this.displayMode, precision: this.precision },
		)
	}
	/**
	 * power of this float
	 * @param {number|Fraction} n - the power to raise to
	 * @returns {Float}
	 */
	pow(n) {
		return new Float(
			this.valueOf() ** n.valueOf(),
			{ displayMode: this.displayMode, precision: this.precision },
		)
	}
	/**
	 * reciprocal of this float
	 * @returns {Float}
	 */
	reciprocal() {
		if (this.is.zero()) throw new RangeError('reciprocal of 0 is undefined');
		return new Float(1 / this.valueOf(), { displayMode: this.displayMode, precision: this.precision });
	}
	/**
	 * division
	 * @param {Float|Fraction|number} x - the float to divide by
	 */
	divide(x) {
		const xFloat = typeof x === 'number' ? new Float(x) : x;
		if (xFloat.is.zero()) throw new RangeError('division by 0 is undefined');
		return this.times(xFloat.reciprocal());
	}
	/**
	 * absolute value of this float
	 * @returns {Float}
	 */
	abs() {
		return new Float(Math.abs(this.valueOf()), { displayMode: this.displayMode, precision: this.precision });
	}
	/**
	 * negation of this float
	 * @returns {Float}
	 */
	negative() {
		return new Float(-this.valueOf(), { displayMode: this.displayMode, precision: this.precision });
	}

	//* Static methods

	/**
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign
	 * @param {Float} float
	 * @returns {number} 1 or -1, depending on the sign. 0 or -0 are returned as-is.
	 */
	static sign(float) {
		return Math.sign(float.valueOf());
	}

}
