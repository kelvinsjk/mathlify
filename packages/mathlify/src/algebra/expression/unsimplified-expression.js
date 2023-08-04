import { Fraction, Term, Expression } from "../../core/index.js";
import { bracket } from "../../utils";

/** Unsimplified Expression class
 * TODO: convert Fraction type to Term/Unsimplified Term type
 * @property {{term: Term, brackets: 'off'|'auto'|'always', addition: boolean}[]} terms - the terms in the expression
 * @property {"unsimplified-expression"} kind - mathlify unsimplified expression class kind
 * @property {"unsimplified-expression"} type - mathlify unsimplified expression class type
 */
export class UnsimplifiedExpression {
  /**
   * @constructor
   * Creates an Unsimplified Expression instance
   * @param {(number|Fraction|string|Term|{term: number|Fraction|string|Term, brackets?: 'off'|'auto'|'always', addition?: boolean}|(number|Fraction|string)[])[]} terms -
   * the terms are added by default and
   * brackets is 'off' for the first term and 'auto' by default.
   */
  constructor(...terms) {
    if (terms.length === 0)
      throw new Error("UnsimplifiedExpression must have at least one term");
    /** @type {{term: Term, brackets: 'off'|'auto'|'always', addition: boolean}[]} */
    const parsedTerms = [];
    terms.forEach((term, i) => {
      const t =
        typeof term === "number" || term instanceof Fraction
          ? {
              term: new Term(term),
              /** @type {'off'|'auto'|'always'} */
              brackets: i === 0 ? "off" : "auto",
              addition: true,
            }
          : term instanceof Term
          ? {
              term: term,
              /** @type {'off'|'auto'|'always'} */
              brackets: i === 0 ? "off" : "auto",
              addition: true,
            }
          : typeof term === "string"
          ? {
              term: new Term(term),
              /** @type {'off'|'auto'|'always'} */
              brackets: i === 0 ? "off" : "auto",
              addition: true,
            }
          : Array.isArray(term)
          ? {
              term: new Term(...term),
              /** @type {'off'|'auto'|'always'} */
              brackets: i === 0 ? "off" : "auto",
              addition: true,
            }
          : {
              term: term.term instanceof Term ? term.term : new Term(term.term),
              /** @type {'off'|'auto'|'always'} */
              brackets: term.brackets ?? (i === 0 ? "off" : "auto"),
              addition: term.addition ?? true,
            };
      parsedTerms.push(t);
    });
    this.terms = parsedTerms;
    this.kind = "unsimplified-expression";
    this.type = "unsimplified-expression";
  }

  /** add terms to this Expression
   * @param {number|Fraction} x - term to be added
   * @param {{brackets: 'off'|'auto'|'always'}} [options = {brackets: 'auto'}] - options for the brackets (defaults to auto)
   * @returns {UnsimplifiedExpression} - the new Unsimplified Expression
   */
  plus(x, options = { brackets: "auto" }) {
    return new UnsimplifiedExpression(...this.terms, {
      term: x,
      brackets: options.brackets,
      addition: true,
    });
  }

  /** subtract terms from this Expression
   * @param {number|Fraction} x - term to be subtracted
   * @param {{brackets: 'off'|'auto'|'always'}} [options = {brackets: 'auto'}] - options for the brackets (defaults to auto)
   * @returns {UnsimplifiedExpression} - the new Unsimplified Expression
   */
  minus(x, options = { brackets: "auto" }) {
    return new UnsimplifiedExpression(...this.terms, {
      term: x,
      brackets: options.brackets,
      addition: false,
    });
  }

  /** simplify to Expression class
   * @returns {Expression} - the simplified Expression
   */
  simplify() {
    return new Expression(...this.terms);
  }

  /** toString
   * @returns {string} - the LaTeX string representation of the Expression
   */
  toString() {
    return this.terms.reduce((prev, curr, i) => {
      const sign =
        i === 0 ? (curr.addition ? "" : "- ") : curr.addition ? " + " : " - ";
      return `${prev}${sign}${bracket(curr.term, { mode: curr.brackets })}`;
    }, "");
  }
}
