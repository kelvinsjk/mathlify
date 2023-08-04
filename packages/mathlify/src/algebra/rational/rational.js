// rationalTerm represents ( num / den ), where both are expression types

// notes: when using rationalTerm within an expression,
// the rational term is lost because the expression constructor tries
// to simplify the expression by combining like terms and reconstruct the
// term afterwards. The reconstruction does not understanding the workings
// of the RationalTerm class and typesetting is lost. TODO: fix this
/** @see Expression  */

import { Expression, Fraction, Term } from '../../core/index.js';

//TODO: use lcm for constant denominator addition

/**
 * RationalTerm class extending the Term class
 * @property {Expression} num - the numerator of the term
 * @property {Expression} den - the denominator of the term
 * @property {"rational"} kind - mathlify rational class kind
 * @property {"rational"|"rational-expression"} type - mathlify rational class type
 */
export class RationalTerm extends Term {
	/**
	 * @constructor
	 * Creates a Rational Term instance
	 * @param {Expression|number|Fraction|string|Term|(number|Fraction|string|Term)[]} numerator - the numerator
	 * @param {Expression|number|Fraction|string|Term|(number|Fraction|string|Term)[]} [denominator=1] - the denominator
	 * @throws {Error} if denominator is zero
	 */
	constructor(numerator, denominator = 1) {
		if (!(numerator instanceof Expression)) {
			numerator = Array.isArray(numerator)
				? new Expression(...numerator)
				: new Expression(numerator);
		}
		if (!(denominator instanceof Expression)) {
			denominator = Array.isArray(denominator)
				? new Expression(...denominator)
				: new Expression(denominator);
		}
		if (`${denominator}` === '0') {
			throw new Error('denominator cannot be zero');
		}
		// simplifies the expression by dividing by GCD
		// (k1 num / k2 num)
		const k1 = numerator.gcd();
		const k2 = denominator.gcd();
		const coeff = k1.divide(k2);
		const numDivisor = k1.divide(coeff.num);
		const denDivisor = k2.divide(coeff.den);
		numerator = numerator.divide(numDivisor);
		denominator = denominator.divide(denDivisor);
		super(`(${numerator})`, [`(${denominator})`, -1]);
		this.num = numerator;
		this.den = denominator;
		this.kind = 'rational';
		this.type = `${denominator}` === '1' ? 'rational-expression' : 'rational';
	}

	/**
	 * multiplication
	 * @param {number|Fraction|string|Term|Expression|RationalTerm} x - the other term/expression to multiply with
	 * @returns {RationalTerm} the product of the two
	 */
	times(x) {
		// (this.num * x.num) / (this.den * x.den)
		const xRational = x instanceof RationalTerm ? x : new RationalTerm(x);
		return new RationalTerm(
			this.num.times(xRational.num),
			this.den.times(xRational.den)
		);
	}

	/**
	 * division
	 * @param {number|Fraction|string|Term|Expression|RationalTerm} x - the other term/expression to divide with
	 * @returns {RationalTerm} the quotient of the two
	 */
	divide(x) {
		// (this.num * x.den) / (this.den * x.num)
		const xRational = x instanceof RationalTerm ? x : new RationalTerm(x);
		return new RationalTerm(
			this.num.times(xRational.den),
			this.den.times(xRational.num)
		);
	}

	/**
	 * addition
	 * @param {number|Fraction|string|Term|Expression|RationalTerm} x - term/expression to be added
	 * @returns {RationalTerm} - the sum of the two
	 */
	plus(x) {
		// (this.num * x.den + this.den * x.num) / (this.den * x.den)
		const xRational = x instanceof RationalTerm ? x : new RationalTerm(x);
		const num = this.num
			.times(xRational.den)
			.plus(this.den.times(xRational.num));
		const den = this.den.times(xRational.den);
		return new RationalTerm(num, den);
	}

	/**
	 * negative
	 * @returns {RationalTerm} the negative of the expression
	 */
	negative() {
		return new RationalTerm(this.num.negative(), this.den);
	}

	/**
	 * subtraction
	 * @param {number|Fraction|string|Term|Expression|RationalTerm} x - term/expression to be subtracted
	 * @returns {RationalTerm} - the difference this minus x
	 */
	minus(x) {
		if (typeof x === 'number' || typeof x === 'string') {
			x = new Term(x);
		}
		return this.plus(x.negative());
	}

	/**
	 * sub in a value for a variable
	 * @param {{[key: string]: number|Fraction}|number|Fraction} variableToValue - the values to sub in with the key being the variable signature.
	 * @returns {RationalTerm} - the new RationalTerm
	 */
	subIn(variableToValue) {
		return new RationalTerm(
			this.num.subIn(variableToValue),
			this.den.subIn(variableToValue)
		);
	}

	/** methods to cast this term to other types */
	cast = {
		/**
		 * cast to Expression type (denominator must be a constant)
		 * @returns {Expression} an Expression representation of this term
		 */
		toExpression: () => {
			if (this.den.is.constant()) {
				return this.num.divide(this.den.cast.toFraction());
			}
			throw new Error(
				`cannot cast ${this} to Term: non-constant denominator detected`
			);
		},
		/**
		 * cast to Term type
		 * @returns {Term} the term representation of this term
		 */
		toTerm: () => {
			return this.cast.toExpression().cast.toTerm();
		},
		/**
		 * cast to Fraction type
		 * @returns {Fraction} the fraction representation of this term
		 */
		toFraction: () => {
			return this.cast.toExpression().cast.toFraction();
		},
	};

	/**
	 * toString
	 * @returns {string} - the LaTeX string representation of the Expression
	 */
	toString() {
		if (`${this.den}` === '1') {
			return `${this.num}`;
		}
		return `\\frac{${this.num}}{${this.den}}`;
	}
}
