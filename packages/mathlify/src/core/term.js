// a term is implemented as
// $ k \prod_{i=1}^m (v_i)^{n_i} $

import { Fraction, numberToFraction } from "./fraction.js";
import { powerMapToString } from "./utils/powerMapToString.js";

/**
 * @typedef {import('./types.js').TermType} TermType
 */

/** Term class
 * @class
 * @property {Fraction} coeff the coefficient of the term
 * @property {Map<string,Fraction>} powerMap Map object with the key is the variable string and the value is the power/index
 * @property {string} signature a string representation of the (sorted) variables. useful for determining if two terms are alike
 * @property {"never"|"auto"|"always"} fractionalDisplayMode default: auto. For example, consider the terms 2x/5 and 2x/5y.
 * In auto mode, they will be typeset as $\frac{2}{5} x$ and $\frac{2 x}{5 y}$ respectively.
 * In never mode, they will be typeset as $\frac{2}{5} x$ and $\frac{2}{5} x y^{-1}$.
 * In always mode, they will be typeset as $\frac{2}{5 x}$ and $\frac{2 x}{5 y}$
 * @property {TermType} type - mathlify term class
 */
export class Term {
  /** @type {Fraction} */
  coeff;
  /** @type {Map<string,Fraction>}
   * map of variable string as key and index/power as the value
   */
  powerMap;
  /** @type {string} */
  signature;
  /** @type {"never"|"auto"|"always"} */
  fractionalDisplayMode;
  /** @type {TermType} */
  type;

  /**
   * @constructor
   * Creates a Term instance, automatically combining all like variables using powers
   * @param {(number|Fraction|string|{variable: string, power: number|Fraction}|[string,number|Fraction])[]} args
   * the constituents of the term (either number or fraction or string)
   * @warning to change the fractionalDisplayMode, use the setDisplayMode method
   */
  constructor(...args) {
    /** @type {Map<string,Fraction>} */
    let powerMap = new Map();
    let coeff = new Fraction(1);
    //! run through each coefficient
    args.forEach((x) => {
      if (typeof x === "number" || x instanceof Fraction) {
        coeff = coeff.times(x);
      } else if (typeof x === "string") {
        if (x === "") {
          return;
        }
        powerMap.set(x, new Fraction(1));
      } else if (Array.isArray(x)) {
        // [variable, power] type
        const [variable, power] = x;
        const currentPower = powerMap.get(variable) ?? new Fraction(0);
        powerMap.set(variable, currentPower.plus(power));
      } else {
        // {variable, power} type
        const currentPower = powerMap.get(x.variable) ?? new Fraction(0);
        powerMap.set(x.variable, currentPower.plus(x.power));
      }
    });
    //! loop over. remove all zero powers
    powerMap.forEach((power, variable) => {
      if (power.is.zero()) {
        powerMap.delete(variable);
      }
    });
    if (coeff.is.zero()) {
      powerMap = new Map();
    }
    //! sort the powerMap for term signature
    const sortedPowerMap = new Map([...powerMap].sort());
    this.coeff = coeff;
    this.powerMap = powerMap;
    this.signature = powerMapToString(sortedPowerMap);
    this.type = "term";
    this.fractionalDisplayMode = "auto";
  }

  /** @type {string[]} */
  get variables() {
    return Array.from(this.powerMap.keys());
  }

  //! set options
  /**
   * @param {"never"|"auto"|"always"} mode the fractional handling mode
   * @returns {Term} reference to current term
   * @warning modifies current instance
   * */
  setDisplayMode(mode) {
    this.fractionalDisplayMode = mode;
    return this;
  }

  //! boolean methods
  /**
   * boolean methods for this term
   */
  is = {
    /**
     * @returns {boolean} whether this term is a constant (no variables)
     */
    // TODO: improve method when we add more complicated variables (eg pi vs x)
    constant: () => {
      return this.powerMap.size === 0 || this.type === "sqrt";
    },
    /**
     * @returns {boolean} whether this term is rational (ie can be cast to Fraction class)
     */
    rational: () => {
      return this.powerMap.size === 0;
    },
    /**
     * @param {Term|number|Fraction|string} term2
     * @return {boolean} whether the two terms are equal (have same signature and coefficient)
     */
    equalTo: (term2) => {
      if (!(term2 instanceof Term)) {
        term2 = new Term(term2);
      }
      return (
        this.signature === term2.signature && this.coeff.is.equalTo(term2.coeff)
      );
    },
    /**
     * @param {Term|number|Fraction|string} term2
     * @return {boolean} whether the two terms are alike (have same signature)
     */
    like: (term2) => {
      if (!(term2 instanceof Term)) {
        term2 = new Term(term2);
      }
      return this.signature === term2.signature;
    },
    not: {
      /**
       * @returns whether this term is not a constant (ie variables present)
       */
      constant: () => !this.is.constant(),
      /**
       * @returns whether this term is not rational (ie variables present)
       */
      rational: () => !this.is.rational(),
      /**
       * @param {Term|number|Fraction|string} term2
       * @returns {boolean} whether the two terms are not equal to each other
       * */
      equalTo: (term2) => !this.is.equalTo(term2),
      /**
       * @param {Term|number|Fraction|string} term2
       * @returns {boolean} whether the two terms are not alike (ie different term signature)
       * */
      like: (term2) => !this.is.like(term2),
    },
  };

  //! casting methods
  /** methods to cast this term to other types */
  cast = {
    /**
     * @returns {Fraction} the fraction representation of this term
     */
    toFraction: () => {
      if (this.is.rational()) {
        return this.coeff;
      }
      throw new Error(
        `cannot cast ${this.toTex()} to Fraction: variables detected`
      );
    },
  };

  //! arithmetic methods
  /**
   * @param {number|Fraction|string|Term|[string,number|Fraction]} x the other term to multiply with
   * @param {{fractionalDisplayMode: "never"|"auto"|"always"}} [options] - the fractional display mode to set on the result (defaults to mode of this)
   * @returns {Term} the product of the two terms
   */
  times(x, options) {
    /** @type {Term} */
    let newTerm;
    // if this is of fraction type, take other term's form
    if (this.is.rational() && x instanceof Term) {
      newTerm = x.times(this.cast.toFraction());
    } else {
      if (typeof x === "number" || x instanceof Fraction) {
        newTerm = powerMapToTerm(this.powerMap, this.coeff.times(x));
      } else if (typeof x === "string") {
        const newPowerMap = new Map(this.powerMap);
        const currentPower = newPowerMap.get(x) ?? new Fraction(0);
        newPowerMap.set(x, currentPower.plus(1));
        newTerm = powerMapToTerm(newPowerMap, this.coeff);
      } else {
        if (Array.isArray(x)) {
          x = new Term(x);
        }
        // x is a term
        const newPowerMap = new Map(this.powerMap);
        x.powerMap.forEach((power, variable) => {
          const currentPower = newPowerMap.get(variable) ?? new Fraction(0);
          newPowerMap.set(variable, currentPower.plus(power));
        });
        newTerm = powerMapToTerm(newPowerMap, this.coeff.times(x.coeff));
      }
    }
    if (options) {
      newTerm.setDisplayMode(options.fractionalDisplayMode);
    } else {
      newTerm.setDisplayMode(this.fractionalDisplayMode);
    }
    return newTerm;
  }

  /**
   * @param {{fractionalDisplayMode: "never"|"auto"|"always"}} [options] - the fractional display mode to set on the result (defaults to mode of this)
   * @returns {Term} the reciprocal of the term
   */
  reciprocal(options) {
    if (this.coeff.is.zero()) {
      throw new Error(`Cannot take reciprocal of the zero term`);
    }
    const newPowerMap = new Map(this.powerMap);
    newPowerMap.forEach((power, variable) => {
      newPowerMap.set(variable, power.negative());
    });
    const newTerm = powerMapToTerm(newPowerMap, this.coeff.reciprocal());
    if (options) {
      newTerm.setDisplayMode(options.fractionalDisplayMode);
    } else {
      newTerm.setDisplayMode(this.fractionalDisplayMode);
    }
    return newTerm;
  }
  /**
   * @param {number|Fraction|string|Term} x - the other term to divide with
   * @param {{fractionalDisplayMode: "never"|"auto"|"always"}} [options] - the fractional display mode to set on the result (defaults to mode of this)
   * @returns {Term} the quotient this divided by x
   */
  divide(x, options) {
    if (!(x instanceof Term)) {
      x = new Term(x);
    }
    if (x.coeff.is.zero()) {
      throw new Error(`Cannot divide by the zero term`);
    }
    return this.times(x.reciprocal(options), options);
  }

  /**
   * @returns {Term} the negative of the term
   * */
  negative() {
    return this.times(-1);
  }
  /**
   * @returns {Term} the absolute value of the term (ie make coefficient non-negative)
   */

  /**
   * @param {number|Fraction} n - the power to raise the term to
   * @returns {Term} power of the term
   */
  pow(n) {
    const nFrac = numberToFraction(n);
    if (this.coeff.is.not.one() && !nFrac.is.integer()) {
      throw new Error(`Non-integral powers not supported at the moment`);
    }
    const coeff = this.coeff.is.one() ? this.coeff : this.coeff.pow(nFrac);
    const newPowerMap = new Map();
    this.powerMap.forEach((power, variable) => {
      newPowerMap.set(variable, power.times(nFrac));
    });
    return powerMapToTerm(newPowerMap, coeff);
  }

  abs() {
    if (this.coeff.is.negative()) {
      return this.negative();
    }
    return this;
  }

  /**
   * @returns {Term} the term with same variables but with coefficient 1
   */
  resetCoeff() {
    const newTerm = powerMapToTerm(this.powerMap, new Fraction(1));
    newTerm.setDisplayMode(this.fractionalDisplayMode);
    return newTerm;
  }

  /**
   * @param {{[key: string]: number|Fraction}|number|Fraction} variableToValue - the values to sub in with the key being the variable signature.
   * If a number/Fraction type is received, we assume that the variable is 'x'
   * @returns {Term} the term after the values are subbed in
   */
  subIn(variableToValue) {
    const subInObject =
      typeof variableToValue === "number" || variableToValue instanceof Fraction
        ? { x: variableToValue }
        : variableToValue;
    const newPowerMap = new Map(this.powerMap);
    let newCoeff = this.coeff;
    for (const [variable, value] of Object.entries(subInObject)) {
      if (newPowerMap.has(variable)) {
        const power = newPowerMap.get(variable);
        if (!power?.is.integer()) {
          const valueString =
            typeof value === "number" ? `${value}` : value.toTex();
          throw new Error(
            `Non-integral powers not supported at the moment. Unable to sub ${valueString} for ${variable} in ${this.toTex()}.`
          );
        }
        newCoeff = newCoeff.times(numberToFraction(value).pow(power.num));
        newPowerMap.delete(variable);
      }
    }
    return powerMapToTerm(newPowerMap, newCoeff);
  }

  // PRIMITIVE RETURN TYPES
  /**
   * @returns {string} the latex string representation of this term
   */
  toTex() {
    // if no terms, return the coefficient
    if (this.powerMap.size === 0) {
      return `${this.coeff.toTex()}`;
    }
    //!: fractional display mode never: coeff variable return;
    if (this.fractionalDisplayMode === "never") {
      // if there are terms, return the coefficient times the terms
      const variable = powerMapToString(this.powerMap);
      // special cases: coeff===1, coeff===-1, coeff===0
      if (this.coeff.abs().is.equalTo(1)) {
        return this.coeff.is.equalTo(1) ? `${variable}` : `- ${variable}`;
      }
      return `${this.coeff.toTex()} ${variable}`;
    } else {
      // split into numerator and denominator
      /** @type {Map<string,Fraction>} */
      const numeratorPowerMap = new Map();
      /** @type {Map<string,Fraction>} */
      const denominatorPowerMap = new Map();
      this.powerMap.forEach((power, variable) => {
        if (power.is.positive()) {
          numeratorPowerMap.set(variable, power);
        } else if (power.is.negative()) {
          denominatorPowerMap.set(variable, power.times(-1));
        }
      });
      //!: fractional display mode auto: no denominator detected so we have coeff variable return
      if (
        denominatorPowerMap.size === 0 &&
        this.fractionalDisplayMode === "auto"
      ) {
        const numeratorVariable = powerMapToString(numeratorPowerMap);
        if (this.coeff.abs().is.equalTo(1)) {
          return this.coeff.is.equalTo(1)
            ? `${numeratorVariable}`
            : `- ${numeratorVariable}`;
        }
        return `${this.coeff.toTex()} ${numeratorVariable}`;
      }
      //!: all other cases: fraction return;
      const numeratorVariable = powerMapToString(numeratorPowerMap);
      const denominatorVariable = powerMapToString(denominatorPowerMap);
      // no denominators detected
      if (this.coeff.den === 1 && denominatorVariable === "") {
        if (this.coeff.abs().is.equalTo(1)) {
          return this.coeff.is.equalTo(1)
            ? `${numeratorVariable}`
            : `- ${numeratorVariable}`;
        }
        return `${this.coeff.toTex()} ${numeratorVariable}`;
      }
      let numerator = "",
        denominator = "",
        sign = "";
      // handle sign
      if (this.coeff.num < 0) {
        sign = "- ";
      }
      // handle numerator
      if (numeratorVariable === "") {
        numerator = `${this.coeff.abs().num}`;
      } else if (this.coeff.abs().num === 1) {
        numerator = numeratorVariable;
      } else {
        const numCoeff = this.coeff.abs().num;
        numerator = `${numCoeff} ${numeratorVariable}`;
      }
      // handle denominator
      if (denominatorVariable === "") {
        denominator = `${this.coeff.den}`;
      } else if (this.coeff.den === 1) {
        denominator = denominatorVariable;
      } else {
        denominator = `${this.coeff.den} ${denominatorVariable}`;
      }
      return `${sign}\\frac{${numerator}}{${denominator}}`;
    }
  }

  toString() {
    return this.toTex();
  }

  //! serialize toJSON
  /**
   * @typedef {import('./types.js').TermJSON} TermJSON
   * @typedef {import('./types.js').FractionJSON} FractionJSON
   */

  /**
   * serializes term object. can be used with the static
   * `Term.FromJSON` method to recreate this term
   * class instance
   * @returns {TermJSON}
   */
  toJSON() {
    /** @type {[FractionJSON, ...[string, FractionJSON][]]} */
    const args = [this.coeff.toJSON()];
    this.powerMap.forEach((power, variable) => {
      args.push([variable, power.toJSON()]);
    });
    return {
      type: "term",
      coeff: this.coeff.toTex(),
      signature: this.signature,
      args,
    };
  }

  //! static methods
  /**
   * re-instantiate Term class instance from JSON object literal
   * @param {TermJSON} t JSON object literal obtained from JSON.parse
   * @returns {Term} Term class instance
   */
  static fromJSON(t) {
    const [coeff, ...args] = t.args;
    /** @type {[string, Fraction][]} */
    const args2 = args.map((val) => {
      const [variable, power] = val;
      return [variable, Fraction.fromJSON(power)];
    });
    return new Term(Fraction.fromJSON(coeff), ...args2);
  }
}

/**
 * recreates Term objects from a power map
 * @param {Map<string,Fraction>|undefined} powerMap - the power map to be converted
 * @param {Fraction?} coeff - the coefficient of the term (optional)
 * @returns {Term} the term object
 */
export function powerMapToTerm(powerMap, coeff) {
  /** @type {(Fraction|{variable: string, power: Fraction})[]} */
  const termAtoms = [];
  if (coeff) {
    termAtoms.push(coeff);
  }
  if (powerMap) {
    powerMap.forEach((power, variable) => {
      termAtoms.push({ variable, power });
    });
  }
  return new Term(...termAtoms);
}
