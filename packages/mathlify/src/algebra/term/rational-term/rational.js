// rationalTerm represents ( num / den ), where both are expression types

import { Expression, Fraction, Term } from "../../../core/index.js";
import { ExpressionProduct } from "../expression-product/expression-product.js";
import { numberToFraction } from "../../../utils/toFraction.js";

//TODO: leave denominator as (den1)(den2) if both are expressions

/**
 * RationalTerm class extending the Term class
 * @property {Expression} num - the numerator of the term
 * @property {ExpressionProduct} den - the denominator of the term
 * @property {Fraction} coeff - either 1 or -1 to indicate the sign of the term
 * @property {"rational-term"} kind - mathlify rational class kind
 * @property {"rational-term"|"rational-expression"} type - mathlify rational class type
 * @extends Term
 */
export class RationalTerm extends Term {
  /** @type {Expression} */
  num;
  /** @type {ExpressionProduct} */
  den;
  /** @type {Fraction} */
  coeff;
  /** @type {"rational-term"|"rational-fn"} */
  type;
  /**
   * @constructor
   * Creates a Rational Term instance
   * @param {Expression|number|Fraction|string|Term|(number|Fraction|string|Term)[]} numerator - the numerator
   * @param {ExpressionProduct|Expression|number|Fraction|string|Term} [denominator=1] - the denominator
   * @param {{coeff: Fraction|number}} [options] - options for coefficient (default {coeff: 1}). Only tested for 1 and -1, use with care
   * @throws {Error} if denominator is zero
   */
  constructor(numerator, denominator = 1, options) {
    let coeff = numberToFraction(options?.coeff ?? 1);
    if (!(numerator instanceof Expression)) {
      numerator = Array.isArray(numerator)
        ? new Expression(...numerator)
        : new Expression(numerator);
    }
    if (numerator.terms.length <= 1) {
      const numeratorTerm = numerator.cast.toTerm();
      if (numeratorTerm.coeff.is.negative()) {
        numerator = numerator.times(-1);
        coeff = coeff.times(-1);
      }
    }
    let den =
      denominator instanceof ExpressionProduct
        ? denominator
        : new ExpressionProduct(denominator);
    if (`${den}` === "0") {
      throw new Error("denominator cannot be zero");
    }
    // simplifies the expression by dividing by GCD
    // (k1 num / k2 num)
    const k1 = `${numerator}` === "0" ? new Fraction(1) : numerator.gcd();
    const k2 = den.coeff;
    const divisor = k1.divide(k2);
    const numDivisor = k1.divide(divisor.num);
    const denDivisor = k2.divide(divisor.den);
    numerator = numerator.times(numDivisor.reciprocal());
    den = den.times(denDivisor.reciprocal());
    super(coeff, `(${numerator})`, [`(${den})`, -1]);
    this.num = numerator;
    this.den = den;
    this.coeff = coeff;
    this.type = "rational-term";
  }

  /**
   * multiplication
   * @param {number|Fraction|string|Term|RationalTerm} x - the other term/expression to multiply with
   * @returns {RationalTerm} the product of the two
   * @override
   */
  times(x) {
    // (this.num * x.num) / (this.den * x.den)
    if (x instanceof RationalTerm) {
      return new RationalTerm(
        this.num.times(x.num),
        new ExpressionProduct(this.den, x.den),
        { coeff: this.coeff.times(x.coeff) }
      );
    }
    if (x instanceof Fraction && x.is.not.integer()) {
      return new RationalTerm(this.num.times(x.num), this.den.times(x.den), {
        coeff: this.coeff,
      });
    }
    if (x instanceof Fraction && x.is.negative()) {
      return new RationalTerm(this.num.times(x.abs()), this.den, {
        coeff: this.coeff.negative(),
      });
    }
    return new RationalTerm(this.num.times(x), this.den, { coeff: this.coeff });
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
      this.num.times(this.coeff).times(xRational.den.expand()),
      new ExpressionProduct(this.den, xRational.num)
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
    const den = ExpressionProduct.lcm(this.den, xRational.den);
    const num1 = this.num
      .times(this.coeff)
      .times(den.divide(this.den).expand());
    const num2 = xRational.num
      .times(xRational.coeff)
      .times(den.divide(xRational.den).expand());
    return new RationalTerm(num1.plus(num2), den);
  }

  /**
   * negative
   * @returns {RationalTerm} the negative of the expression
   */
  negative() {
    return new RationalTerm(this.num, this.den, {
      coeff: this.coeff.negative(),
    });
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
   * @param {{[key: string]: number|Fraction}} variableToValue - the values to sub in with the key being the variable signature.
   * @returns {RationalTerm} - the new RationalTerm
   */
  subIn(variableToValue) {
    return new RationalTerm(
      this.num.subIn(variableToValue),
      this.den.expand().subIn(variableToValue),
      { coeff: this.coeff }
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
