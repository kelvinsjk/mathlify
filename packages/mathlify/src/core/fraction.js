import { gcd, lcm } from './utils/index.js';

/** Fraction class representing a/b, where $a \in \mathbb{Z}$, $b \in \mathbb{Z}^+$, and $\gcd(a,b)=1$.
 * @property {number} num - the numerator (an integer)
 * @property {number} den - the denominator (a positive integer)
 * @property {"fraction"} type - mathlify fraction type
 */
export class Fraction {
	/** @type {number} */
	num;
	/** @type {number} */
	den;
	/** @type {"fraction"} */
	type;
	/**
	 * @constructor
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
		/**
		 * num
		 * @type {number}
		 */
		this.num = num / divisor;
		this.den = den / divisor;
		this.type = 'fraction';
	}

	//! primitive return types
	/**
	 * casts this fraction as a float
	 * @returns {number} this fraction in js number primitive type
	 */
	valueOf() {
		return this.num / this.den;
	}

	/**
	 * casts this fraction as a latex string "(sign?)\frac{num}{den}"
	 * @returns {string} the latex string representation of this fraction
	 */
	toTex() {
		if (this.den === 1) {
			return this.num < 0 ? `- ${Math.abs(this.num)}` : `${this.num}`;
		}
		const sign = this.sign() === 1 ? '' : '- ';
		return `${sign}\\frac{${Math.abs(this.num)}}{${this.den}}`;
	}

	toString() {
		return this.toTex();
	}

	//! Boolean methods
	/**
	 * boolean methods for this fraction
	 */
	is = {
		/**
		 * @returns {boolean} whether this fraction is an integer
		 */
		integer: () => this.den === 1,

		/**
		 * @returns {boolean} whether this fraction is positive
		 */
		positive: () => this.num > 0,

		/**
		 * @returns {boolean} whether this fraction is negative
		 */
		negative: () => this.num < 0,

		/**
		 * @returns {boolean} whether this fraction is zero
		 */
		zero: () => this.num === 0,

		/**
		 * @returns {boolean} whether this fraction is one
		 */
		one: () => this.valueOf() === 1,

		/**
		 * @param {number|Fraction} x the second number/fraction
		 * @returns {boolean} whether this fraction is equal to x
		 */
		equalTo: (x) => Math.abs(this.valueOf() - x.valueOf()) < Number.EPSILON,

		/**
		 * @param {number|Fraction} x the second number/fraction
		 * @returns {boolean} whether this fraction is greater than x
		 */
		greaterThan: (x) => this.valueOf() > x.valueOf(),

		/**
		 * @param {number|Fraction} x the second number/fraction
		 * @returns {boolean} whether this fraction is less than to x
		 */
		lessThan: (x) => this.valueOf() < x.valueOf(),

		/**
		 * @param {number|Fraction} x the second number/fraction
		 * @returns {boolean} whether this fraction is greater than or equal to x
		 */
		atLeast: (x) => !this.is.lessThan(x),

		/**
		 * @param {number|Fraction} x the second number/fraction
		 * @returns {boolean} whether this fraction is less than or equal to x
		 */
		atMost: (x) => !this.is.greaterThan(x),

		/** checks negation */
		not: {
			/**
			 * @returns {boolean} whether this fraction is not an integer
			 */
			integer: () => !this.is.integer(),
			/**
			 * @returns {boolean} whether this fraction is not positive
			 */
			positive: () => !this.is.positive(),
			/**
			 * @returns {boolean} whether this fraction is not negative
			 * */
			negative: () => !this.is.negative(),
			/**
			 * @returns {boolean} whether this fraction is not zero
			 */
			zero: () => !this.is.zero(),
			/**
			 * @returns {boolean} whether this fraction is not one
			 */
			one: () => !this.is.one(),
			/**
			 * @param {number|Fraction} x the second number/fraction
			 * @returns {boolean} whether this fraction is not equal to x
			 */
			equalTo: (x) => !this.is.equalTo(x),
			/**
			 * @param {number|Fraction} x the second number/fraction
			 * @returns {boolean} whether this fraction is not greater than x
			 */
			greaterThan: (x) => !this.is.greaterThan(x),
			/**
			 * @param {number|Fraction} x the second number/fraction
			 * @returns {boolean} whether this fraction is not less than to x
			 */
			lessThan: (x) => !this.is.lessThan(x),
			/**
			 * @param {number|Fraction} x the second number/fraction
			 * @returns {boolean} whether this fraction is not at least (ie smaller than) x
			 */
			atLeast: (x) => !this.is.atLeast(x),
			/**
			 * @param {number|Fraction} x the second number/fraction
			 * @returns {boolean} whether this fraction is not at most (ie greater than) x
			 */
			atMost: (x) => !this.is.atMost(x),
		},
	};

	//! arithmetic methods
	/**
	 * the sign of this fraction
	 * @returns {number} 1 if this is positive, 0 if this is zero, and -1 otherwise
	 */
	sign() {
		return this.num < 0 ? -1 : this.num > 0 ? 1 : 0;
	}

	/**
	 * @param {number|Fraction} x the number/fraction to be added
	 * @returns {Fraction} the sum
	 */
	plus(x) {
		x = numberToFraction(x);
		return new Fraction(this.num * x.den + this.den * x.num, this.den * x.den);
	}

	/**
	 * @param {number|Fraction} x the number/fraction to be multiplied
	 * @returns {Fraction} the product
	 */
	times(x) {
		x = numberToFraction(x);
		return new Fraction(this.num * x.num, this.den * x.den);
	}

	/**
	 * @returns {Fraction} the negative of this fraction
	 */
	negative() {
		return this.times(-1);
	}

	/**
	 * @param {number|Fraction} x - the number/fraction to be subtracted
	 * @returns {Fraction} the difference this minus x
	 */
	minus(x) {
		x = numberToFraction(x);
		return this.plus(x.negative());
	}

	/**
	 * @returns {Fraction} the reciprocal of this fraction
	 */
	reciprocal() {
		if (this.num === 0) {
			throw new Error(`cannot take reciprocal of zero`);
		}
		return new Fraction(this.den, this.num);
	}

	/**
	 * @param {number|Fraction} x the number/fraction to be divided by
	 * @returns {Fraction} the quotient this divided by x
	 */
	divide(x) {
		x = numberToFraction(x);
		if (x.is.equalTo(0)) {
			throw new Error(`division by zero error`);
		}
		return this.times(x.reciprocal());
	}

	/**
	 * @returns {Fraction} the negative reciprocal
	 */
	negativeReciprocal() {
		return this.negative().reciprocal();
	}

	/**
	 * @param {number|Fraction} n the power/index
	 * @returns {Fraction} the exponent, this to the power of n
	 */
	pow(n) {
		n = numberToFraction(n);
		if (n.is.not.integer()) {
			throw new Error(
				`non-integer powers not supported. ${this}^${n} received.`
			);
		}
		let reciprocal = false;
		if (n.is.negative()) {
			n = n.abs();
			reciprocal = true;
		}
		const newFraction = new Fraction(
			Math.pow(this.num, n.valueOf()),
			Math.pow(this.den, n.valueOf())
		);
		return reciprocal ? newFraction.reciprocal() : newFraction;
	}

	/**
	 * @returns {Fraction} the square
	 */
	square() {
		return this.pow(2);
	}

	/**
	 * @returns {Fraction} the absolute value
	 */
	abs() {
		return new Fraction(Math.abs(this.num), this.den);
	}

	//! numerical methods: these methods return js numbers
	/**
	 * @returns {number} this rounded off to the nearest integer
	 */
	round() {
		return Math.round(this.valueOf());
	}

	/**
	 * @returns {number} the floor: the greatest integer less than or equal to this
	 */
	floor() {
		return Math.floor(this.valueOf());
	}

	/**
	 * @returns {number} the ceiling: the smallest integer greater than or equal to this
	 */
	ceil() {
		return Math.ceil(this.valueOf());
	}

	/**
	 * calls the js toFixed number method
	 * @param {number|undefined} fractionDigits number of digits after the decimal point (0-20 inclusive)
	 * @returns {string}
	 */
	toFixed(fractionDigits) {
		return this.valueOf().toFixed(fractionDigits);
	}
	/**
	 * calls the js toPrecision number method
	 * @param {number|undefined} precision number of significant digits (1-21 inclusive)
	 * @returns
	 */
	toPrecision(precision) {
		return this.valueOf().toPrecision(precision);
	}

	//! serialize toJSON
	/**
	 * @typedef {import('./types.js').FractionJSON} FractionJSON
	 */

	/**
	 * serializes object. can be used with the static
	 * `Fraction.FromJSON` method to recreate this fraction
	 * class instance
	 * @returns {FractionJSON}
	 */
	toJSON() {
		return {
			type: 'fraction',
			num: this.num,
			den: this.den,
			args: [this.num, this.den],
		};
	}

	//! static methods
	/**
	 * gcd of n fractions. if all fractions are negative, will return a negative number
	 * otherwise returns a positive fraction
	 * @param  {...(Fraction|number)} fractions
	 * @returns {Fraction} gcd. will be negative if all fractions negative. positive gcd otherwise
	 */
	static gcd(...fractions) {
		/** @type {number[]} */
		const numerators = [];
		/** @type {number[]} */
		const dens = [];
		/** @type {boolean[]} */
		fractions.forEach((f) => {
			const x = numberToFraction(f);
			numerators.push(x.num);
			dens.push(x.den);
		});
		const positiveGcd = new Fraction(gcd(...numerators), lcm(...dens));
		return fractions.every((x) => x.valueOf() < 0)
			? positiveGcd.negative()
			: positiveGcd;
	}
	/**
	 * lcm of n fractions
	 * @param  {...(Fraction|number)} fractions
	 * @returns {Fraction} positive lcm of the fractions
	 */
	static lcm(...fractions) {
		/** @type {number[]} */
		const numerators = [];
		/** @type {number[]} */
		const dens = [];
		/** @type {boolean[]} */
		fractions.forEach((f) => {
			const x = numberToFraction(f);
			numerators.push(x.num);
			dens.push(x.den);
		});
		return new Fraction(lcm(...numerators), gcd(...dens));
	}
	/**
	 * re-instantiate Fraction class instance from JSON object literal
	 * @param {FractionJSON} f JSON object literal obtained from JSON.parse
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

// utils export
/**
 * converts number or fraction to Fraction class
 * @param {number|Fraction} x - number or fraction to be converted
 * @returns the Fraction class representation of x
 */
export function numberToFraction(x) {
	return typeof x === 'number' ? new Fraction(x) : x;
}
