// the general equation class has a left and right side,
// both of which are expressions
// each time we apply a method on the equation,
// we will slowly build up the steps as an array of lhs=rhs strings

import { Fraction, Term, Expression } from "../../../core/index.js";
import {
  cramersRule,
  cramersRuleNumerical,
} from "../../../numerical/sle/cramers.js";
import { numberToFraction } from "../../../utils/toFraction.js";

/**
 * SLE class representing a system of linear equations
 * to plugged into a LaTeX align/align* /gather/gather* environment
 * @class
 * @property {Fraction[][]} coeffs - coefficient matrix
 * @property {Fraction[]} values - the values on the right hand side
 * @property {string[]} variables - the variables
 * @property {"off"|"align"|"alignat"} alignMode - whether the equations are aligned (using align or alignat) or not (using gather)
 * @property {number} alignatArg - the number of columns to align at (only used if alignMode is "alignat")
 */
export class SLE {
  /** @type {Fraction[][]} */
  coeffs;
  /** @type {Fraction[]} */
  values;
  /** @type {"off"|"align"|"alignat"} */
  alignMode;
  /** @type {number} */
  alignatArg;
  /**
   * constructor
   * @param {(number|Fraction)[][]} coeffs - the linear expressions (or coefficient matrix)
   * @param {(number|Fraction)[]} values - the right hand side of the equation
   * @param {{alignMode?: "off"|"align"|"alignat", variables?: string[]}} [options] - options object defaulting to `{alignMode: "alignat", variables: ['x', 'y', 'z', 'w']}`
   */
  constructor(coeffs, values, options) {
    const x = options?.variables?.at(0) ?? "x";
    const y = options?.variables?.at(1) ?? "y";
    const z = options?.variables?.at(2) ?? "z";
    const w = options?.variables?.at(3) ?? "w";
    const variables = [x, y, z, w];
    this.coeffs = coeffs.map((row) => row.map((x) => numberToFraction(x)));
    this.values = values.map((x) => numberToFraction(x));
    this.alignMode = options?.alignMode ?? "alignat";
    this.variables = variables;
    this.alignatArg = 2 * this.coeffs.length + 2;
  }

  /**
   * returns a string representation of the SLE to be fed into a LaTeX align/align* / gather/gather* environment
   */
  toString() {
    if (this.alignMode === "alignat") {
      let string = "";
      for (let [i, row] of this.coeffs.entries()) {
        for (let [j, coeff] of row.entries()) {
          const sign = coeff.is.negative()
            ? j === 0
              ? "- "
              : " &\\,-\\,& "
            : j === 0
            ? ""
            : " &\\,+\\,& ";
          const coeffString = coeff.abs().is.one() ? "" : coeff.abs();
          string += `${sign}${coeffString} &${this.variables[j]}& `;
        }
        string += ` &= ${this.values[i]}`;
        if (i !== this.coeffs.length - 1) string += " \\\\\n";
      }
      return string;
    }
    const equal = this.alignMode === "align" ? " &= " : " = ";
    // convert each row into terms and then into expressions
    const terms = this.coeffs.map((row) =>
      row.map((x, i) => new Term(x, this.variables[i]))
    );
    const exps = terms.map((row) => new Expression(...row));
    return exps.reduce((prev, lhs, i) => {
      const newLine = i === 0 ? "" : " \\\\\n";
      return prev + `${newLine}${lhs}${equal}${this.values[i]}`;
    }, "");
  }

  /**
   * @overload
   * @param {{returnFraction: true}} options - options object defaulting to `{returnFraction: false}`
   * @returns {Fraction[]}
   */
  /**
   * @overload
   * @param {{returnFraction: false}} [options] - options object defaulting to `{returnFraction: false}`
   * @returns {string[]}
   */
  /**
   * solves the system of linear equations, returning an array of strings "x = ..."
   * @param {{returnFraction?: boolean}} [options] - options object defaulting to `{returnFraction: false}`
   * @returns {string[]|Fraction[]} array of strings representing the solutions of the system of linear equations
   */
  solve(options) {
    if (this.coeffs.length === 2) {
      const [x, y] = cramersRule(
        [this.coeffs[0][0], this.coeffs[0][1]],
        this.values[0],
        [this.coeffs[1][0], this.coeffs[1][1]],
        this.values[1]
      );
      if (options?.returnFraction) return [x, y];
      return [`${this.variables[0]} = ${x}`, `${this.variables[1]} = ${y}`];
    } else if (this.coeffs.length === 3) {
      const [x, y, z] = cramersRule(
        [this.coeffs[0][0], this.coeffs[0][1], this.coeffs[0][2]],
        this.values[0],
        [this.coeffs[1][0], this.coeffs[1][1], this.coeffs[1][2]],
        this.values[1],
        [this.coeffs[2][0], this.coeffs[2][1], this.coeffs[2][2]],
        this.values[2]
      );
      if (options?.returnFraction) return [x, y, z];
      return [
        `${this.variables[0]} = ${x}`,
        `${this.variables[1]} = ${y}`,
        `${this.variables[2]} = ${z}`,
      ];
    } else if (this.coeffs.length === 4) {
      const [x, y, z, w] = cramersRule(
        [
          this.coeffs[0][0],
          this.coeffs[0][1],
          this.coeffs[0][2],
          this.coeffs[0][3],
        ],
        this.values[0],
        [
          this.coeffs[1][0],
          this.coeffs[1][1],
          this.coeffs[1][2],
          this.coeffs[1][3],
        ],
        this.values[1],
        [
          this.coeffs[2][0],
          this.coeffs[2][1],
          this.coeffs[2][2],
          this.coeffs[2][3],
        ],
        this.values[2],
        [
          this.coeffs[3][0],
          this.coeffs[3][1],
          this.coeffs[3][2],
          this.coeffs[3][3],
        ],
        this.values[3]
      );
      if (options?.returnFraction) return [x, y, z, w];
      return [
        `${this.variables[0]} = ${x}`,
        `${this.variables[1]} = ${y}`,
        `${this.variables[2]} = ${z}`,
        `${this.variables[3]} = ${w}`,
      ];
    }
    throw new Error(
      `Solving a system of linear equations of size ${this.coeffs.length} is not supported. Only 2-4 equations are supported.`
    );
  }
}

/**
 * SLE class representing a system of linear equations
 * to plugged into a LaTeX align/align* /gather/gather* environment
 * @class
 * @property {number[][]} coeffs - coefficient matrix
 * @property {number[]} values - the values on the right hand side
 * @property {string[]} variables - the variables
 * @property {"off"|"align"|"alignat"} alignMode - whether the equations are aligned (using align or alignat) or not (using gather)
 * @property {number} toFixed - the number of decimal places to round to
 * @property {number} alignatArg - the number of columns to align at (only used if alignMode is "alignat")
 */
export class SLENumerical {
  /** @type {number[][]} */
  coeffs;
  /** @type {number[]} */
  values;
  /** @type {"off"|"align"|"alignat"} */
  alignMode;
  /** @type {number} */
  toFixed;
  /** @type {number} */
  alignatArg;
  /**
   * constructor
   * @param {(number|Fraction)[][]} coeffs - the linear expressions (or coefficient matrix)
   * @param {(number|Fraction)[]} values - the right hand side of the equation
   * @param {{alignMode?: "off"|"align"|"alignat", variables?: string[], toFixed?: number}} [options] - options object defaulting to `{alignMode: "alignat", variables: ['x', 'y', 'z', 'w'], toFixed: 2}`
   */
  constructor(coeffs, values, options) {
    const x = options?.variables?.at(0) ?? "x";
    const y = options?.variables?.at(1) ?? "y";
    const z = options?.variables?.at(2) ?? "z";
    const w = options?.variables?.at(3) ?? "w";
    const variables = [x, y, z, w];
    this.coeffs = coeffs.map((row) => row.map((x) => x.valueOf()));
    this.values = values.map((x) => x.valueOf());
    this.alignMode = options?.alignMode ?? "alignat";
    this.variables = variables;
    this.toFixed = options?.toFixed ?? 2;
    this.alignatArg = 2 * this.coeffs.length + 2;
  }

  /**
   * returns a string representation of the SLE to be fed into a LaTeX align/align* / gather/gather* environment
   */
  toString() {
    if (this.alignMode === "alignat") {
      let string = "";
      for (let [i, row] of this.coeffs.entries()) {
        for (let [j, coeff] of row.entries()) {
          const sign =
            coeff < 0
              ? j === 0
                ? "- "
                : " &\\,-\\,& "
              : j === 0
              ? ""
              : " &\\,+\\,& ";
          const numberString = Math.abs(coeff).toFixed(this.toFixed);
          const coeffString = Math.abs(coeff) === 1 ? "" : numberString;
          string += `${sign}${coeffString} &${this.variables[j]}& `;
        }
        string += ` &= ${this.values[i]}`;
        if (i !== this.coeffs.length - 1) string += " \\\\\n";
      }
      return string;
    }
    const equal = this.alignMode === "align" ? " &= " : " = ";
    // convert each row into terms and then into expressions
    const terms = this.coeffs.map((row) =>
      row.map((x, i) => {
        const numberTerm =
          Math.abs(x) === 1 ? [] : [Math.abs(x).toFixed(this.toFixed)];
        const zeroTerm = x === 0 ? [0] : [];
        return new Term(
          x < 0 ? -1 : 1,
          ...numberTerm,
          this.variables[i],
          ...zeroTerm
        );
      })
    );
    const exps = terms.map((row) => new Expression(...row));
    return exps.reduce((prev, lhs, i) => {
      const newLine = i === 0 ? "" : " \\\\\n";
      return (
        prev + `${newLine}${lhs}${equal}${this.values[i].toFixed(this.toFixed)}`
      );
    }, "");
  }

  /**
   * @overload
   * @param {{returnNumber: true}} options - options object defaulting to `{returnFraction: false}`
   * @returns {number[]}
   */
  /**
   * @overload
   * @param {{returnNumber: false}} [options] - options object defaulting to `{returnFraction: false}`
   * @returns {string[]}
   */
  /**
   * solves the system of linear equations, returning an array of strings "x = ..."
   * @param {{returnNumber?: boolean}} [options] - options object defaulting to `{returnFraction: false}`
   * @returns {string[]|number[]} array of strings representing the solutions of the system of linear equations
   */
  solve(options) {
    if (this.coeffs.length === 2) {
      const [x, y] = cramersRuleNumerical(
        [this.coeffs[0][0], this.coeffs[0][1]],
        this.values[0],
        [this.coeffs[1][0], this.coeffs[1][1]],
        this.values[1]
      );
      if (options?.returnNumber) return [x, y];
      return [
        `${this.variables[0]} = ${x.toFixed(this.toFixed)}`,
        `${this.variables[1]} = ${y.toFixed(this.toFixed)}`,
      ];
    } else if (this.coeffs.length === 3) {
      const [x, y, z] = cramersRuleNumerical(
        [this.coeffs[0][0], this.coeffs[0][1], this.coeffs[0][2]],
        this.values[0],
        [this.coeffs[1][0], this.coeffs[1][1], this.coeffs[1][2]],
        this.values[1],
        [this.coeffs[2][0], this.coeffs[2][1], this.coeffs[2][2]],
        this.values[2]
      );
      if (options?.returnNumber) return [x, y, z];
      return [
        `${this.variables[0]} = ${x.toFixed(this.toFixed)}`,
        `${this.variables[1]} = ${y.toFixed(this.toFixed)}`,
        `${this.variables[2]} = ${z.toFixed(this.toFixed)}`,
      ];
    } else if (this.coeffs.length === 4) {
      const [x, y, z, w] = cramersRuleNumerical(
        [
          this.coeffs[0][0],
          this.coeffs[0][1],
          this.coeffs[0][2],
          this.coeffs[0][3],
        ],
        this.values[0],
        [
          this.coeffs[1][0],
          this.coeffs[1][1],
          this.coeffs[1][2],
          this.coeffs[1][3],
        ],
        this.values[1],
        [
          this.coeffs[2][0],
          this.coeffs[2][1],
          this.coeffs[2][2],
          this.coeffs[2][3],
        ],
        this.values[2],
        [
          this.coeffs[3][0],
          this.coeffs[3][1],
          this.coeffs[3][2],
          this.coeffs[3][3],
        ],
        this.values[3]
      );
      if (options?.returnNumber) return [x, y, z, w];
      return [
        `${this.variables[0]} = ${x.toFixed(this.toFixed)}`,
        `${this.variables[1]} = ${y.toFixed(this.toFixed)}`,
        `${this.variables[2]} = ${z.toFixed(this.toFixed)}`,
        `${this.variables[3]} = ${w.toFixed(this.toFixed)}`,
      ];
    }
    throw new Error(
      `Solving a system of linear equations of size ${this.coeffs.length} is not supported. Only 2-4 equations are supported.`
    );
  }
}
