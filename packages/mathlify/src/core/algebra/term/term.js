// a term is made up of a coefficient
// and a collection of symbols (which we will call atoms)
// under exponentiation and multiplication
//
// TODO: handle surds and functions
// - surds (eg sqrt{2}) (TODO)
// - functions (eg sin(x)) (TODO)
// we will perform automatic simplification
// TODO: refactor fractionalDisplayMode handling

import { Fraction } from "../../fraction.js";
import { numberToFraction } from "../../../utils/toFraction.js";
import { powerMapToString } from "../utils/index.js";

/** Term class
 * @class
 * @property {Fraction} coeff - the coefficient of the term
 * @property {Map<string,Fraction>} powerMap - the key is the variable atom, the value is the power
 * @property {string} signature - a string representation of the (sorted) variables
 * @property {"never"|"auto"|"always"} fractionalDisplayMode - default: auto. typesets as coeff followed by fraction (eg 3/5 x) if no negative indices for the variable atoms, but
 * as a fraction if negative indices encountered (eg 3x / 5y). "never" will also typeset as coeff followed by fraction, resorting to negative indices.
 * "always" will always typeset as a fraction as long as the denominator is not 1
 * @property {"term"|"rational-term"|"expansion-term"|"sqrt"} kind - mathlify term class
 * @property {"term"|"term-frac"|"rational-term"|"rational-expression"|"expansion-term"|"sqrt"|"sqrt-rational"} type - mathlify term class
 */
export class Term {
  /** @type {Fraction} */
  coeff;
  /** @type {Map<string,Fraction>} */
  powerMap;
  /** @type {string} */
  signature;
  /** @type {"never"|"auto"|"always"} */
  fractionalDisplayMode;
  /** @type {"term"|"rational-term"|"expansion-term"|"sqrt"} */
  kind;
  /** @type {"term"|"term-frac"|"rational-term"|"rational-expression"|"expansion-term"|"sqrt"|"sqrt-rational"} */
  type;

  /**
   * @constructor
   * Creates a Term instance, automatically simplifying all terms by grouping them together
   * under a "PowerTerm"
   * TODO: update different types of symbols
   * @param {(Fraction|string|number|{variable: string, power: number|Fraction}|[string,number|Fraction])[]} args -
   * the constituents of the term (either number or fraction or string)
   */
  constructor(...args) {
    /** @type {Map<string,Fraction>} */
    const powerMap = new Map();
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
    //! remove all zero powers
    powerMap.forEach((power, variable) => {
      if (power.is.zero()) {
        powerMap.delete(variable);
      }
    });
    //! sort the powerMap for term signature
    const sortedPowerMap = new Map([...powerMap].sort());
    this.coeff = coeff;
    this.powerMap = powerMap;
    this.signature = powerMapToString(sortedPowerMap);
    this.kind = "term";
    this.type = this.powerMap.size === 0 ? "term-frac" : "term";
    this.fractionalDisplayMode = "auto";
  }

  /**
   * term multiplication
   * @param {number|Fraction|string|Term} x - the other term to multiply with
   * @param {{fractionalDisplayMode: "never"|"auto"|"always"}} [options] - the fractional display mode to set on the result (defaults to mode of this)
   * @returns {Term} the product of the two terms
   */
  times(x, options) {
    /** @type {Term} */
    let newTerm;
    if (typeof x === "number" || x instanceof Fraction) {
      newTerm = powerMapToTerm(this.powerMap, this.coeff.times(x));
    } else if (typeof x === "string") {
      const newPowerMap = new Map(this.powerMap);
      const currentPower = newPowerMap.get(x) ?? new Fraction(0);
      newPowerMap.set(x, currentPower.plus(1));
      newTerm = powerMapToTerm(newPowerMap, this.coeff);
    } else {
      // x is a term
      const newPowerMap = new Map(this.powerMap);
      x.powerMap.forEach((power, variable) => {
        const currentPower = newPowerMap.get(variable) ?? new Fraction(0);
        newPowerMap.set(variable, currentPower.plus(power));
      });
      newTerm = powerMapToTerm(newPowerMap, this.coeff.times(x.coeff));
    }
    if (options) {
      newTerm.setDisplayMode(options.fractionalDisplayMode);
    } else {
      newTerm.setDisplayMode(this.fractionalDisplayMode);
    }
    return newTerm;
  }

  /**
   * reset coeff: changes the coefficient of the term to 1
   * @returns {Term} the term with coefficient 1
   */
  resetCoeff() {
    const newTerm = powerMapToTerm(this.powerMap, new Fraction(1));
    newTerm.setDisplayMode(this.fractionalDisplayMode);
    return newTerm;
  }

  /**
   * reciprocal
   * @param {{fractionalDisplayMode: "never"|"auto"|"always"}} [options] - the fractional display mode to set on the result (defaults to mode of this)
   * @returns {Term} the reciprocal of the term
   */
  reciprocal(options) {
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
   * term division
   * @param {number|Fraction|string|Term} x - the other term to divide with
   * @param {{fractionalDisplayMode: "never"|"auto"|"always"}} [options] - the fractional display mode to set on the result (defaults to mode of this)
   * @returns {Term} the quotient of the two terms
   */
  divide(x, options) {
    if (!(x instanceof Term)) {
      x = new Term(x);
    }
    return this.times(x.reciprocal(options), options);
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
   * sub in many
   * @param {{[key: string]: number|Fraction}|number|Fraction} variableToValue - the values to sub in with the key being the variable signature.
   * If a number of Fraction is received, we assume that the variable is 'x'
   * @returns {Term} the term with the values subbed in
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
          throw new Error(
            `Non-integral powers not supported at the moment. Unable to sub ${value} for ${variable} in ${this}.`
          );
        }
        newCoeff = newCoeff.times(numberToFraction(value).pow(power.num));
        newPowerMap.delete(variable);
      }
    }
    return powerMapToTerm(newPowerMap, newCoeff);
  }

  /** methods to cast this term to other types */
  cast = {
    /**
     * cast to Fraction type
     * @returns {Fraction} the fraction representation of this term
     */
    toFraction: () => {
      if (this.is.constant()) {
        return this.coeff;
      }
      throw new Error(`cannot cast ${this} to Fraction: variables detected`);
    },
  };

  /**
   * boolean methods for this term
   */
  is = {
    /**
     * whether this term is a constant (ie can be cast to Fraction class)
     */
    constant: () => {
      return this.powerMap.size === 0;
    },

    /**
     * checks if two terms are equal (same signature and same coefficient)
     * @param {Term|number|Fraction|string} term2
     * @return {boolean}
     */
    equalTo: (term2) => {
      if (!(term2 instanceof Term)) {
        term2 = new Term(term2);
      }
      return (
        this.coeff.is.equalTo(term2.coeff) && this.signature === term2.signature
      );
    },

    /**
     * checks if two terms are alike (same signature)
     * @param {Term|number|Fraction|string} term2
     * @return {boolean}
     */
    like: (term2) => {
      if (!(term2 instanceof Term)) {
        term2 = new Term(term2);
      }
      return this.signature === term2.signature;
    },

    not: {
      constant: () => !this.is.constant(),
      /** @param {Term|number|Fraction|string} term2 */
      equalTo: (term2) => !this.is.equalTo(term2),
      /** @param {Term|number|Fraction|string} term2 */
      like: (term2) => !this.is.like(term2),
    },
  };

  /**
   * change the fractional display mode
   * WARNING: changes the term in place
   * @param {"never"|"auto"|"always"} mode - the fractional handling mode
   * @returns {Term} reference to current term
   * */
  setDisplayMode(mode) {
    this.fractionalDisplayMode = mode;
    return this;
  }

  // PRIMITIVE RETURN TYPES
  /**
   * casts this term as a latex string
   * @returns {string} the latex string representation of this term
   */
  toString() {
    // if no terms, return the coefficient
    if (this.powerMap.size === 0) {
      return `${this.coeff}`;
    }
    if (this.coeff.is.zero()) {
      return "0";
    }
    //!: fractional display mode never: coeff variable return;
    if (this.fractionalDisplayMode === "never") {
      // if there are terms, return the coefficient times the terms
      const variable = powerMapToString(this.powerMap);
      // special cases: coeff===1, coeff===-1, coeff===0
      if (this.coeff.abs().is.equalTo(1)) {
        return this.coeff.is.equalTo(1) ? `${variable}` : `- ${variable}`;
      }
      return `${this.coeff} ${variable}`;
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
        return `${this.coeff} ${numeratorVariable}`;
      }
      //!: all other cases: fraction return;
      const numeratorVariable = powerMapToString(numeratorPowerMap);
      const denominatorVariable = powerMapToString(denominatorPowerMap);
      if (this.coeff.den === 1 && denominatorVariable === "") {
        if (this.coeff.abs().is.equalTo(1)) {
          return this.coeff.is.equalTo(1)
            ? `${numeratorVariable}`
            : `- ${numeratorVariable}`;
        }
        return `${this.coeff} ${numeratorVariable}`;
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
        const num = this.coeff.abs().num;
        numerator = `${num} ${numeratorVariable}`;
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
