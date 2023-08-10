// the general equation class has a left and right side,
// both of which are expressions
// each time we apply a method on the equation,
// we will slowly build up the steps as an array of lhs=rhs strings

import { Fraction, Term, Expression } from "../../../core/index.js";
import {
  RationalTerm,
  // TODO: handle PowerTerm and ExpansionTerm
  // PowerTerm, ExpansionTerm
} from "../../term/index.js";

//TODO: move all x's to right method
//TODO: make rhs 0 method

/**
 * General Equation class representing LHS = RHS, with typesetting to output a series of steps to
 * to plugged into a LaTeX align/align* /gather/gather* environment
 * @class
 * @param {Expression} lhs - the left hand side of the equation
 * @param {Expression} rhs - the right hand side of the equation
 * @param {(Expression|string)[]} lhsArray - a collection of lhs expressions from the first step to the last
 * @param {Expression[]} rhsArray - a collection of rhs expressions from the first step to the last
 * @param {boolean} aligned - whether or not the steps are to be aligned
 */
export class EquationWorking {
  /**
   * constructor
   * @param {Expression|number|Fraction|string|Term|(number|Fraction|string|Term)[]} lhs - the left hand side of the equation
   * @param {Expression|number|Fraction|string|Term|(number|Fraction|string|Term)[]} [rhs=0] - the right hand side of the equation (defaults to 0)
   * @param {{aligned: boolean}} [options] - options object defaulting to `{aligned: false}`
   */
  constructor(lhs, rhs = 0, options) {
    if (!(lhs instanceof Expression)) {
      lhs = Array.isArray(lhs) ? new Expression(...lhs) : new Expression(lhs);
    }
    if (!(rhs instanceof Expression)) {
      rhs = Array.isArray(rhs) ? new Expression(...rhs) : new Expression(rhs);
    }
    const aligned = options?.aligned ?? false;
    /** @type {Expression} */
    this.lhs = lhs;
    /** @type {Expression} */
    this.rhs = rhs;
    /** @type {(Expression|string)[]} */
    this.lhsArray = [lhs];
    /** @type {(Expression|string)[]} */
    this.rhsArray = [rhs];
    /** @type {boolean} */
    this.aligned = aligned;
  }

  /**
   * addition
   * @param {number|Fraction|string|Term|Expression} x - the term/expression to be added to both sides
   * @param {{intertext: string}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
   * the equal sign will be push to the right by the length of the intertext
   * @returns {EquationWorking} - a reference to this equation
   * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
   */
  plus(x, options) {
    const newLHS = this.lhs.plus(x);
    const newRHS = this.rhs.plus(x);
    insertIntertext(this, options);
    this.lhsArray.push(newLHS);
    this.rhsArray.push(newRHS);
    this.lhs = newLHS;
    this.rhs = newRHS;
    return this;
  }
  /**
   * subtraction
   * @param {number|Fraction|string|Term|Expression} x - the term/expression to be subtracted from both sides
   * @param {{intertext: string}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
   * the equal sign will be push to the right by the length of the intertext
   * @returns {EquationWorking} - a reference to this equation
   * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
   */
  minus(x, options) {
    const newLHS = this.lhs.minus(x);
    const newRHS = this.rhs.minus(x);
    insertIntertext(this, options);
    this.lhsArray.push(newLHS);
    this.rhsArray.push(newRHS);
    this.lhs = newLHS;
    this.rhs = newRHS;
    return this;
  }
  /**
   * multiplication
   * @param {number|Fraction|string|Term|Expression} x - the term/expression to be multiplied from both sides
   * @param {{intertext: string}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
   * the equal sign will be push to the right by the length of the intertext
   * @returns {EquationWorking} - a reference to this equation
   * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
   */
  times(x, options) {
    const newLHS = this.lhs.times(x);
    const newRHS = this.rhs.times(x);
    insertIntertext(this, options);
    this.lhsArray.push(newLHS);
    this.rhsArray.push(newRHS);
    this.lhs = newLHS;
    this.rhs = newRHS;
    return this;
  }
  /**
   * negative
   * @param {{intertext: string}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
   * the equal sign will be push to the right by the length of the intertext
   * @returns {EquationWorking} - a reference to this equation
   * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
   */
  negative(options) {
    const newLHS = this.lhs.negative();
    const newRHS = this.rhs.negative();
    insertIntertext(this, options);
    this.lhsArray.push(newLHS);
    this.rhsArray.push(newRHS);
    this.lhs = newLHS;
    this.rhs = newRHS;
    return this;
  }
  /**
   * division
   * @param {number|Fraction|string|Term} x - the term to be divided from both sides
   * @param {{intertext: string}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
   * the equal sign will be push to the right by the length of the intertext
   * @returns {EquationWorking} - a reference to this equation
   * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
   */
  divide(x, options) {
    const newLHS = this.lhs.divide(x);
    const newRHS = this.rhs.divide(x);
    insertIntertext(this, options);
    this.lhsArray.push(newLHS);
    this.rhsArray.push(newRHS);
    this.lhs = newLHS;
    this.rhs = newRHS;
    return this;
  }
  /**
   * swaps lhs and rhs
   * @param {{intertext: string}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
   * the equal sign will be push to the right by the length of the intertext
   * @returns {EquationWorking} - a reference to this equation
   */
  swap(options) {
    const newLHS = this.rhs;
    const newRHS = this.lhs;
    insertIntertext(this, options);
    this.lhsArray.push(newLHS);
    this.rhsArray.push(newRHS);
    this.lhs = newLHS;
    this.rhs = newRHS;
    return this;
  }

  //! Methods for RationalTerm
  /**
   * combines rational terms into a single rational term
   * @param {{intertext: string}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
   * the equal sign will be push to the right by the length of the intertext
   * @returns {EquationWorking} - a reference to this equation
   * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
   */
  combineRationalTerms(options) {
    const simplifiedLHS = simplifyRationalTerm(this.lhs);
    const newLHS =
      simplifiedLHS instanceof RationalTerm
        ? new Expression(simplifiedLHS)
        : simplifiedLHS;
    const simplifiedRHS = simplifyRationalTerm(this.rhs);
    const newRHS =
      simplifiedRHS instanceof RationalTerm
        ? new Expression(simplifiedRHS)
        : simplifiedRHS;
    if (
      simplifiedLHS instanceof RationalTerm ||
      simplifiedRHS instanceof RationalTerm
    ) {
      insertIntertext(this, options);
      this.lhsArray.push(newLHS);
      this.rhsArray.push(newRHS);
      this.lhs = newLHS;
      this.rhs = newRHS;
      return this;
    }
    console.warn(
      `no rational terms found in lhs: ${this.lhs} and rhs: ${this.rhs} during rational term combination. Is this intended?`
    );
    return this;
  }
  /**
   * cross multiplication (only if there is a rational term on either/both sides)
   * @param {{intertext: string}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
   * the equal sign will be push to the right by the length of the intertext
   * @returns {EquationWorking} - a reference to this equation
   */
  crossMultiply(options) {
    const simplifiedLHS = simplifyRationalTerm(this.lhs);
    const simplifiedRHS = simplifyRationalTerm(this.rhs);
    if (simplifiedLHS instanceof RationalTerm) {
      if (simplifiedRHS instanceof RationalTerm) {
        const newLHS = simplifiedLHS.num
          .times(simplifiedLHS.coeff)
          .times(simplifiedRHS.den);
        const newRHS = simplifiedRHS.num
          .times(simplifiedRHS.coeff)
          .times(simplifiedLHS.den);
        insertIntertext(this, options);
        this.lhsArray.push(newLHS);
        this.rhsArray.push(newRHS);
        this.lhs = newLHS;
        this.rhs = newRHS;
        return this;
      } else if (simplifiedRHS.is.constant()) {
        const rhs = simplifiedRHS.cast.toFraction();
        const newLHS = simplifiedLHS.num
          .times(simplifiedLHS.coeff)
          .times(rhs.den);
        const newRHS = simplifiedLHS.den.times(rhs.num);
        insertIntertext(this, options);
        this.lhsArray.push(newLHS);
        this.rhsArray.push(newRHS);
        this.lhs = newLHS;
        this.rhs = newRHS;
        return this;
      } else {
        const newLHS = simplifiedLHS.num.times(simplifiedLHS.coeff);
        const newRHS = simplifiedRHS.times(simplifiedLHS.den);
        insertIntertext(this, options);
        this.lhsArray.push(newLHS);
        this.rhsArray.push(newRHS);
        this.lhs = newLHS;
        this.rhs = newRHS;
        return this;
      }
    } else {
      // simplifiedLHS is not a RationalTerm
      if (simplifiedRHS instanceof RationalTerm) {
        if (simplifiedLHS.is.constant()) {
          const lhs = simplifiedLHS.cast.toFraction();
          const newLHS = simplifiedRHS.den.times(lhs.num);
          const newRHS = simplifiedRHS.num
            .times(lhs.den)
            .times(simplifiedRHS.coeff);
          insertIntertext(this, options);
          this.lhsArray.push(newLHS);
          this.rhsArray.push(newRHS);
          this.lhs = newLHS;
          this.rhs = newRHS;
          return this;
        } else {
          const newLHS = simplifiedLHS.times(simplifiedRHS.den);
          const newRHS = simplifiedRHS.num.times(simplifiedRHS.coeff);
          insertIntertext(this, options);
          this.lhsArray.push(newLHS);
          this.rhsArray.push(newRHS);
          this.lhs = newLHS;
          this.rhs = newRHS;
          return this;
        }
      } else {
        console.warn(
          `no rational terms found in lhs: ${this.lhs} and rhs: ${this.rhs} during cross multiplication. Is this intended?`
        );
        return this;
      }
    }
  }

  /**
   * sets the aligned state
   * @param {boolean} [aligned] - whether or not the steps are to be aligned. if not provided, defaults to toggling between states
   * @returns {EquationWorking} - a reference to this equation
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
   * move term i from (lhs/rhs) to (rhs/lhs)
   * @param {number} i - the index of the term to be moved (note: 0-indexed)
   * @param {{from?: "lhs"|"rhs", intertext?: string}} [options] - options object defaulting to `{from: "lhs"}`. intertext for inserting text between steps.
   * it is recommended we would in the non-aligned environment for this as the equal sign will be push to the right by the length of the intertext for aligned environments
   * @returns {EquationWorking} - a reference to this equation
   * WARNING: mutates current instance
   */
  moveTerm(i, options) {
    const from = options?.from ?? "lhs";
    /** @type {Expression} */
    let newLHS;
    /** @type {Expression} */
    let newRHS;
    if (from === "lhs") {
      newLHS = new Expression(...this.lhs.terms.filter((_, j) => j !== i));
      newRHS = this.rhs.minus(this.lhs.terms[i]);
    } else {
      newRHS = new Expression(...this.rhs.terms.filter((_, j) => j !== i));
      newLHS = this.lhs.minus(this.rhs.terms[i]);
    }
    insertIntertext(this, options);
    this.lhsArray.push(newLHS);
    this.rhsArray.push(newRHS);
    this.lhs = newLHS;
    this.rhs = newRHS;
    return this;
  }

  /**
   * returns a string representation of the sequence of steps to be fed into a LaTeX align/align* / gather/gather* environment
   */
  toString() {
    const equal = this.aligned ? " &= " : " = ";
    return this.lhsArray.reduce((prev, lhs, i) => {
      const newLine = i === 0 ? "" : "\n\t\\\\ ";
      const equalSign =
        typeof lhs === "string" ? (this.aligned ? " &" : "") : equal;
      return prev + `${newLine}${lhs}${equalSign}${this.rhsArray[i]}`;
    }, "");
  }
}

/**
 * searches expression for a RationalTerm, and return a boolean for whether it exists
 * @param {Expression} expression - the expression to be searched
 * @return {boolean} - whether a rational term exists
 */
function hasRationalTerm(expression) {
  return expression.terms.some((term) => term instanceof RationalTerm);
}

/**
 * searches expression for a RationalTerm, and returns the simplified RationalTerm if it exists
 * otherwise returns the original expression
 * @param {Expression} expression - the expression to be searched
 * @return {RationalTerm|Expression} - the simplified expression
 */
function simplifyRationalTerm(expression) {
  const isRational = hasRationalTerm(expression);
  if (isRational) {
    const finalRational = expression.terms.reduce(
      /** @type {(prev: RationalTerm, term: Term)=>RationalTerm} */
      (prev, term) => prev.plus(term),
      new RationalTerm(0)
    );
    return finalRational;
  }
  return expression;
}

/**
 * inserts intertext into arrays
 * @param {EquationWorking} equation - the equation to be modified
 * @param {{intertext?: string}} [options] - the text to be inserted
 */
function insertIntertext(equation, options) {
  const intertext = options?.intertext;
  if (!intertext) return;
  equation.lhsArray.push(intertext);
  equation.rhsArray.push("");
}
