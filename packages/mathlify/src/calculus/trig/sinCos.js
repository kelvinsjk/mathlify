import { Fraction, Polynomial, Term } from "../../core";

/** SinFn class representing k sin( f(x) )
 * @class
 * @property {Polynomial} fx - the coefficient of the term
 * @property {"sin-fn"} kind - mathlify kind
 * @property {"sin-fn"} type - mathlify type
 */
export class SinFn extends Term {
  /** @type {Polynomial} */
  fx;
  /** @type {"sin-fn"} */
  kind;
  /** @type {"sin-fn"} */
  type;

  /**
   * @constructor
   * @param {number|Fraction|string|Polynomial} [fx='x'] - f(x) in k sin( f(x) )
   * @param {{coeff?: number|Fraction}} [options] - the base and coefficient of the term
   */
  constructor(fx = "x", options) {
    const { coeff = 1 } = options ?? {};
    const poly =
      fx instanceof Polynomial
        ? fx
        : typeof fx === "string"
        ? Polynomial.ofDegree(1, { variable: fx })
        : new Polynomial([fx]);
    const polyBrackets =
      poly.terms.length > 1 ? `\\left(${poly}\\right)` : `${poly}`;
    super(coeff, `\\sin ${polyBrackets}`);
    this.fx = poly;
    this.kind = "sin-fn";
    this.type = "sin-fn";
  }

  /**
   * @overload
   * @param {number|Fraction} x - the other term to multiply with
   * @returns {SinFn} the product of the two terms
   */
  /**
   * @overload
   * @param {string|Term} x - the other term to multiply with
   * @returns {Term} the product of the two terms
   */
  /**
   * term multiplication
   * @param {number|Fraction|string|Term} x - the other term to multiply with
   * @returns {Term|SinFn} the product of the two terms
   */
  times(x) {
    if (typeof x === "number" || x instanceof Fraction) {
      return new SinFn(this.fx, {
        coeff: this.coeff.times(x),
      });
    }
    return super.times(x);
  }

  /**
   * @overload
   * @param {number|Fraction} x - the other term to divided by
   * @returns {SinFn} the quotient of the two terms
   */
  /**
   * @overload
   * @param {string|Term} x - the other term to divided by
   * @returns {Term} the quotient of the two terms
   */
  /**
   * term division
   * @param {number|Fraction|string|Term} x - the other term to divided by
   * @returns {Term|SinFn} the quotient of the two terms
   */
  divide(x) {
    if (typeof x === "number" || x instanceof Fraction) {
      return new SinFn(this.fx, {
        coeff: this.coeff.divide(x),
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
   * differentiates
   * @returns {CosFn}
   * only works for linear fx
   */
  differentiate() {
    if (this.fx.degree !== 1) {
      throw new Error(`Differentiation only supported for linear fx. ${this}`);
    }
    return new CosFn(this.fx, { coeff: this.coeff.times(this.fx.coeffs[1]) });
  }

  /**
   * differentiates
   * @returns {CosFn}
   * works for linear fx, and assumes f'(x) is already present if f(x) not linear
   */
  integrate() {
    if (this.fx.degree !== 1) {
      return new CosFn(this.fx, { coeff: this.coeff.negative() });
    }
    return new CosFn(this.fx, {
      coeff: this.coeff.divide(this.fx.coeffs[1]).negative(),
    });
  }

  /**
   * sub in many
   * @param {number|Fraction} variableToValue - the values to sub in with the key being the variable signature.
   * If a number of Fraction is received, we assume that the variable is 'x'
   * @returns {SinFn} the term with the values subbed in
   */
  subIn(variableToValue) {
    const subbedFx = this.fx.subIn(variableToValue);
    return new SinFn(subbedFx, { coeff: this.coeff });
  }

  /**
   * solves k sin(f(x)) = rhs, returning the basic angle alpha
   * alpha = arcsin (rhs/k)
   * @param {number|Fraction} rhs - the rhs
   * @param {{degreeMode?: boolean}} [options] -
   * @return {number} the solution
   */
  solve(rhs, options) {
    const alpha = Math.asin(Math.abs(rhs.valueOf() / this.coeff.valueOf()));
    if (options?.degreeMode) {
      return (alpha / Math.PI) * 180;
    }
    return alpha;
  }

  /** methods to cast this term to other types */
  cast = {
    /**
     * cast to Fraction type
     * @returns {Fraction} the fraction representation of this term
     */
    toFraction: () => {
      if (this.fx.is.zero()) {
        return new Fraction(0);
      }
      throw new Error(`cannot cast ${this} to Fraction`);
    },
  };
}

/** CosFn class representing k cos( f(x) )
 * @class
 * @property {Polynomial} fx
 * @property {"cos-fn"} kind - mathlify kind
 * @property {"cos-fn"} type - mathlify type
 */
export class CosFn extends Term {
  /** @type {Polynomial} */
  fx;
  /** @type {"cos-fn"} */
  kind;
  /** @type {"cos-fn"} */
  type;

  /**
   * @constructor
   * @param {number|Fraction|string|Polynomial} [fx='x'] - f(x) in k exp( f(x) )
   * @param {{coeff?: number|Fraction}} [options] - the base and coefficient of the term
   */
  constructor(fx = "x", options) {
    const { coeff = 1 } = options ?? {};
    const poly =
      fx instanceof Polynomial
        ? fx
        : typeof fx === "string"
        ? Polynomial.ofDegree(1, { variable: fx })
        : new Polynomial([fx]);
    const polyBrackets =
      poly.terms.length > 1 ? `\\left(${poly}\\right)` : poly;
    super(coeff, `\\cos ${polyBrackets}`);
    this.fx = poly;
    this.kind = "cos-fn";
    this.type = "cos-fn";
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
   * differentiates
   * @returns {SinFn}
   * only works for linear fx
   */
  differentiate() {
    if (this.fx.degree !== 1) {
      throw new Error(`Differentiation only supported for linear fx. ${this}`);
    }
    return new SinFn(this.fx, {
      coeff: this.coeff.times(this.fx.coeffs[1]).negative(),
    });
  }

  /**
   * differentiates
   * @returns {SinFn}
   * works for linear fx, and assumes f'(x) is already present if f(x) not linear
   */
  integrate() {
    if (this.fx.degree !== 1) {
      return new SinFn(this.fx, { coeff: this.coeff });
    }
    return new SinFn(this.fx, { coeff: this.coeff.divide(this.fx.coeffs[1]) });
  }

  /**
   * sub in many
   * @param {number|Fraction} variableToValue - the values to sub in with the key being the variable signature.
   * If a number of Fraction is received, we assume that the variable is 'x'
   * @returns {CosFn} the term with the values subbed in
   */
  subIn(variableToValue) {
    const subbedFx = this.fx.subIn(variableToValue);
    return new CosFn(subbedFx, { coeff: this.coeff });
  }

  /**
   * returns basic angle alpha = arccos(rhs / k)
   * @param {number|Fraction} rhs - the rhs
   * @param {{degreeMode?: boolean}} [options] -
   * @return {number} the solution
   */
  solve(rhs, options) {
    const alpha = Math.acos(Math.abs(rhs.valueOf() / this.coeff.valueOf()));
    if (options?.degreeMode) {
      return (alpha / Math.PI) * 180;
    }
    return alpha;
  }

  /** methods to cast this term to other types */
  cast = {
    /**
     * cast to Fraction type
     * @returns {Fraction} the fraction representation of this term
     */
    toFraction: () => {
      if (this.fx.is.zero()) {
        return new Fraction(1).times(this.coeff);
      }
      throw new Error(`cannot cast ${this} to Fraction`);
    },
  };
}
