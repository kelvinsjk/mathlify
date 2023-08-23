// RationalInequalityWorking class

import { Fraction, Term, Expression } from "../../core/index.js";
import { ExpansionTerm, RationalTerm } from "../../algebra/term/index.js";
import { factorizeQuadratic } from "../../algebra/quadratic/index.js";
import { solveRationalInequality } from "./solveRationalInequality.js";

//TODO: move all x's to right method
//TODO: make rhs 0 method

/**
 * RationalInequalityWorking representing LHS (sign) RHS, with typesetting to output a series of steps to
 * to plugged into a LaTeX align/align* /gather/gather* environment
 * @class
 * @property {RationalTerm} lhs - the left hand side of the equation
 * @property {RationalTerm} rhs - the right hand side of the equation
 * @property {(RationalTerm|string)[]} lhsArray - a collection of lhs expressions from the first step to the last
 * @property {(RationalTerm|string)[]} rhsArray - a collection of rhs expressions from the first step to the last
 * @property {"<"|">"} sign - the sign of the inequality
 * @property {boolean} aligned - whether or not the steps are to be aligned
 */
export class RationalInequalityWorking {
  /** @type {RationalTerm} */
  lhs;
  /** @type {RationalTerm} */
  rhs;
  /** @type {(RationalTerm|Expression|string)[]} */
  lhsArray;
  /** @type {(RationalTerm|string)[]} */
  rhsArray;
  /** @type {"<"|">"} */
  sign;
  /** @type {boolean} */
  aligned;
  /**
   * constructor
   * @param {RationalTerm|number|Fraction|string|Term|Expression|[Expression, Expression]} lhs - the left hand side of the inequality
   * @param {RationalTerm|number|Fraction|string|Term|Expression|[Expression, Expression]} [rhs=0] - the right hand side of the inequality (defaults to 0)
   * @param {{aligned?: boolean, sign?: '>'|'<'}} [options] - options object defaulting to `{aligned: false, sign: '<'}`
   */
  constructor(lhs, rhs = 0, options) {
    const lhsRational =
      lhs instanceof RationalTerm
        ? lhs
        : Array.isArray(lhs)
        ? new RationalTerm(...lhs)
        : new RationalTerm(lhs);
    const rhsRational =
      rhs instanceof RationalTerm
        ? rhs
        : Array.isArray(rhs)
        ? new RationalTerm(...rhs)
        : new RationalTerm(rhs);
    const aligned = options?.aligned ?? false;
    const sign = options?.sign ?? "<";
    this.lhs = lhsRational;
    this.rhs = rhsRational;
    this.lhsArray = [lhsRational];
    this.rhsArray = [rhsRational];
    this.sign = sign;
    this.aligned = aligned;
  }

  /**
   * make rhs 0
   * @param {{intertext?: string}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
   * @returns {RationalInequalityWorking} - a reference to this equation
   * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
   */
  rhsZero(options) {
    const newLHS = this.lhs.minus(this.rhs);
    const newRHS = new RationalTerm(0);
    insertIntertext(this, options);
    // working
    this.lhsArray.push(new Expression(this.lhs, this.rhs.negative()));
    this.rhsArray.push(newRHS);
    // simplified rationalTerm
    this.lhsArray.push(newLHS);
    this.rhsArray.push(newRHS);
    this.lhs = newLHS;
    this.rhs = newRHS;
    return this;
  }

  /**
   * factorize quadratics in the numerator/denominator
   * @param {{num?: boolean, den?: boolean, intertext?: string}} [options] - options object for factorizing the lhs and/or rhs. defaults to `{num: true, den: true, intertext: undefined}`
   * @returns {RationalInequalityWorking} - a reference to this equation
   * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
   */
  factorize(options) {
    insertIntertext(this, options);
    /** @type {Expression|ExpansionTerm} */
    let newNum = this.lhs.num;
    let newDen = this.lhs.den;
    const num = options?.num ?? true;
    if (num) {
      try {
        newNum = factorizeQuadratic(this.lhs.num);
      } catch {}
    }
    const den = options?.den ?? true;
    if (den) {
      try {
        newDen = factorizeQuadratic(this.lhs.den.expand());
      } catch {}
    }
    const newLHS = new RationalTerm(newNum, newDen);
    this.lhsArray.push(newLHS);
    this.rhsArray.push(this.rhs);
    this.lhs = newLHS;
    return this;
  }

  /**
   * sets the aligned state
   * @param {boolean} [aligned] - whether or not the steps are to be aligned. if not provided, defaults to toggling between states
   * @returns {RationalInequalityWorking} - a reference to this equation
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
   * solves the inequality
   * @returns {string[]}
   */
  solve() {
    return solveRationalInequality(this.lhs, this.rhs, this.sign);
  }

  /**
   * returns a string representation of the sequence of steps to be fed into a LaTeX align/align* / gather/gather* environment
   */
  toString() {
    const sign = this.aligned ? ` &${this.sign} ` : ` ${this.sign} `;
    return this.lhsArray.reduce((prev, lhs, i) => {
      const newLine = i === 0 ? "" : "\n\t\\\\ ";
      const signString =
        typeof lhs === "string" ? (this.aligned ? " &" : "") : sign;
      return prev + `${newLine}${lhs}${signString}${this.rhsArray[i]}`;
    }, "");
  }
}

/**
 * inserts intertext into arrays
 * @param {RationalInequalityWorking} equation - the equation to be modified
 * @param {{intertext?: string}} [options] - the text to be inserted
 */
function insertIntertext(equation, options) {
  const intertext = options?.intertext;
  if (!intertext) return;
  equation.lhsArray.push(intertext);
  equation.rhsArray.push("");
}
