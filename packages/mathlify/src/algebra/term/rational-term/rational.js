// rationalTerm represents ( num / den ), where both are expression types

import { Expression, Fraction, Term } from "../../../core/index.js";
import { numberToFraction } from "../../../utils/toFraction.js";

//TODO: leave denominator as (den1)(den2) if both are expressions

/**
 * RationalTerm class extending the Term class
 * @property {Expression} num - the numerator of the term
 * @property {Expression} den - the denominator of the term
 * @property {Fraction} coeff - either 1 or -1 to indicate the sign of the term
 * @property {"rational"} kind - mathlify rational class kind
 * @property {"rational-term"|"rational-expression"} type - mathlify rational class type
 * @extends Term
 */
export class RationalTerm extends Term {
  /**
   * @constructor
   * Creates a Rational Term instance
   * @param {Expression|number|Fraction|string|Term|(number|Fraction|string|Term)[]} numerator - the numerator
   * @param {Expression|number|Fraction|string|Term|(number|Fraction|string|Term)[]} [denominator=1] - the denominator
   * @param {Fraction|number} [coeff=1] - the coefficient (default 1). Only tested for 1 and -1, use with care
   * @throws {Error} if denominator is zero
   */
  constructor(numerator, denominator = 1, coeff=1) {
    coeff = numberToFraction(coeff);
    if (!(numerator instanceof Expression)) {
      numerator = Array.isArray(numerator)
        ? new Expression(...numerator)
        : new Expression(numerator);
    }
    if (numerator.type === 'expression-term'){
      const numeratorTerm = numerator.cast.toTerm()
      if (numeratorTerm.coeff.is.negative()){
        numerator = numerator.times(-1);
        coeff = coeff.times(-1);
      }
    }
    if (!(denominator instanceof Expression)) {
      denominator = Array.isArray(denominator)
        ? new Expression(...denominator)
        : new Expression(denominator);
    }
    if (`${denominator}` === "0") {
      throw new Error("denominator cannot be zero");
    }
    // simplifies the expression by dividing by GCD
    // (k1 num / k2 num)
    const k1 = numerator.gcd();
    const k2 = denominator.gcd();
    const divisor = k1.divide(k2);
    const numDivisor = k1.divide(divisor.num);
    const denDivisor = k2.divide(divisor.den);
    numerator = numerator.divide(numDivisor);
    denominator = denominator.divide(denDivisor);
    super(coeff, `(${numerator})`, [`(${denominator})`, -1]);
    this.num = numerator;
    this.den = denominator;
    this.coeff = coeff;
    /** @type {"rational-term"} */
    this.kind = "rational-term";
    /** @type {"rational-term"|"rational-expression"} */
    this.type = `${denominator}` === "1" ? "rational-expression" : "rational-term";
  }

  /**
   * multiplication
   * @param {number|Fraction|string|Term|Expression|RationalTerm} x - the other term/expression to multiply with
   * @returns {RationalTerm} the product of the two
   * @override
   */
  times(x) {
    // (this.num * x.num) / (this.den * x.den)
    const xRational = x instanceof RationalTerm ? x : new RationalTerm(x);
    return new RationalTerm(
      this.num.times(xRational.num),
      this.den.times(xRational.den),
      this.coeff.times(xRational.coeff)
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
      this.num.times(this.coeff).times(xRational.den),
      this.den.times(xRational.num.times(xRational.coeff))
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
      .times(this.coeff)
      .times(xRational.den)
      .plus(this.den.times(xRational.num.times(xRational.coeff)));
    const den = this.den.times(xRational.den);
    return new RationalTerm(num, den);
  }

  /**
   * negative
   * @returns {RationalTerm} the negative of the expression
   */
  negative() {
    return new RationalTerm(this.num, this.den, this.coeff.negative());
  }

  /**
   * subtraction
   * @param {number|Fraction|string|Term|Expression|RationalTerm} x - term/expression to be subtracted
   * @returns {RationalTerm} - the difference this minus x
   */
  minus(x) {
    if (typeof x === "number" || typeof x === "string") {
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
      this.den.subIn(variableToValue),
      this.coeff
    );
  }

  /**
   * resets coeff
   * should not be used directly: only present to ensure compatibility with Expression class
   * @returns {RationalTerm} - reference to this RationalTerm
   * 
  */
 resetCoeff() {
    //! this method is a bit hacky to get compatibility: may need to rethink
    return this.coeff.is.negative() ? this.negative() : this;
  }

  /** methods to cast this term to other types */
  cast = {
    /**
     * cast to Expression type (denominator must be a constant)
     * @returns {Expression} an Expression representation of this term
     */
    toExpression: () => {
      if (this.den.is.constant()) {
        return this.num.divide(this.den.cast.toFraction()).times(this.coeff);
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
    if (`${this.den}` === "1") {
      return `${this.num.times(this.coeff)}`;
    }
    const sign = this.coeff.is.negative() ? "- " : "";
    return `${sign}\\frac{${this.num}}{${this.den}}`;
  }
}
