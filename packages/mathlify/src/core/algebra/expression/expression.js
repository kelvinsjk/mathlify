// the termPowerMap contains a map of all the terms that have appeared in the expression in order, but may contain terms with zero coefficients
// the terms array removes any such terms with zero coefficients

import { Fraction } from "../../fraction.js";
import { Term, powerMapToTerm } from "../term/index.js";

/** Expression class
 * @property {Map<string,Fraction>} termCoeffMap - the terms in the expression, where the key is the term signature and the value is the coefficient
 * @property {Map<string,Map<string,Fraction>>} termPowerMap - key: term signature, value: term's power map
 * @property {Map<string,boolean>} termFractionalDisplayMap - key: term signature, value: the fractionalDisplayMode of the term
 * @property {Term[]} terms - array of terms in the expression
 * @property {"expression"} kind - mathlify expression class kind
 * @property {"expression"|"expression-term"} type - mathlify expression class type
 */
export class Expression {
  /**
   * @constructor
   * Creates an Expression instance
   * TODO: brackets handling
   * @param {(number|Fraction|string|Term|{term: number|Fraction|string|Term, addition?: boolean}|(number|Fraction|string)[])[]} terms - terms of the expression
   *
   * The terms are added by default. Use the {term, addition} type to specify whether to add or subtract the term.
   */
  constructor(...terms) {
    if (terms.length === 0) {
      throw new Error("Expression must have at least one term");
    }
    /** @type {Map<string,Fraction>} */
    const termCoeffMap = new Map();
    /** @type {Map<string,Map<string,Fraction>>} */
    const termPowerMap = new Map();
    /** @type {Map<string,boolean>} */
    const termFractionalDisplayMap = new Map();
    terms.forEach((term) => {
      if (typeof term === "number" || term instanceof Fraction) {
        //! numbers/Fractions
        const currentConstant = termCoeffMap.get("") ?? new Fraction(0);
        termCoeffMap.set("", currentConstant.plus(term));
      } else if (typeof term === "string") {
        //! strings
        const currentConstant = termCoeffMap.get(term) ?? new Fraction(0);
        termCoeffMap.set(term, currentConstant.plus(1));
        if (!termPowerMap.has(term)) {
          termPowerMap.set(term, new Map([[term, new Fraction(1)]]));
        }
        if (!termFractionalDisplayMap.has(term)) {
          termFractionalDisplayMap.set(term, false);
        }
      } else if (term instanceof Term || Array.isArray(term)) {
        if (Array.isArray(term)) {
          term = new Term(...term);
        }
        //! Term
        // serialize variables
        const variable = term.signature;
        const currentConstant = termCoeffMap.get(variable) ?? new Fraction(0);
        termCoeffMap.set(variable, currentConstant.plus(term.coeff));
        if (!termPowerMap.has(variable)) {
          termPowerMap.set(variable, term.powerMap);
        }
        if (!termFractionalDisplayMap.has(variable)) {
          termFractionalDisplayMap.set(variable, term.fractionalDisplayMode);
        }
      } else {
        //! {term, addition} type
        if (typeof term.term === "number" || term.term instanceof Fraction) {
          const currentConstant = termCoeffMap.get("") ?? new Fraction(0);
          if (term.addition === false) {
            termCoeffMap.set("", currentConstant.minus(term.term));
          } else {
            termCoeffMap.set("", currentConstant.plus(term.term));
          }
        } else if (typeof term.term === "string") {
          const currentConstant =
            termCoeffMap.get(term.term) ?? new Fraction(0);
          if (term.addition === false) {
            termCoeffMap.set(term.term, currentConstant.minus(1));
          } else {
            termCoeffMap.set(term.term, currentConstant.plus(1));
          }
          if (!termPowerMap.has(term.term)) {
            termPowerMap.set(
              term.term,
              new Map([[term.term, new Fraction(1)]])
            );
          }
          if (!termFractionalDisplayMap.has(term.term)) {
            termFractionalDisplayMap.set(term.term, false);
          }
        } else {
          // term.term of Term type
          const variable = term.term.signature;
          const currentConstant = termCoeffMap.get(variable) ?? new Fraction(0);
          if (term.addition === false) {
            termCoeffMap.set(variable, currentConstant.minus(term.term.coeff));
          } else {
            termCoeffMap.set(variable, currentConstant.plus(term.term.coeff));
          }
          if (!termPowerMap.has(variable)) {
            termPowerMap.set(variable, term.term.powerMap);
          }
          if (!termFractionalDisplayMap.has(variable)) {
            termFractionalDisplayMap.set(
              variable,
              term.term.fractionalDisplayMode
            );
          }
        }
      }
    });
    this.termCoeffMap = termCoeffMap;
    this.termPowerMap = termPowerMap;
    this.termFractionalDisplayMap = termFractionalDisplayMap;
    /** @type {Term[]} */
    const termsArray = [];
    //! recreate terms from termCoeffMap and termPowerMap
    termCoeffMap.forEach((coeff, variable) => {
      if (coeff.is.not.zero()) {
        const newTerm = powerMapToTerm(this.termPowerMap.get(variable), coeff);
        if (this.termFractionalDisplayMap.get(variable)) {
          newTerm.setFractionalDisplay();
        }
        termsArray.push(newTerm);
      }
    });
    this.terms = termsArray;
    this.kind = "expression";
    this.type = this.terms.length <= 1 ? "expression-term" : "expression";
  }

  /** add terms to this Expression
   * @param {number|Fraction|string|Term} x - term to be added
   * @returns {Expression} - the new Expression
   */
  plus(x) {
    return new Expression(...this.terms, x);
  }

  /** subtract terms from this Expression
   * @param {number|Fraction|string|Term} x - term to be subtracted
   * @returns {Expression} - the new Expression
   */
  minus(x) {
    return new Expression(...this.terms, { term: x, addition: false });
  }

  /**
   * expression multiplication
   * @param {number|Fraction|string|Term|Expression} x - term to be multiplied
   * @returns {Expression} - the new Expression
   */
  times(x) {
    if (x instanceof Expression) {
      /** @type {Term[]} */
      const newTerms = [];
      this.terms.forEach((term) => {
        x.terms.forEach((xTerm) => {
          newTerms.push(term.times(xTerm));
        });
      });
      return new Expression(...newTerms);
    }
    const newTerms = this.terms.map((term) => term.times(x));
    return new Expression(...newTerms);
  }

  /**
   * sub in a value for a variable
   * @param {{[key: string]: number|Fraction}|number|Fraction} variableToValue - the values to sub in with the key being the variable signature.
   * @returns {Expression} - the new Expression
   */
  subIn(variableToValue) {
    const newTerms = this.terms.map((term) => term.subIn(variableToValue));
    return new Expression(...newTerms);
  }

  /** methods to cast this term to other types */
  cast = {
    /**
     * cast to Term type
     * @returns {Term} the term representation of this term
     */
    toTerm: () => {
      if (this.terms.length === 0) {
        return new Term(0);
      } else if (this.terms.length === 1) {
        return this.terms[0];
      }
      throw new Error(`cannot cast ${this} to Term: more than 1 term detected`);
    },
    /**
     * cast to Fraction type
     * @returns {Fraction} the fraction representation of this term
     */
    toFraction: () => {
      if (this.terms.length === 0) {
        return new Fraction(0);
      } else if (this.terms.length === 1) {
        return this.terms[0].cast.toFraction();
      }
      throw new Error(
        `cannot cast ${this} to Fraction: more than 1 term detected`
      );
    },
  };

  /** toString
   * @returns {string} - the LaTeX string representation of the Expression
   */
  toString() {
    if (this.terms.length === 0) {
      return "0";
    }
    return this.terms.reduce((prev, term, i) => {
      if (i !== 0 && term.coeff.is.positive()) {
        return `${prev} + ${term}`;
      }
      const space = i === 0 ? "" : " ";
      return `${prev}${space}${term}`;
    }, "");
  }
}
