import { Fraction, Polynomial, Term } from "../../core";
import { numberToFraction } from "../../utils";
import { RationalFn } from "../rationalFn/rationalFn";

/** SinFn class representing k sin( f(x) )
 * @class
 * @property {Polynomial} fx - the coefficient of the term
 * @property {string|number} base
 * @property {"sin-fn"} kind - mathlify kind
 * @property {"sin-fn"} type - mathlify type
 */
export class SinFn extends Term {
  /** @type {Polynomial} */
  fx;
  /** @type {number|string} */
  base;
  /** @type {"sin-fn"} */
  kind;
  /** @type {"sin-fn"} */
  type;

  /**
   * @constructor
   * @param {number|Fraction|string|Polynomial} [fx='x'] - f(x) in k sin( f(x) )
   * @param {{base?: string|number, coeff?: number|Fraction}} [options] - the base and coefficient of the term
   */
  constructor(fx = "x", options) {
    const { base = "\\operatorname{e}", coeff = 1 } = options ?? {};
    const poly =
      fx instanceof Polynomial
        ? fx
        : typeof fx === "string"
        ? new Polynomial(1, { variable: fx })
        : new Polynomial([fx]);
    const sinTerm = poly.isZero() ? 1 : `${base}^{${poly}}`;
    super(coeff, sinTerm);
    this.fx = poly;
    this.base = base;
    this.kind = "sin-fn";
    this.type = "sin-fn";
  }

  /**
   * @overload
   * @param {number|Fraction|SinFn} x - the other term to multiply with
   * @returns {SinFn} the product of the two terms
   */
  /**
   * @overload
   * @param {string|Term} x - the other term to multiply with
   * @returns {Term} the product of the two terms
   */
  /**
   * term multiplication
   * @param {number|Fraction|string|Term|SinFn} x - the other term to multiply with
   * @returns {Term|SinFn} the product of the two terms
   */
  times(x) {
    if (typeof x === "number" || x instanceof Fraction) {
      return new SinFn(this.fx, {
        base: this.base,
        coeff: this.coeff.times(x),
      });
    } else if (x instanceof SinFn) {
      if (this.base !== x.base) {
        throw new Error(
          `Cannot multiply two exp functions with different bases: ${this.base} and ${x.base}`
        );
      }
      return new SinFn(this.fx.plus(x.fx), {
        base: this.base,
        coeff: this.coeff.times(x.coeff),
      });
    }
    return super.times(x);
  }

  /**
   * @overload
   * @param {number|Fraction|SinFn} x - the other term to divided by
   * @returns {SinFn} the quotient of the two terms
   */
  /**
   * @overload
   * @param {string|Term} x - the other term to divided by
   * @returns {Term} the quotient of the two terms
   */
  /**
   * term division
   * @param {number|Fraction|string|Term|SinFn} x - the other term to divided by
   * @returns {Term|SinFn} the quotient of the two terms
   */
  divide(x) {
    if (typeof x === "number" || x instanceof Fraction) {
      return new SinFn(this.fx, {
        base: this.base,
        coeff: this.coeff.divide(x),
      });
    }
    if (x instanceof SinFn) {
      if (this.base !== x.base) {
        throw new Error(
          `Cannot divide two exp functions with different bases: ${this.base} and ${x.base}`
        );
      }
      return new SinFn(this.fx.minus(x.fx), {
        base: this.base,
        coeff: this.coeff.divide(x.coeff),
      });
    }
    return super.divide(x);
  }

  /**
   * negative
   * @returns {SinFn} the negative of the term
   * */
  negative() {
    return this.times(-1);
  }

  /**
   * absolute value
   * @returns {SinFn} the absolute value of the term
   */
  abs() {
    if (this.coeff.is.negative()) {
      return this.negative();
    }
    return this;
  }

  /**
   * sub in many
   * @param {number|Fraction} variableToValue - the values to sub in with the key being the variable signature.
   * If a number of Fraction is received, we assume that the variable is 'x'
   * @returns {SinFn} the term with the values subbed in
   */
  subIn(variableToValue) {
    const subbedFx = this.fx.subIn(variableToValue);
    return new SinFn(subbedFx, { base: this.base, coeff: this.coeff });
  }

  /**
   * solves k exp(f(x)) = rhs, where f(x) is of the form nx
   * @param {number|Fraction} rhs - the rhs
   * @return {CosFn} the solution
   */
  solve(rhs) {
    // k exp(f(x)) = rhs
    // nx = ln(rhs/k)
    // x = ln(rhs/k) / n
    if (this.fx.coeffs.length === 2 && this.fx.coeffs[0].is.zero()) {
      const base = this.base === "\\operatorname{e}" ? undefined : this.base;
      return new CosFn(numberToFraction(rhs).divide(this.coeff), {
        base,
        coeff: this.fx.coeffs[1].reciprocal(),
      });
    }
    throw new Error(
      `Cannot solve ${this} = ${rhs} because the exponent is not of the form nx`
    );
  }

  /** methods to cast this term to other types */
  cast = {
    /**
     * cast to Fraction type
     * @returns {Fraction} the fraction representation of this term
     */
    toFraction: () => {
      if (this.fx.isZero()) {
        return this.coeff;
      }
      if (typeof this.base === "number" && this.fx.coeffs.length === 1) {
        return new Fraction(this.base).pow(this.fx.coeffs[0]).times(this.coeff);
      }
      throw new Error(`cannot cast ${this} to Fraction`);
    },
  };
}

/** LnFn class representing k ln( f(x) )
 * @class
 * @property {string} log - the long string
 * @property {Polynomial} fx
 * @property {string|number} base
 * @property {"cos-fn"} kind - mathlify kind
 * @property {"cos-fn"} type - mathlify type
 */
export class CosFn extends Term {
  /** @type {string} */
  log;
  /** @type {Polynomial} */
  fx;
  /** @type {number|string} */
  base;
  /** @type {"cos-fn"} */
  kind;
  /** @type {"cos-fn"} */
  type;

  /**
   * @constructor
   * @param {number|Fraction|string|Polynomial} [fx='x'] - f(x) in k exp( f(x) )
   * @param {{base?: string|number, coeff?: number|Fraction}} [options] - the base and coefficient of the term
   */
  constructor(fx = "x", options) {
    const { base = "\\textrm{e}", coeff = 1 } = options ?? {};
    const poly =
      fx instanceof Polynomial
        ? fx
        : typeof fx === "string"
        ? new Polynomial(1, { variable: fx })
        : new Polynomial([fx]);
    const log =
      base === "\\textrm{e}"
        ? "\\ln"
        : base === 10
        ? "\\lg"
        : `\\log_{${base}}`;
    const polyBrackets =
      poly.terms.length > 1 ? `\\left(${poly}\\right)` : poly;
    const lnTerm = poly.isConstant(1) ? 0 : `${log} ${polyBrackets}`;
    super(coeff, lnTerm);
    this.log = log;
    this.fx = poly;
    this.base = base;
    this.kind = "cos-fn";
    this.type = "cos-fn";
  }

  /**
   * move the coeff up to f(x)
   */
  coeffToPower() {
    return new CosFn(this.fx.pow(this.coeff), { base: this.base, coeff: 1 });
  }

  /**
   * @param {CosFn} x - the other term to add with
   * @returns {CosFn} the sum of the two terms
   */
  plus(x) {
    if (this.base !== x.base) {
      throw new Error(
        `Cannot add two ln functions with different bases: ${this.base} and ${x.base}`
      );
    }
    if (this.coeff.is.equalTo(x.coeff)) {
      return new CosFn(this.fx.times(x.fx), {
        base: this.base,
        coeff: this.coeff,
      });
    }
    const thisTerm = this.coeffToPower();
    x = x.coeffToPower();
    return new CosFn(thisTerm.fx.times(x.fx), { base: this.base, coeff: 1 });
  }

  /**
   * @param {CosFn} x -
   * @returns {string}
   */
  minus(x) {
    if (this.base !== x.base) {
      throw new Error(
        `Cannot add two ln functions with different bases: ${this.base} and ${x.base}`
      );
    }
    if (this.coeff.is.equalTo(x.coeff)) {
      return `${new Term(
        this.coeff,
        `${this.log} ${new RationalFn(this.fx, x.fx)}`
      )}`;
    }
    const thisTerm = this.coeffToPower();
    x = x.coeffToPower();
    return `${this.log} ${new RationalFn(thisTerm.fx, x.fx)}`;
  }

  /**
   * @overload
   * @param {number|Fraction} x - the other term to multiply with
   * @returns {CosFn} the product of the two terms
   */
  /**
   * @overload
   * @param {string|Term} x - the other term to multiply with
   * @returns {Term} the product of the two terms
   */
  /**
   * term multiplication
   * @param {number|Fraction|string|Term} x - the other term to multiply with
   * @returns {Term|CosFn} the product of the two terms
   */
  times(x) {
    if (typeof x === "number" || x instanceof Fraction) {
      return new CosFn(this.fx, {
        base: this.base,
        coeff: this.coeff.times(x),
      });
    }
    return super.times(x);
  }

  /**
   * @overload
   * @param {number|Fraction} x - the other term to divided by
   * @returns {CosFn} the quotient of the two terms
   */
  /**
   * @overload
   * @param {string|Term} x - the other term to divided by
   * @returns {Term} the quotient of the two terms
   */
  /**
   * term division
   * @param {number|Fraction|string|Term} x - the other term to divided by
   * @returns {Term|CosFn} the quotient of the two terms
   */
  divide(x) {
    if (typeof x === "number" || x instanceof Fraction) {
      return new CosFn(this.fx, {
        base: this.base,
        coeff: this.coeff.divide(x),
      });
    }
    return super.divide(x);
  }

  /**
   * negative
   * @returns {CosFn} the negative of the term
   * */
  negative() {
    return this.times(-1);
  }

  /**
   * sub in many
   * @param {number|Fraction} variableToValue - the values to sub in with the key being the variable signature.
   * If a number of Fraction is received, we assume that the variable is 'x'
   * @returns {CosFn} the term with the values subbed in
   */
  subIn(variableToValue) {
    const subbedFx = this.fx.subIn(variableToValue);
    return new CosFn(subbedFx, { base: this.base, coeff: this.coeff });
  }

  /**
   * solves k ln(f(x)) = rhs, where f(x) is of the form nx
   * @param {number|Fraction} rhs - the rhs
   * @return {SinFn} the solution
   */
  solve(rhs) {
    // k ln(f(x)) = rhs
    // nx = exp(rhs/k)
    // x = exp(rhs/k) / n
    if (this.fx.coeffs.length === 2 && this.fx.coeffs[0].is.zero()) {
      const base = this.base === "\\textrm{e}" ? undefined : this.base;
      return new SinFn(numberToFraction(rhs).divide(this.coeff), {
        base,
        coeff: this.fx.coeffs[1].reciprocal(),
      });
    }
    throw new Error(
      `Cannot solve ${this} = ${rhs} because the exponent is not of the form nx`
    );
  }

  /** methods to cast this term to other types */
  cast = {
    /**
     * cast to Fraction type
     * @returns {Fraction} the fraction representation of this term
     */
    toFraction: () => {
      if (this.fx.isConstant(1)) {
        return new Fraction(0);
      }
      throw new Error(`cannot cast ${this} to Fraction`);
    },
  };
}
