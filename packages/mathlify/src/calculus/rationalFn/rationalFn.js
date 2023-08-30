// rationalTerm represents ( num / den ), where both are expression types

import { Polynomial, Fraction } from "../../core/index.js";
import {
  ExpansionTerm,
  RationalTerm,
  castToPoly,
  longDivision,
} from "../../algebra/index.js";

/**
 * @typedef {import('../../core/index.js').Term} Term
 * @typedef {import('../../core/index.js').Expression} Expression
 */

/**
 * RationalFn class extending the RationalTerm class
 * @property {Polynomial} numFn - the numerator of the term
 * @property {Polynomial} denFn - the denominator of the term
 * @property {"rational-term"} kind - mathlify rational class kind
 * @property {"rational-term"|"rational-expression"} type - mathlify rational class type
 * @extends RationalTerm
 */
export class RationalFn extends RationalTerm {
  /** @type {Polynomial} */
  numFn;
  /** @type {Polynomial} */
  denFn;
  /** @type {"rational-fn"} */
  kind;
  /** @type {"rational-fn"} */
  type;
  /**
   * @constructor
   * Creates a Rational Fn instance
   * @param {Polynomial|number|Fraction|(number|Fraction)[]} numerator - the numerator
   * @param {Polynomial|number|Fraction|(number|Fraction)[]} denominator - the denominator
   */
  constructor(numerator, denominator = 1) {
    if (!(numerator instanceof Polynomial)) {
      numerator = Array.isArray(numerator)
        ? new Polynomial(numerator)
        : new Polynomial([numerator]);
    }
    if (!(denominator instanceof Polynomial)) {
      denominator = Array.isArray(denominator)
        ? new Polynomial(denominator)
        : new Polynomial([denominator]);
    }
    /** @param {{coeff: Fraction|number}|undefined} [options] */
    let options = undefined;
    if (numerator.coeffs.every((c) => c.is.negative())) {
      options = { coeff: -1 };
      numerator = numerator.times(-1);
    }
    super(numerator, denominator, options);
    this.num = numerator;
    this.numFn = numerator;
    this.denFn = denominator;
    this.kind = "rational-fn";
    this.type = "rational-fn";
  }

  /**
   * @overload
   * multiplication
   * @param {number|Fraction|RationalFn} x - the other term/expression to multiply with
   * @returns {RationalFn} the product of the two
   */
  /**
   * @overload
   * multiplication
   * @param {string|Term|RationalTerm} x - the other term/expression to multiply with
   * @returns {RationalTerm} the product of the two
   */
  /**
   * multiplication
   * @param {RationalFn|number|Fraction|string|Term|RationalTerm} x - the other term/expression to multiply with
   * @returns {RationalTerm|RationalFn|Term} the product of the two
   */
  times(x) {
    if (typeof x === "number" || x instanceof Fraction) {
      return new RationalFn(this.numFn.times(x).times(this.coeff), this.denFn);
    }
    if (x instanceof Fraction) {
      return new RationalFn(
        this.numFn.times(x.num).times(this.coeff),
        this.denFn.times(x.den)
      );
    }
    if (x instanceof RationalFn) {
      return new RationalFn(
        this.numFn.times(x.numFn).times(this.coeff),
        this.denFn.times(x.denFn)
      );
    }
    return super.times(x);
  }

  /**
   * @overload
   * division
   * @param {number|Fraction|RationalFn} x - the other term/expression to multiply with
   * @returns {RationalFn} the product of the two
   */
  /**
   * @overload
   * division
   * @param {string|Term|RationalTerm} x - the other term/expression to multiply with
   * @returns {RationalTerm} the product of the two
   */
  /**
   * division
   * @param {RationalFn|number|Fraction|string|Term|RationalTerm} x - the other term/expression to multiply with
   * @returns {RationalTerm|RationalFn} the product of the two
   */
  divide(x) {
    if (typeof x === "number" || x instanceof Fraction) {
      return new RationalFn(this.numFn.times(this.coeff), this.denFn.times(x));
    }
    if (x instanceof Fraction) {
      return new RationalFn(
        this.numFn.times(x.den).times(this.coeff),
        this.denFn.times(x.num)
      );
    }
    if (x instanceof RationalFn) {
      return new RationalFn(
        this.numFn.times(x.denFn).times(this.coeff),
        this.denFn.times(x.numFn)
      );
    }
    return super.times(x);
  }

  /**
   * long division
   * @return {Expression}
   */
  longDivide() {
    return longDivision(this.numFn.times(this.coeff), this.denFn);
  }

  /**
   * differentiate
   * @param {{divisor?: Polynomial}} [options] - options to take out common divisor from both numerator and denominator
   * @returns {RationalTerm} the derivative of the expression
   */
  differentiate(options) {
    const num = this.numFn.times(this.coeff);
    let numResult = num
      .differentiate()
      .times(this.denFn)
      .minus(num.times(this.denFn.differentiate()));
    let denResult =
      this.denFn.terms.length === 1
        ? this.denFn.square()
        : new ExpansionTerm([this.denFn, 2]);
    if (options?.divisor) {
      numResult = castToPoly(longDivision(numResult, options.divisor));
      denResult = castToPoly(
        longDivision(this.denFn.square(), options.divisor)
      );
    }
    return new RationalTerm(numResult, denResult);
  }

  /**
   * differentiate
   * @param {{divisor?: Polynomial}} [options] - options to take out common divisor from both numerator and denominator
   * @returns {RationalFn} the derivative of the expression
   */
  differentiateToFn(options) {
    const rational = this.differentiate(options);
    return castToRationalFn(rational);
  }

  ///**
  // * addition
  // * @param {number|Fraction|string|Term|Expression|RationalTerm} x - term/expression to be added
  // * @returns {RationalTerm} - the sum of the two
  // */
  //plus(x) {
  //  // (this.num * x.den + this.den * x.num) / (this.den * x.den)
  //  const xRational = x instanceof RationalTerm ? x : new RationalTerm(x);
  //  const den = ExpansionTerm.lcm(this.den, xRational.den);
  //  const num1 = this.num
  //    .times(this.coeff)
  //    .times(den.divide(this.den).expand());
  //  const num2 = xRational.num
  //    .times(xRational.coeff)
  //    .times(den.divide(xRational.den).expand());
  //  return new RationalTerm(num1.plus(num2), den);
  //}

  /**
   * negative
   * @returns {RationalFn} the negative of the expression
   */
  negative() {
    return new RationalFn(this.numFn.times(this.coeff).negative(), this.denFn);
  }

  ///**
  // * subtraction
  // * @param {number|Fraction|string|Term|Expression|RationalTerm} x - term/expression to be subtracted
  // * @returns {RationalTerm} - the difference this minus x
  // */
  //minus(x) {
  //  if (typeof x === "number" || typeof x === "string") {
  //    x = new Term(x);
  //  }
  //  return this.plus(x.negative());
  //}

  ///**
  // * sub in a value for a variable
  // * @param {{[key: string]: number|Fraction}} variableToValue - the values to sub in with the key being the variable signature.
  // * @returns {RationalTerm} - the new RationalTerm
  // */
  //subIn(variableToValue) {
  //  return new RationalTerm(
  //    this.num.subIn(variableToValue),
  //    this.den.expand().subIn(variableToValue),
  //    { coeff: this.coeff }
  //  );
  //}

  ///** methods to cast this term to other types */
  //cast = {
  //  /**
  //   * cast to Expression type (denominator must be a constant)
  //   * @returns {Expression} an Expression representation of this term
  //   */
  //  toExpression: () => {
  //    if (this.den.is.constant()) {
  //      return this.num.divide(this.den.cast.toFraction()).times(this.coeff);
  //    }
  //    throw new Error(
  //      `cannot cast ${this} to Term: non-constant denominator detected`
  //    );
  //  },
  //  /**
  //   * cast to Term type
  //   * @returns {Term} the term representation of this term
  //   */
  //  toTerm: () => {
  //    return this.cast.toExpression().cast.toTerm();
  //  },
  //  /**
  //   * cast to Fraction type
  //   * @returns {Fraction} the fraction representation of this term
  //   */
  //  toFraction: () => {
  //    return this.cast.toExpression().cast.toFraction();
  //  },
  //};
}

/**
 * @param {RationalTerm} x
 * @returns {RationalFn}
 * */
function castToRationalFn(x) {
  return new RationalFn(
    castToPoly(x.num.times(x.coeff)),
    castToPoly(x.den.expand())
  );
}
