// the expression class is a collection of terms under addition
// the termPowerMap contains a map of all the terms that have appeared in the expression in order, but may contain terms with zero coefficients
// the terms array removes any such terms with zero coefficients

import { numberToFraction } from "../../utils/toFraction.js";
import { ExpansionTerm } from "../../algebra/index.js";
import { Polynomial, Term, Fraction, Expression } from "../../core/index.js";
import { nCr } from "../../numerical/index.js";

/** Binomial General Term class
 * @property {Fraction|string} coeff1
 * @property {number} power1
 * @property {Fraction|string} coeff2
 * @property {number} power2
 * @property {number} n
 */
export class BinomialGeneralTerm extends ExpansionTerm {
  /** @type {Fraction|string} coeff1 */
  coeff1;
  /** @type {number} power1 */
  power1;
  /** @type {Fraction|string} coeff2 */
  coeff2;
  /** @type {number} power2 */
  power2;
  /** @type {number} n  */
  n;
  /** @type {Term} term1 */
  term1;
  /** @type {Term} term2 */
  term2;
  /**
   * @constructor
   * Creates a Binomial General Term instance instance
   * @param {number|Fraction|string} coeff1
   * @param {number} power1
   * @param {number|Fraction|string} coeff2
   * @param {number} power2
   * @param {number} n
   */
  constructor(coeff1, power1, coeff2, power2, n) {
    const term1 = new Term(coeff1, ["x", power1]).setDisplayMode("always");
    const term2 = new Term(coeff2, ["x", power2]).setDisplayMode("always");
    super([new Expression(term1, term2), n]);
    this.coeff1 =
      typeof coeff1 === "number" ? numberToFraction(coeff1) : coeff1;
    this.power1 = power1;
    this.coeff2 =
      typeof coeff2 === "number" ? numberToFraction(coeff2) : coeff2;
    this.power2 = power2;
    this.n = n;
    this.term1 = term1;
    this.term2 = term2;
  }

  /**
   * power
   * @return {Polynomial}
   */
  power() {
    // p1*(n-r) + p2*r
    // p1*n + (p2-p1)*r
    return new Polynomial([this.power1 * this.n, this.power2 - this.power1], {
      variable: "r",
      ascending: true,
    });
  }

  /**
   * coeff
   * @return {string}
   */
  coefficient() {
    const c1 =
      `${this.coeff1}` === "1"
        ? ""
        : `${this.coeff1}`.length > 1
        ? `\\left(${this.coeff1}\\right)`
        : `${this.coeff1}`;
    const c2 =
      `${this.coeff2}` === "1"
        ? ""
        : `${this.coeff2}`.length > 1
        ? `\\left(${this.coeff2}\\right)`
        : `${this.coeff2}`;
    const c1String = c1 === "" ? "" : ` ${c1}^{${this.n}-r}`;
    const c2String = c2 === "" ? "" : ` ${c2}^r`;
    return `{${this.n} \\choose r}${c1String}${c2String}`;
  }

  /**
   * coeff
   * @param {number|Fraction} r
   * @return {Fraction}
   */
  coefficientFraction(r) {
    if (this.coeff1 instanceof Fraction && this.coeff2 instanceof Fraction) {
      return this.coeff1
        .pow(this.n - r.valueOf())
        .times(this.coeff2.pow(r.valueOf()))
        .times(nCr(this.n, r.valueOf()));
    }
    throw new Error(`coeff1 and coeff2 must be fractions`);
  }

  /**
   * general term
   * @param {{working?: boolean, aligned?: boolean}} [options] defaults to {working: true, aligned: true}
   * @returns {string}
   */
  generalTerm(options) {
    const { working, aligned } = { working: true, aligned: true, ...options };
    let string = "";
    if (working) {
      const t1Brackets =
        `${this.term1}` === "x"
          ? `${this.term1}`
          : `\\left(${this.term1}\\right)`;
      const t2Brackets =
        `${this.term2}` === "x"
          ? `${this.term2}`
          : `\\left(${this.term2}\\right)`;
      string += `{${this.n} \\choose r} ${t1Brackets}^{${this.n}-r} ${t2Brackets}^r \\\\`;
      if (aligned) {
        string += `&= `;
      }
      const c1 =
        `${this.coeff1}` === "1"
          ? ""
          : `${this.coeff1}`.length > 1
          ? `\\left(${this.coeff1}\\right)`
          : `${this.coeff1}`;
      const c2 =
        `${this.coeff2}` === "1"
          ? ""
          : `${this.coeff2}`.length > 1
          ? `\\left(${this.coeff2}\\right)`
          : `${this.coeff2}`;
      const c1String = c1 === "" ? "" : ` ${c1}^{${this.n}-r}`;
      const c2String = c2 === "" ? "" : ` ${c2}^r`;
      const x1 = this.power1 === 1 ? "x" : `\\left(x^{${this.power1}}\\right)`;
      const x2 = this.power2 === 1 ? "x" : `\\left(x^{${this.power2}}\\right)`;
      string += `{${this.n} \\choose r} ${c1String} ${x1}^{${this.n}-r} ${c2String} ${x2}^r  \\\\`;
      if (aligned) {
        string += `&= `;
      }
    }
    string += `${this.coefficient()} x^{${this.power()}}`;
    return string;
  }
}
