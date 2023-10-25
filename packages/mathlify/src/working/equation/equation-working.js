// the general equation class has a left and right side,
// both of which are expressions
// each time we apply a method on the equation,
// we will slowly build up the steps as an array of lhs=rhs strings

import { Fraction, Term, Expression, Polynomial } from "../../core/index.js";
import {
  ExpansionTerm,
  RationalTerm,
  // TODO: handle PowerTerm and ExpansionTerm
  // PowerTerm, ExpansionTerm
} from "../../algebra/term/index.js";
import {
  castToPoly,
  factorizeQuadratic,
  solveLinear,
  solveQuadratic,
} from "../../algebra/index.js";

/**
 * General Equation class representing LHS = RHS, with typesetting to output a series of steps to
 * to plugged into a LaTeX align/align* /gather/gather* environment
 * @class
 * @property {Expression} lhs - the left hand side of the equation
 * @property {Expression} rhs - the right hand side of the equation
 * @property {(Expression|string)[]} lhsArray - a collection of lhs expressions from the first step to the last
 * @property {(Expression|string)[]} rhsArray - a collection of rhs expressions from the first step to the last
 * @property {boolean} aligned - whether or not the steps are to be aligned
 */
export class EquationWorking {
  /** @type {Expression} */
  lhs;
  /** @type {Expression} */
  rhs;
  /** @type {(Expression|string)[]} */
  lhsArray;
  /** @type {(Expression|string)[]} */
  rhsArray;
  /** @type {boolean} */
  aligned;
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
   * @param {{intertext?: string, show?: boolean}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
   * the equal sign will be push to the right by the length of the intertext
   * @returns {EquationWorking} - a reference to this equation
   * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
   */
  plus(x, options) {
    insertIntertext(this, options);
    const newLHS = this.lhs.plus(x);
    const newRHS = this.rhs.plus(x);
    if (options?.show ?? true) {
      this.lhsArray.push(newLHS);
      this.rhsArray.push(newRHS);
    }
    this.lhs = newLHS;
    this.rhs = newRHS;
    return this;
  }
  /**
   * subtraction
   * @param {number|Fraction|string|Term|Expression} x - the term/expression to be subtracted from both sides
   * @param {{intertext?: string, show?: boolean}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
   * the equal sign will be push to the right by the length of the intertext
   * @returns {EquationWorking} - a reference to this equation
   * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
   */
  minus(x, options) {
    insertIntertext(this, options);
    const newLHS = this.lhs.minus(x);
    const newRHS = this.rhs.minus(x);
    if (options?.show ?? true) {
      this.lhsArray.push(newLHS);
      this.rhsArray.push(newRHS);
    }
    this.lhs = newLHS;
    this.rhs = newRHS;
    return this;
  }
  /**
   * multiplication
   * @param {number|Fraction|string|Term|Expression} x - the term/expression to be multiplied from both sides
   * @param {{intertext?: string, show?: boolean}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
   * the equal sign will be push to the right by the length of the intertext
   * @returns {EquationWorking} - a reference to this equation
   * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
   */
  times(x, options) {
    insertIntertext(this, options);
    const newLHS = this.lhs.times(x);
    const newRHS = this.rhs.times(x);
    if (options?.show ?? true) {
      this.lhsArray.push(newLHS);
      this.rhsArray.push(newRHS);
    }
    this.lhs = newLHS;
    this.rhs = newRHS;
    return this;
  }
  /**
   * negative
   * @param {{intertext?: string, show?: boolean}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
   * the equal sign will be push to the right by the length of the intertext
   * @returns {EquationWorking} - a reference to this equation
   * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
   */
  negative(options) {
    insertIntertext(this, options);
    const newLHS = this.lhs.negative();
    const newRHS = this.rhs.negative();
    if (options?.show ?? true) {
      this.lhsArray.push(newLHS);
      this.rhsArray.push(newRHS);
    }
    this.lhs = newLHS;
    this.rhs = newRHS;
    return this;
  }
  /**
   * division
   * @param {number|Fraction|string|Term} x - the term to be divided from both sides
   * @param {{intertext?: string, show?: boolean}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
   * the equal sign will be push to the right by the length of the intertext
   * @returns {EquationWorking} - a reference to this equation
   * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
   */
  divide(x, options) {
    const newLHS = this.lhs.divide(x);
    const newRHS = this.rhs.divide(x);
    insertIntertext(this, options);
    if (options?.show ?? true) {
      this.lhsArray.push(newLHS);
      this.rhsArray.push(newRHS);
    }
    this.lhs = newLHS;
    this.rhs = newRHS;
    return this;
  }
  /**
   * swaps lhs and rhs
   * @param {{intertext?: string, show?: boolean}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
   * the equal sign will be push to the right by the length of the intertext
   * @returns {EquationWorking} - a reference to this equation
   */
  swap(options) {
    insertIntertext(this, options);
    const newLHS = this.rhs;
    const newRHS = this.lhs;
    if (options?.show ?? true) {
      this.lhsArray.push(newLHS);
      this.rhsArray.push(newRHS);
    }
    this.lhs = newLHS;
    this.rhs = newRHS;
    return this;
  }

  /**
   * make rhs 0
   * @param {{intertext?: string, working?: boolean, show?: boolean}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
   * @returns {EquationWorking} - a reference to this equation
   * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
   */
  rhsZero(options) {
    insertIntertext(this, options);
    // working
    if (options?.working) {
      this.lhsArray.push(`${this.lhs} - (${this.rhs})`);
      this.rhsArray.push(`0`);
    }
    // final
    const newLHS = this.lhs.minus(this.rhs);
    const newRHS = new Expression(0);
    if (options?.show ?? true) {
      this.lhsArray.push(newLHS);
      this.rhsArray.push(newRHS);
    }
    this.lhs = newLHS;
    this.rhs = newRHS;
    return this;
  }

  /**
   * factorize the lhs
   * @param {{intertext?: string, variable?: string}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
   * variable defaults to 'x'
   * @returns {[Fraction, Fraction]} - the roots of the equation
   * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
   *
   */
  factorizeQuadratic(options) {
    insertIntertext(this, options);
    const x = options?.variable ?? "x";
    const roots = solveQuadratic(this.lhs, this.rhs, { variable: x });
    this.lhs = new Expression(factorizeQuadratic(this.lhs, { variable: x }));
    this.lhsArray.push(this.lhs);
    this.rhsArray.push(this.rhs);
    return roots;
  }

  /**
   * solves linear
    @param {{intertext?: string, variable?: string}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
   * variable defaults to 'x'
   * @returns {Fraction} - the roots of the equation
   * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
   */
  solveLinear(options) {
    insertIntertext(this, options);
    const x = options?.variable ?? "x";
    const root = solveLinear(this.lhs, this.rhs, { variable: x });
    const lhs = castToPoly(this.lhs, { variable: x });
    const rhs = castToPoly(this.rhs, { variable: x });
    if (`${lhs}` !== x) {
      const [a] = lhs.coeffs;
      const [_, d] = rhs.coeffs;
      const offset = new Polynomial([d ?? 0, a ?? 0]);
      const lhsWorking = lhs.minus(offset);
      const rhsWorking = rhs.minus(offset);
      this.lhsArray.push(lhsWorking);
      this.rhsArray.push(rhsWorking);
      const leadingCoeff = lhsWorking.leadingCoeff;
      if (leadingCoeff.is.not.one()) {
        this.lhs = lhsWorking.divide(leadingCoeff);
        this.rhs = rhsWorking.divide(leadingCoeff);
        this.lhsArray.push(this.lhs);
        this.rhsArray.push(this.rhs);
      }
    }
    return root;
  }

  /**
   * solves the quadratic (for rational roots)
   * @returns {[Fraction, Fraction]}
   */
  solveQuadratic() {
    return solveQuadratic(this.lhs, this.rhs);
  }

  //! Methods for RationalTerm
  /**
   * combines rational terms into a single rational term
   * @param {{intertext: string}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
   * the equal sign will be push to the right by the length of the intertext
   * @returns {EquationWorking} - a reference to this equation
   * WARNING: mutates the current instance. the lhs/rhs is the latest after the method
   */
  // combineRationalTerms(options) {
  //   const simplifiedLHS = simplifyRationalTerm(this.lhs);
  //   const newLHS =
  //     simplifiedLHS instanceof RationalTerm
  //       ? new Expression(simplifiedLHS)
  //       : simplifiedLHS;
  //   const simplifiedRHS = simplifyRationalTerm(this.rhs);
  //   const newRHS =
  //     simplifiedRHS instanceof RationalTerm
  //       ? new Expression(simplifiedRHS)
  //       : simplifiedRHS;
  //   if (
  //     simplifiedLHS instanceof RationalTerm ||
  //     simplifiedRHS instanceof RationalTerm
  //   ) {
  //     insertIntertext(this, options);
  //     this.lhsArray.push(newLHS);
  //     this.rhsArray.push(newRHS);
  //     this.lhs = newLHS;
  //     this.rhs = newRHS;
  //     return this;
  //   }
  //   console.warn(
  //     `no rational terms found in lhs: ${this.lhs} and rhs: ${this.rhs} during rational term combination. Is this intended?`
  //   );
  //   return this;
  // }
  /**
   * cross multiplication (only if there is a rational term on either/both sides)
   * @param {{intertext?: string, show?: boolean}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
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
          .times(simplifiedRHS.den.expand());
        const newRHS = simplifiedRHS.num
          .times(simplifiedRHS.coeff)
          .times(simplifiedLHS.den.expand());
        insertIntertext(this, options);
        if (options?.show ?? true) {
          this.lhsArray.push(newLHS);
          this.rhsArray.push(newRHS);
        }
        this.lhs = newLHS;
        this.rhs = newRHS;
        return this;
      } else if (simplifiedRHS.is.constant()) {
        const rhs = simplifiedRHS.cast.toFraction();
        const newLHS = simplifiedLHS.num
          .times(simplifiedLHS.coeff)
          .times(rhs.den);
        const newRHS = simplifiedLHS.den.expand().times(rhs.num);
        insertIntertext(this, options);
        if (options?.show ?? true) {
          this.lhsArray.push(newLHS);
          this.rhsArray.push(newRHS);
        }
        this.lhs = newLHS;
        this.rhs = newRHS;
        return this;
      } else {
        const newLHS = simplifiedLHS.num.times(simplifiedLHS.coeff);
        const newRHS = simplifiedRHS.times(simplifiedLHS.den.expand());
        insertIntertext(this, options);
        if (options?.show ?? true) {
          this.lhsArray.push(newLHS);
          this.rhsArray.push(newRHS);
        }
        this.lhs = newLHS;
        this.rhs = newRHS;
        return this;
      }
    } else {
      // simplifiedLHS is not a RationalTerm
      if (simplifiedRHS instanceof RationalTerm) {
        if (simplifiedLHS.is.constant()) {
          const lhs = simplifiedLHS.cast.toFraction();
          const newLHS = simplifiedRHS.den.expand().times(lhs.num);
          const newRHS = simplifiedRHS.num
            .times(lhs.den)
            .times(simplifiedRHS.coeff);
          insertIntertext(this, options);
          if (options?.show ?? true) {
            this.lhsArray.push(newLHS);
            this.rhsArray.push(newRHS);
          }
          this.lhs = newLHS;
          this.rhs = newRHS;
          return this;
        } else {
          const newLHS = simplifiedLHS.times(simplifiedRHS.den.expand());
          const newRHS = simplifiedRHS.num.times(simplifiedRHS.coeff);
          insertIntertext(this, options);
          if (options?.show ?? true) {
            this.lhsArray.push(newLHS);
            this.rhsArray.push(newRHS);
          }
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

  //! Methods for ExpansionTerm
  /**
   * @param {{intertext?: string, show?: boolean}} [options] - options object for inserting text between steps. it is recommended we would in the non-aligned environment for this
   * @returns {EquationWorking} - a reference to this equation
   */
  expand(options) {
    insertIntertext(this, options);
    const newLHS = expandExpansionTerm(this.lhs);
    const newRHS = expandExpansionTerm(this.rhs);
    if (options?.show ?? true) {
      this.lhsArray.push(newLHS);
      this.rhsArray.push(newRHS);
    }
    this.lhs = newLHS;
    this.rhs = newRHS;
    return this;
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
   * @param {{from?: "lhs"|"rhs", intertext?: string, show?: boolean}} [options] - options object defaulting to `{from: "lhs"}`. intertext for inserting text between steps.
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
    if (options?.show ?? true) {
      this.lhsArray.push(newLHS);
      this.rhsArray.push(newRHS);
    }
    this.lhs = newLHS;
    this.rhs = newRHS;
    return this;
  }

  /**
   * @param {{side?: 'lhs'|'rhs'|'both', intertext?: string, variable?: string}} [options] - options object defaulting to `{side: "lhs"}`. intertext for inserting text between steps.
   */
  castToPoly(options) {
    insertIntertext(this, options);
    if (options?.side !== "rhs") {
      this.lhs = castToPoly(this.lhs, options);
    }
    if (options?.side === "both" || options?.side === "rhs") {
      this.rhs = castToPoly(this.rhs, options);
    }
    this.lhsArray.push(this.lhs);
    this.rhsArray.push(this.rhs);
  }

  /**
   * returns a string representation of the sequence of steps to be fed into a LaTeX align/align* / gather/gather* environment
   * @returns {string} - the string representation of the sequence of steps
   */
  toString() {
    const equal = this.aligned ? " &= " : " = ";
    let str = "";
    this.lhsArray.forEach((lhs, i) => {
      const newLine = i === 0 ? "" : "\n\t\\\\ ";
      const equalSign =
        typeof lhs === "string" && this.rhsArray[i] === ""
          ? this.aligned
            ? " &"
            : ""
          : equal;
      str += `${newLine}${lhs}${equalSign}${this.rhsArray[i]}`;
    });
    return str;
  }

  /**
   * clears the arrays, leaving just the final line
   * @returns {EquationWorking} - a reference to this equation
   * WARNING: mutates current instance
   */
  clear() {
    this.lhsArray = [this.lhs];
    this.rhsArray = [this.rhs];
    return this;
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
 * searches expression for an ExpansionTerm, and expands it
 * otherwise returns the original expression
 * @param {Expression} expression - the expression to be searched
 * @return {Expression} - the simplified expression
 */
function expandExpansionTerm(expression) {
  /** @type {Term[]} */
  const terms = [];
  expression.terms.forEach((term) => {
    if (term instanceof ExpansionTerm) {
      terms.push(...term.expand().terms);
    } else {
      terms.push(term);
    }
  });
  return new Expression(...terms);
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
