import { RationalTerm } from "../../algebra";
import { Fraction, Polynomial, Term } from "../../core";
import { numberToFraction } from "../../utils";
import { RationalFn } from "../rationalFn/rationalFn";

/** ExpFn class representing k exp( f(x) )
 * @class
 * @property {Polynomial} fx - the coefficient of the term
 * @property {string|number} base
 * @property {"exp-fn"} kind - mathlify kind
 * @property {"exp-fn"} type - mathlify type
 */
export class ExpFn extends Term {
  /** @type {Polynomial} */
  fx;
  /** @type {number|string} */
  base;
  /** @type {"exp-fn"} */
  kind;
  /** @type {"exp-fn"} */
  type;

  /**
   * @constructor
   * @param {number|Fraction|string|Polynomial} [fx='x'] - f(x) in k exp( f(x) )
   * @param {{base?: string|number, coeff?: number|Fraction}} [options] - the base and coefficient of the term
   */
  constructor(fx = "x", options) {
    const { base = "\\operatorname{e}", coeff = 1 } = options ?? {};
    const poly =
      fx instanceof Polynomial
        ? fx
        : typeof fx === "string"
        ? Polynomial.ofDegree(1, { variable: fx })
        : new Polynomial([fx]);
    const expTerm = poly.is.zero() ? 1 : `${base}^{${poly}}`;
    super(coeff, expTerm);
    this.fx = poly;
    this.base = base;
    this.kind = "exp-fn";
    this.type = "exp-fn";
  }

  /**
   * @overload
   * @param {number|Fraction|ExpFn} x - the other term to multiply with
   * @returns {ExpFn} the product of the two terms
   */
  /**
   * @overload
   * @param {string|Term} x - the other term to multiply with
   * @returns {Term} the product of the two terms
   */
  /**
   * term multiplication
   * @param {number|Fraction|string|Term|ExpFn} x - the other term to multiply with
   * @returns {Term|ExpFn} the product of the two terms
   */
  times(x) {
    if (typeof x === "number" || x instanceof Fraction) {
      return new ExpFn(this.fx, {
        base: this.base,
        coeff: this.coeff.times(x),
      });
    } else if (x instanceof ExpFn) {
      if (this.base !== x.base) {
        throw new Error(
          `Cannot multiply two exp functions with different bases: ${this.base} and ${x.base}`
        );
      }
      return new ExpFn(this.fx.plus(x.fx), {
        base: this.base,
        coeff: this.coeff.times(x.coeff),
      });
    }
    return super.times(x);
  }

  /**
   * reciprocal
   * @returns {ExpFn} the reciprocal of the term
   */
  reciprocal() {
    return new ExpFn(this.fx.negative(), {
      base: this.base,
      coeff: this.coeff.reciprocal(),
    });
  }

  /**
   * @overload
   * @param {number|Fraction|ExpFn} x - the other term to divided by
   * @returns {ExpFn} the quotient of the two terms
   */
  /**
   * @overload
   * @param {string|Term} x - the other term to divided by
   * @returns {Term} the quotient of the two terms
   */
  /**
   * term division
   * @param {number|Fraction|string|Term|ExpFn} x - the other term to divided by
   * @returns {Term|ExpFn} the quotient of the two terms
   */
  divide(x) {
    if (typeof x === "number" || x instanceof Fraction) {
      return new ExpFn(this.fx, {
        base: this.base,
        coeff: this.coeff.divide(x),
      });
    }
    if (x instanceof ExpFn) {
      if (this.base !== x.base) {
        throw new Error(
          `Cannot divide two exp functions with different bases: ${this.base} and ${x.base}`
        );
      }
      return new ExpFn(this.fx.minus(x.fx), {
        base: this.base,
        coeff: this.coeff.divide(x.coeff),
      });
    }
    return super.divide(x);
  }

  /**
   * negative
   * @returns {Term} the negative of the term
   * */
  negative() {
    return this.times(-1);
  }

  /**
   * absolute value
   * @returns {Term} the absolute value of the term
   */
  abs() {
    if (this.coeff.is.negative()) {
      return this.negative();
    }
    return this;
  }

  /**
   * differentiate
   * @returns {ExpFn} the derivative of the term
   * Only works for linear fx
   */
  differentiate() {
    if (this.fx.degree !== 1) {
      throw new Error(`Differentiation only supported for linear fx. ${this}`);
    }
    if (this.base !== "\\operatorname{e}") {
      throw new Error(`Differentiation only supported for base e. ${this}`);
    }
    return new ExpFn(this.fx, { coeff: this.coeff.times(this.fx.coeffs[1]) });
  }

  /**
   * integrate
   * @returns {ExpFn} the integral of the term
   * Only works for linear fx. for non-linear fx, we assume an f'(x) term is already present
   * only works for base e
   */
  integrate() {
    if (this.base !== "\\operatorname{e}") {
      throw new Error(`Differentiation only supported for base e. ${this}`);
    }
    if (this.fx.degree === 1) {
      return new ExpFn(this.fx, {
        coeff: this.coeff.divide(this.fx.coeffs[1]),
      });
    }
    return new ExpFn(this.fx, { coeff: this.coeff });
  }

  /**
   * sub in many
   * @param {number|Fraction} variableToValue - the values to sub in with the key being the variable signature.
   * If a number of Fraction is received, we assume that the variable is 'x'
   * @returns {ExpFn} the term with the values subbed in
   */
  subIn(variableToValue) {
    const subbedFx = this.fx.subIn(variableToValue);
    return new ExpFn(subbedFx, { base: this.base, coeff: this.coeff });
  }

  /**
   * solves k exp(f(x)) = rhs, where f(x) is of the form nx
   * @param {number|Fraction} rhs - the rhs
   * @return {LnFn} the solution
   */
  solve(rhs) {
    // k exp(f(x)) = rhs
    // nx = ln(rhs/k)
    // x = ln(rhs/k) / n
    if (this.fx.coeffs.length === 2 && this.fx.coeffs[0].is.zero()) {
      const base = this.base === "\\operatorname{e}" ? undefined : this.base;
      return new LnFn(numberToFraction(rhs).divide(this.coeff), {
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
      if (this.fx.is.zero()) {
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
 * @property {"ln-fn"} kind - mathlify kind
 * @property {"ln-fn"} type - mathlify type
 */
export class LnFn extends Term {
  /** @type {string} */
  log;
  /** @type {Polynomial} */
  fx;
  /** @type {number|string} */
  base;
  /** @type {"ln-fn"} */
  kind;
  /** @type {"ln-fn"} */
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
        ? Polynomial.ofDegree(1, { variable: fx })
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
    this.kind = "ln-fn";
    this.type = "ln-fn";
  }

  /**
   * move the coeff up to f(x)
   */
  coeffToPower() {
    return new LnFn(this.fx.pow(this.coeff), { base: this.base, coeff: 1 });
  }

  /**
   * @param {LnFn} x - the other term to add with
   * @returns {LnFn} the sum of the two terms
   */
  plus(x) {
    if (this.base !== x.base) {
      throw new Error(
        `Cannot add two ln functions with different bases: ${this.base} and ${x.base}`
      );
    }
    if (this.coeff.is.equalTo(x.coeff)) {
      return new LnFn(this.fx.times(x.fx), {
        base: this.base,
        coeff: this.coeff,
      });
    }
    const thisTerm = this.coeffToPower();
    x = x.coeffToPower();
    return new LnFn(thisTerm.fx.times(x.fx), { base: this.base, coeff: 1 });
  }

  /**
   * @param {LnFn} x -
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
   * change base
   * @param {number|string} newBase - the new base
   * @returns {[LnFn, LnFn, RationalTerm]} the new numerator and denominator, as well as the fraction in RationalTerm class
   */
  changeBase(newBase) {
    if (typeof this.base === "string") {
      throw new Error(
        `Cannot change base of ${this} because change of base only supported for numeric bases for now`
      );
    }
    if (this.base === newBase) {
      const den = new LnFn(this.base, { base: this.base });
      return [this, den, new RationalTerm(this, den)];
    }
    const numerator = new LnFn(this.fx, {
      base: newBase,
      coeff: this.coeff.num,
    });
    const denominator = new LnFn(this.base, {
      base: newBase,
      coeff: this.coeff.den,
    });
    return [numerator, denominator, new RationalTerm(numerator, denominator)];
  }

  /**
   * @overload
   * @param {number|Fraction} x - the other term to multiply with
   * @returns {LnFn} the product of the two terms
   */
  /**
   * @overload
   * @param {string|Term} x - the other term to multiply with
   * @returns {Term} the product of the two terms
   */
  /**
   * term multiplication
   * @param {number|Fraction|string|Term} x - the other term to multiply with
   * @returns {Term|LnFn} the product of the two terms
   */
  times(x) {
    if (typeof x === "number" || x instanceof Fraction) {
      return new LnFn(this.fx, {
        base: this.base,
        coeff: this.coeff.times(x),
      });
    }
    return super.times(x);
  }

  /**
   * @overload
   * @param {number|Fraction} x - the other term to divided by
   * @returns {LnFn} the quotient of the two terms
   */
  /**
   * @overload
   * @param {string|Term} x - the other term to divided by
   * @returns {Term} the quotient of the two terms
   */
  /**
   * term division
   * @param {number|Fraction|string|Term} x - the other term to divided by
   * @returns {Term|LnFn} the quotient of the two terms
   */
  divide(x) {
    if (typeof x === "number" || x instanceof Fraction) {
      return new LnFn(this.fx, {
        base: this.base,
        coeff: this.coeff.divide(x),
      });
    }
    return super.divide(x);
  }

  /**
   * negative
   * @returns {LnFn} the negative of the term
   * */
  negative() {
    return this.times(-1);
  }

  /**
   * sub in many
   * @param {number|Fraction} variableToValue - the values to sub in with the key being the variable signature.
   * If a number of Fraction is received, we assume that the variable is 'x'
   * @returns {LnFn} the term with the values subbed in
   */
  subIn(variableToValue) {
    const subbedFx = this.fx.subIn(variableToValue);
    return new LnFn(subbedFx, { base: this.base, coeff: this.coeff });
  }

  /**
   * solves k ln(f(x)) = rhs, where f(x) is of the form nx
   * @param {number|Fraction} rhs - the rhs
   * @return {ExpFn} the solution
   */
  solve(rhs) {
    // k ln(f(x)) = rhs
    // nx = exp(rhs/k)
    // x = exp(rhs/k) / n
    if (this.fx.coeffs.length === 2 && this.fx.coeffs[0].is.zero()) {
      const base = this.base === "\\textrm{e}" ? undefined : this.base;
      return new ExpFn(numberToFraction(rhs).divide(this.coeff), {
        base,
        coeff: this.fx.coeffs[1].reciprocal(),
      });
    }
    throw new Error(
      `Cannot solve ${this} = ${rhs} because the exponent is not of the form nx`
    );
  }

  /**
   * differentiate
   * @returns {RationalFn} the derivative of the term
   */
  differentiate() {
    return new RationalFn(this.fx.differentiate().times(this.coeff), this.fx);
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
