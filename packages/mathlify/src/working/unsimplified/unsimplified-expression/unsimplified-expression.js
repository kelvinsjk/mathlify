// the unsimplified expression class is a collection of terms under addition,
// without the automatic combination of like terms like in the expression class

import { Fraction, Term, Expression } from "../../../core/index.js";
import { bracket } from "./brackets.js";

/** Unsimplified Expression class
 * @property {Map<string,Term>} termAtomMap the terms in the expression, with coefficient adjusted to 1
 * @property {Term[]} terms - array of terms in the expression
 * @property {({brackets: "off"|"auto"|"always", additions: boolean})[]} termOptions - array indicating whether to typeset term with brackets, and if it is under addition/subtraction
 * @property {"unsimplified-expression"} type - mathlify expression class kind
 */
export class UnsimplifiedExpression {
  /** @type {Map<string,Term>} */
  termAtomMap;
  /** @type {Term[]} */
  terms;
  /** @type {({brackets: "off"|"auto"|"always", addition: boolean})[]} */
  termOptions;
  /** @type {"unsimplified-expression"} */
  type;
  /**
   * @constructor
   * Creates an Expression instance
   * @param {(number|Fraction|string|Term|(number|Fraction|string|{variable: string, power: number|Fraction}|[string,number|Fraction]|Term)[]|{term: number|Fraction|string|Term, brackets?: 'off'|'auto'|'always', addition?: boolean})[]} terms - terms of the expression
   */
  constructor(...terms) {
    if (terms.length === 0) {
      throw new Error("Expression must have at least one term");
    }
    /** @type {Map<string,Term>} */
    const termAtomMap = new Map();
    /** @type {Term[]} */
    const termsArray = [];
    /** @type {({brackets: "off"|"auto"|"always", addition: boolean})[]} */
    const termOptions = [];
    terms.forEach((term) => {
      if (typeof term === "number" || term instanceof Fraction) {
        //! numbers/Fractions
        termsArray.push(new Term(term));
        termOptions.push({
          brackets: termOptions.length === 0 ? "off" : "auto",
          addition: true,
        });
      } else if (typeof term === "string") {
        //! strings
        if (term !== "") {
          termsArray.push(new Term(term));
          if (!termAtomMap.has(term)) {
            termAtomMap.set(term, new Term(term));
          }
          termOptions.push({
            brackets: termOptions.length === 0 ? "off" : "auto",
            addition: true,
          });
        }
      } else if (term instanceof Term || Array.isArray(term)) {
        //! convert array to term
        if (Array.isArray(term)) {
          let newTerm = new Term(1);
          term.forEach((t) => {
            const newT =
              typeof t === "number" ||
              typeof t === "string" ||
              t instanceof Fraction ||
              t instanceof Term
                ? t
                : new Term(t);
            newTerm = newTerm.times(newT);
          });
          term = newTerm;
        }
        //! Term
        // serialize variables
        const variable = term.signature;
        if (!termAtomMap.has(variable)) {
          termAtomMap.set(variable, term.resetCoeff());
        }
        termsArray.push(term);
        termOptions.push({
          brackets: termOptions.length === 0 ? "off" : "auto",
          addition: true,
        });
      } else {
        termsArray.push(
          term.term instanceof Term ? term.term : new Term(term.term)
        );
        termOptions.push({
          brackets:
            term.brackets ?? (termOptions.length === 0 ? "off" : "auto"),
          addition: term.addition ?? true,
        });
      }
    });
    this.termAtomMap = termAtomMap;
    this.termOptions = termOptions;
    this.terms = termsArray.length === 0 ? [new Term(0)] : termsArray;
    this.type = "unsimplified-expression";
  }

  /** @type {string[]} */
  get variables() {
    /** @type {string[]} */
    const variables = [];
    this.termAtomMap.forEach((term) => {
      variables.push(...term.variables);
    });
    return [...new Set(variables)];
  }

  /**
   * simplifies to an Expression class, combining like terms
   * @returns {Expression} the simplified expression
   */
  simplify() {
    const terms = this.terms.map((term, i) => {
      return this.termOptions[i].addition ? term : term.negative();
    });
    return new Expression(...terms);
  }

  //! arithmetic methods
  /**
   * Expression addition
   * @param {number|Fraction|string|Term|UnsimplifiedExpression} x term/expression to be added
   * @returns {UnsimplifiedExpression} the sum of the two
   */
  plus(x) {
    const args = this.terms.map((term, i) => {
      return {
        term,
        brackets: this.termOptions[i].brackets,
        addition: this.termOptions[i].addition,
      };
    });
    return x instanceof UnsimplifiedExpression
      ? new UnsimplifiedExpression(
          ...args,
          ...x.terms.map((term, i) => {
            return {
              term,
              brackets: this.termOptions[i].brackets,
              addition: this.termOptions[i].addition,
            };
          })
        )
      : new UnsimplifiedExpression(...args, x);
  }

  /**
   * @returns {UnsimplifiedExpression} the negative of the expression
   */
  negative() {
    const args = this.terms.map((term, i) => {
      return {
        term,
        brackets: this.termOptions[i].brackets,
        addition: !this.termOptions[i].addition,
      };
    });
    return new UnsimplifiedExpression(...args);
  }

  // /** subtract terms from this Expression
  //  * @param {number|Fraction|string|Term|UnsimplifiedExpression} x - term to be subtracted
  //  * @returns {UnsimplifiedExpression} - the difference this minus x
  //  */
  // minus(x) {
  //   if (typeof x === "number" || typeof x === "string") {
  //     x = new Term(x);
  //   }
  //   return x instanceof UnsimplifiedExpression
  //     ? new UnsimplifiedExpression(...this.terms, ...x.negative().terms)
  //     : new UnsimplifiedExpression(...this.terms, x.negative());
  // }

  // /**
  //  * change order of terms
  //  * @param {number[]} args - the indices of the terms to be placed at the front (0-indexed).
  //  * indices not provided will retain the original order after these terms
  //  * @return {UnsimplifiedExpression} the rearranged expression
  //  */
  // changeOrder(args) {
  //   const terms = this.terms;
  //   /** @type {Term[]} */
  //   const newTerms = [];
  //   args.forEach((arg) => {
  //     newTerms.push(terms[arg]);
  //   });
  //   newTerms.push(...terms.filter((_, i) => !args.includes(i)));
  //   return new UnsimplifiedExpression(...newTerms);
  // }

  // /**
  //  * slice the expression
  //  * @param {number} end - the end index (not inclusive)
  //  * @return {UnsimplifiedExpression} the expression with only terms from term 0 to term end-1
  //  */
  // slice(end) {
  // 	return new UnsimplifiedExpression(...this.terms.slice(0, end));
  // }

  // /**
  //  * gcd of the expression (only supports Fractions at the moment)
  //  * @return {Fraction} the gcd of all the term coefficients
  //  */
  // gcd() {
  // 	if (`${this.toTex()}` === '0') {
  // 		throw new Error(`gcd is not defined for the 0 expression`);
  // 	}
  // 	return Fraction.gcd(...this.terms.map((term) => term.coeff));
  // }

  /**
   * @returns {string} the LaTeX string representation of the Expression
   */
  toTex() {
    return this.terms.reduce((prev, term, i) => {
      const sign =
        i === 0
          ? this.termOptions[i].addition
            ? ""
            : "- "
          : this.termOptions[i].addition
          ? " + "
          : " - ";
      return `${prev}${sign}${bracket(term, {
        mode: this.termOptions[i].brackets,
      })}`;
    }, "");
  }

  toString() {
    return this.toTex();
  }
}
