// the general equation class has a left and right side,
// both of which are expressions
// each time we apply a method on the equation,
// we will slowly build up the steps as an array of lhs=rhs strings

//TODO: rainbow expansion

import { Fraction, Term, Expression } from "../../core/index.js";
//import { ExpansionTerm, RationalTerm } from "../../algebra/term/index.js";
import {
  //UnsimplifiedExpression,
  castToPoly,
  factorizeQuadratic,
} from "../../algebra/index.js";
//import { SquareRoot } from "../../surds/square-roots.js";

class UnsimplifiedExpression {
  /** @param {(number|Fraction|string|Term|(number|Fraction|string|{variable: string, power: number|Fraction}|[string,number|Fraction]|Term)[])[]} terms - terms of the expression
   * */
  constructor(...terms) {
    this.exp = new Expression(...terms);
    this.terms = this.exp.terms;
  }
  simplify() {
    return this.exp;
  }
}

/**
 * General Equation class representing LHS = RHS, with typesetting to output a series of steps to
 * to plugged into a LaTeX align/align* /gather/gather* environment
 * @class
 * @property {UnsimplifiedExpression|Expression} exp - the left hand side of the equation
 * @property {(UnsimplifiedExpression|Expression|string)[]} expArray - a collection of lhs expressions from the first step to the last
 * @property {boolean} aligned - whether or not the steps are to be aligned
 * @property {boolean} equalStart - whether to start with an equal sign
 */
export class ExpressionWorking {
  /** @type {UnsimplifiedExpression|Expression} */
  exp;
  /** @type {(UnsimplifiedExpression|Expression|string)[]} */
  expArray;
  /** @type {boolean} */
  aligned;
  /** @type {boolean} */
  equalStart;
  //* @param {UnsimplifiedExpression|Expression|number|Fraction|string|Term|(number|Fraction|string|Term)[]} exp - the left hand side of the equation
  /**
   * constructor
   * @param {Expression|number|Fraction|string|Term|(number|Fraction|string|Term)[]} exp - the left hand side of the equation
   * @param {{aligned?: boolean, equalStart?: boolean}} [options] - options object defaulting to `{aligned: true, equalStart: false}`
   */
  constructor(exp, options) {
    /** @type {Expression|UnsimplifiedExpression} */
    let expExpression;
    if (Array.isArray(exp)) {
      expExpression = new UnsimplifiedExpression(...exp);
    } else if (
      exp instanceof UnsimplifiedExpression ||
      exp instanceof Expression
    ) {
      expExpression = exp;
    } else {
      expExpression = new UnsimplifiedExpression(exp);
    }
    this.exp = expExpression;
    this.expArray = [expExpression];
    this.aligned = options?.aligned ?? true;
    this.equalStart = options?.equalStart ?? false;
  }

  /**
   * sub in
   * @param {{[key: string]: number|Fraction}} x - the values to sub in with the key being the variable signature.
   * @param {{intertext?: string}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
   * @returns {ExpressionWorking} - reference to this ExpressionWorking
   * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
   */
  subIn(x, options) {
    insertIntertext(this, options);
    const exp = this.exp instanceof Expression ? this.exp : this.exp.simplify();
    this.exp = exp.subIn(x);
    this.expArray.push(this.exp);
    return this;
  }

  /**
   * factorize
   * @param {{intertext?: string, variable?: string}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
   * variable defaults to 'x'
   * @returns {ExpressionWorking} - reference to this ExpressionWorking
   * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
   *
   */
  factorizeQuadratic(options) {
    insertIntertext(this, options);
    const x = options?.variable ?? "x";
    const exp = this.exp instanceof Expression ? this.exp : this.exp.simplify();
    this.exp = new Expression(factorizeQuadratic(exp, { variable: x }));
    this.expArray.push(this.exp);
    return this;
  }

  /**
   * expands expansionTerm
   * @param {{intertext?: string}} [options]
   * @returns {ExpressionWorking} - a reference to this equation
   * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
   */
  // expand(options) {
  //   insertIntertext(this, options);
  //   /**@type {(Term|{term: Term, brackets?: 'auto'|'always'|'off', addition: boolean})[]} */
  //   const terms = [];
  //   /** @type {number} */
  //   let count = 0;
  //   if (this.exp instanceof Expression) {
  //     this.exp.terms.forEach((term) => {
  //       if (term instanceof ExpansionTerm) {
  //         const newTerms = term.expand().terms;
  //         newTerms.forEach((t) => {
  //           terms.push({ term: t.abs(), addition: t.coeff.is.positive() });
  //         });
  //         count++;
  //       } else {
  //         terms.push(term);
  //       }
  //     });
  //     if (count > 1) {
  //       this.expArray.push(new UnsimplifiedExpression(...terms));
  //     }
  //   } else {
  //     this.exp.terms.forEach((termObj) => {
  //       if (termObj.term instanceof ExpansionTerm) {
  //         let exp = termObj.term.expand();
  //         terms.push(...exp.terms);
  //       } else {
  //         terms.push(termObj);
  //       }
  //     });
  //   }
  //   this.exp = new Expression(...terms);
  //   this.expArray.push(this.exp);
  //   return this;
  // }

  /**
   * rationalize surds
   * TODO: for singleton denominator
   * @param {{intertext?: string}} [options]
   * @returns {ExpressionWorking} - a reference to this equation
   * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
   */
  // rationalize(options) {
  //   insertIntertext(this, options);
  //   /** @type {Expression} */
  //   let num;
  //   /** @type {Expression} */
  //   let den;
  //   if (
  //     this.exp instanceof Expression &&
  //     this.exp.terms.length === 1 &&
  //     this.exp.terms[0] instanceof RationalTerm
  //   ) {
  //     num = this.exp.terms[0].num;
  //     den = this.exp.terms[0].den.expand();
  //   } else if (
  //     this.exp instanceof UnsimplifiedExpression &&
  //     this.exp.terms.length === 1 &&
  //     this.exp.terms[0].term instanceof RationalTerm
  //   ) {
  //     num = this.exp.terms[0].term.num;
  //     den = this.exp.terms[0].term.den.expand();
  //   } else {
  //     throw new Error(`no rational term found for ${this.exp}`);
  //   }
  //   /** @type {Expression} */
  //   let conjugate;
  //   if (den.terms.length === 2) {
  //     conjugate = new Expression(den.terms[0], den.terms[1].negative());
  //   } else {
  //     throw new Error(`rationalize not supported for denominator ${den}`);
  //   }
  //   this.expArray.push(`=${this.exp}\\times\\frac{${conjugate}}{${conjugate}}`);
  //   const denom = den.times(conjugate).cast.toFraction();
  //   /** @type {({term: Term, addition: boolean})[]} */
  //   const numArray = [];
  //   num.terms.forEach((term) => {
  //     conjugate.terms.forEach((conjugateTerm) => {
  //       if (term instanceof SquareRoot) {
  //         if (conjugateTerm instanceof SquareRoot) {
  //           const t = new Term(
  //             term.coeff.times(conjugateTerm.coeff),
  //             `\\sqrt{${term.radicand.times(conjugateTerm.radicand)}}`
  //           );
  //           numArray.push({ term: t.abs(), addition: t.coeff.is.positive() });
  //         } else {
  //           const t = term.times(conjugateTerm);
  //           numArray.push({ term: t.abs(), addition: t.coeff.is.positive() });
  //         }
  //       } else {
  //         if (conjugateTerm instanceof SquareRoot) {
  //           const t = conjugateTerm.times(term);
  //           numArray.push({ term: t.abs(), addition: t.coeff.is.positive() });
  //         } else {
  //           const t = term.times(conjugateTerm);
  //           numArray.push({ term: t.abs(), addition: t.coeff.is.positive() });
  //         }
  //       }
  //     });
  //   });
  //   const numString = new UnsimplifiedExpression(...numArray);

  //   this.expArray.push(
  //     `=\\frac{${numString}}{\\left(${den.terms[0].abs()}\\right)^2 - \\left(${den.terms[1].abs()}\\right)^2}`
  //   );
  //   const numExp = num.times(conjugate);
  //   this.expArray.push(`=\\frac{${numExp}}{${denom}}`);
  //   this.exp = numExp.divide(denom);
  //   this.expArray.push(this.exp);
  //   return this;

  //   //this.exp = new Expression(
  //   //  new RationalTerm(num.times(conjugate), den.times(conjugate))
  //   //);
  // }

  //TODO: Methods for RationalTerm
  /**
   * combines rational terms into a single rational term
   * @param {{intertext: string}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
   * the equal sign will be push to the right by the length of the intertext
   * @returns {ExpressionWorking} - a reference to this equation
   * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
   */
  //combineRationalTerms(options) {
  //  const simplifiedLHS = simplifyRationalTerm(this.exp);
  //  const newLHS =
  //    simplifiedLHS instanceof RationalTerm
  //      ? new Expression(simplifiedLHS)
  //      : simplifiedLHS;
  //  if (
  //    simplifiedLHS instanceof RationalTerm ||
  //    simplifiedRHS instanceof RationalTerm
  //  ) {
  //    insertIntertext(this, options);
  //    this.expArray.push(newLHS);
  //    this.rhsArray.push(newRHS);
  //    this.lhs = newLHS;
  //    this.rhs = newRHS;
  //    return this;
  //  }
  //  console.warn(
  //    `no rational terms found in lhs: ${this.lhs} and rhs: ${this.rhs} during rational term combination. Is this intended?`
  //  );
  //  return this;
  //}

  /**
   * sets the aligned state
   * @param {boolean} [aligned] - whether or not the steps are to be aligned. if not provided, defaults to toggling between states
   * @returns {ExpressionWorking} - a reference to this equation
   * WARNING: mutates current instance
   */
  setAligned(aligned) {
    if (aligned === undefined) {
      this.aligned = !this.aligned;
    } else {
      this.aligned = aligned;
    }
    return this;
  }

  /**
   * simplify terms specified (while leaving the rest untouched)
   * @param {number[]} args - the index of the terms to be simplified (0-indexed)
   * @param {{intertext?: string}} [options] - options object defaulting to `{from: "lhs"}`. intertext for inserting text between steps.
   * it is recommended we would in the non-aligned environment for this as the equal sign will be push to the right by the length of the intertext for aligned environments
   * @returns {ExpressionWorking} - a reference to this equation
   * WARNING: mutates current instance
   */
  // simplifyTerms(args, options) {
  //   insertIntertext(this, options);
  //   if (this.exp instanceof Expression) {
  //     throw new Error(`simplifyTerms is not supported for Expression`);
  //   }
  //   const terms = this.exp.terms;
  //   args.sort();
  //   const prevTerms = terms.slice(0, args[0]);
  //   const postTerms = terms
  //     .slice(args[0] + 1)
  //     .filter((_, i) => !args.includes(i));
  //   const termsToSimplify = terms
  //     .filter((_, i) => args.includes(i))
  //     .map((e) => e.term);
  //   const simplifiedExpression = new Expression(...termsToSimplify);
  //   const newExp = new UnsimplifiedExpression(
  //     ...prevTerms,
  //     ...simplifiedExpression.terms,
  //     ...postTerms
  //   );
  //   this.expArray.push(newExp);
  //   this.exp = newExp;
  //   return this;
  // }
  /**
   * simplify all terms, leaving an Expression term
   * @param {{intertext?: string}} [options] - options object defaulting to `{from: "lhs"}`. intertext for inserting text between steps.
   * it is recommended we would in the non-aligned environment for this as the equal sign will be push to the right by the length of the intertext for aligned environments
   * @returns {ExpressionWorking} - a reference to this equation
   * WARNING: mutates current instance
   */
  simplify(options) {
    insertIntertext(this, options);
    if (this.exp instanceof UnsimplifiedExpression) {
      this.exp = this.exp.simplify();
    }
    this.expArray.push(this.exp);
    return this;
  }

  /**
   * changes order of terms
   * @param {number[]} args - the index of the terms to be simplified (0-indexed)
   * @param {{intertext?: string}} [options] - options object
   * @returns {ExpressionWorking} - a reference to this equation
   * WARNING: mutates current instance
   */
  changeOrder(args, options) {
    insertIntertext(this, options);
    const exp = this.exp instanceof Expression ? this.exp : this.exp.simplify();
    this.exp = exp.changeOrder(args);
    this.expArray.push(this.exp);
    return this;
  }

  /**
   * @param {{intertext?: string, variable?: string}} [options] - options object defaulting to `{side: "lhs"}`. intertext for inserting text between steps.
   */
  castToPoly(options) {
    insertIntertext(this, options);
    const exp = this.exp instanceof Expression ? this.exp : this.exp.simplify();
    this.exp = castToPoly(exp, options);
    this.expArray.push(this.exp);
  }

  /**
   * returns a string representation of the sequence of steps to be fed into a LaTeX align/align* / gather/gather* environment
   */
  toString() {
    const equal = this.aligned ? "&= " : "= ";
    return this.expArray.reduce((prev, exp, i) => {
      const newLine = i === 0 ? "" : "\n\t\\\\ ";
      let equalSign =
        typeof exp === "string" ? (this.aligned ? " &" : "") : equal;
      if (i === 0 && !this.equalStart) {
        equalSign = this.aligned ? "& " : "";
      }
      return prev + `${newLine}${equalSign}${exp}`;
    }, "");
  }

  /**
   * clears the arrays, leaving just the final line
   * @returns {ExpressionWorking} - a reference to this equation
   * WARNING: mutates current instance
   */
  clear() {
    this.expArray = [this.exp];
    return this;
  }
}

// /**
//  * searches expression for a RationalTerm, and return a boolean for whether it exists
//  * @param {Expression} expression - the expression to be searched
//  * @return {boolean} - whether a rational term exists
//  */
// function hasRationalTerm(expression) {
//   return expression.terms.some((term) => term instanceof RationalTerm);
// }

// /**
//  * searches expression for a RationalTerm, and returns the simplified RationalTerm if it exists
//  * otherwise returns the original expression
//  * @param {Expression} expression - the expression to be searched
//  * @return {RationalTerm|Expression} - the simplified expression
//  */
// function simplifyRationalTerm(expression) {
//   const isRational = hasRationalTerm(expression);
//   if (isRational) {
//     const finalRational = expression.terms.reduce(
//       /** @type {(prev: RationalTerm, term: Term)=>RationalTerm} */
//       (prev, term) => prev.plus(term),
//       new RationalTerm(0)
//     );
//     return finalRational;
//   }
//   return expression;
// }

/**
 * inserts intertext into arrays
 * @param {ExpressionWorking} equation - the equation to be modified
 * @param {{intertext?: string}} [options] - the text to be inserted
 */
function insertIntertext(equation, options) {
  const intertext = options?.intertext;
  if (!intertext) return;
  equation.expArray.push(intertext);
}
