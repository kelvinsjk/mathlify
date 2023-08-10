// the expression class is a collection of terms under addition
// the termPowerMap contains a map of all the terms that have appeared in the expression in order, but may contain terms with zero coefficients
// the terms array removes any such terms with zero coefficients

import { numberToFraction } from "../../../utils/toFraction.js";
import { Fraction } from "../../fraction.js";
import { Expression } from "../expression/index.js";
import { Term } from "../term/index.js";

/** Expression class
 * @property {Fraction[]} coeffs - the coefficients, in ascending order
 * @property {string} variable - the variable
 * @property {boolean} ascending - whether the polynomial is in ascending order
 * @property {number} degree - the degree of the polynomial
 * @property {"polynomial"} kind - mathlify expression class kind
 * @property {"linear-polynomial"|"quadratic-polynomial"} type - mathlify expression class type
 */
export class Polynomial extends Expression {
  /**
   * @constructor
   * Creates a Polynomial instance
   * @param {(number|Fraction)[]|number|Fraction} coeffs - the coefficients.
   * @param {{ascending?: boolean, variable?: string}} [options] - options. default to {ascending: false, variable: "x"}
   *
   * Note that new Polynomial([2]) creates the constant polynomial "2" while new Polynomial(2) creates the linear polynomial "2x"
   */
  constructor(coeffs, options) {
    const { ascending = false, variable = "x" } = options ?? {};
    if (typeof coeffs === "number" || coeffs instanceof Fraction) {
      coeffs = ascending ? [0, coeffs] : [coeffs, 0];
    }
    const coeffsFrac = [
      numberToFraction(coeffs[0]),
      ...coeffs.slice(1).map((coeff) => numberToFraction(coeff)),
    ];
    if (!ascending) {
      coeffsFrac.reverse();
    }
    const coeffsCleaned = removeTrailingZeroes(coeffsFrac);
    const terms = coeffsCleaned.map(
      (coeff, i) => new Term(coeff, { variable, power: i })
    );
    if (!ascending) {
      terms.reverse();
    }
    super(...terms);
    this.coeffs = coeffsCleaned;
    this.variable = variable;
    this.ascending = ascending;
    this.degree = this.coeffs.length - 1;
    /** @type {"polynomial"} */
    this.kind = "polynomial";
    /** @type {"polynomial"|"linear-polynomial"|"quadratic-polynomial"}  */
    this.type =
      this.degree === 1
        ? "linear-polynomial"
        : this.degree === 2
        ? "quadratic-polynomial"
        : "polynomial";
  }

  /**
   * Polynomial addition
   * @param {Polynomial|number|Fraction} x - the polynomial to be added
   * @returns {Polynomial} - the sum of the two
   */
  plus(x) {
    if (!(x instanceof Polynomial)) {
      x = new Polynomial([x]);
    }
    const newCoeffs = addArrays(this.coeffs, x.coeffs);
    if (!this.ascending) {
      newCoeffs.reverse();
    }
    return new Polynomial(newCoeffs, {
      ascending: this.ascending,
      variable: this.variable,
    });
  }

  /**
   * negative
   * @returns {Polynomial} the negative of the polynomial
   */
  negative() {
    const newCoeffs = this.coeffs.map((coeff) => coeff.negative());
    if (!this.ascending) {
      newCoeffs.reverse();
    }
    return new Polynomial(newCoeffs, {
      ascending: this.ascending,
      variable: this.variable,
    });
  }

  /**
   * Polynomial subtraction
   * @param {Polynomial|number|Fraction} x - polynomial to be subtracted
   * @returns {Polynomial} - the difference this minus x
   */
  minus(x) {
    if (typeof x === "number" || typeof x === "string") {
      x = new Polynomial([x]);
    }
    return this.plus(x.negative());
  }

  /**
   * Polynomial multiplication
   * @param {Polynomial|number|Fraction} x - polynomial to be multiplied
   * @returns {Polynomial} - the product
   */
  times(x) {
    const xPoly = x instanceof Polynomial ? x : new Polynomial([x]);
    /** @type {Fraction[]} */
    let newCoeffs = [];
    xPoly.coeffs.forEach((coeff, i) => {
      newCoeffs = addArrays(newCoeffs, [
        ...new Array(i).fill(new Fraction(0)),
        ...this.coeffs.map((thisCoeff) => thisCoeff.times(coeff)),
      ]);
    });
    if (!this.ascending) {
      newCoeffs.reverse();
    }
    return new Polynomial(newCoeffs, {
      ascending: this.ascending,
      variable: this.variable,
    });
  }

  /**
   * Polynomial division (by a constant)
   * @param {number|Fraction} x - the constant to divided by
   * @returns {Polynomial} - the quotient
   */
  divide(x) {
    const newCoeffs = this.coeffs.map((coeff) => coeff.divide(x));
    if (!this.ascending) {
      newCoeffs.reverse();
    }
    return new Polynomial(newCoeffs, {
      ascending: this.ascending,
      variable: this.variable,
    });
  }

  /**
   * power
   * @param {number|Fraction} n - the power to raise the polynomial to
   * @returns {Polynomial} - the polynomial raised to the power n
   */
  pow(n) {
    if (n instanceof Fraction) {
      n = n.valueOf();
    }
    if (!Number.isInteger(n) || n < 0) {
      throw new Error(`power must be a non-negative integer. ${n} received.`);
    }
    if (n === 0) {
      return new Polynomial([1]);
    }
    let result = new Polynomial([1], {
      variable: this.variable,
      ascending: this.ascending,
    });
    for (let i = 0; i < n; i++) {
      result = result.times(this);
    }
    return result;
  }

  /**
   * square
   * @returns {Polynomial} - the square of the polynomial
   */
  square() {
    return this.pow(2);
  }

  /**
   * sub in a Fraction
   * @overload
   * @param {Fraction|number} x - the values to sub in
   * @returns {Fraction} - Fraction
   */
  /**
   * @overload
   * @param {{[key: string]: number|Fraction}} x - the values to sub in with the key being the variable signature.
   * @returns {Expression} - the new Expression (WARNING: you are unlikely to want to use this method)
   */
  /**
   * sub in a value for a variable
   * @param {{[key: string]: number|Fraction}|number|Fraction} x - the value to sub in
   * @returns {Expression|Fraction} - the new Expression
   * @example new Expression(2,'x').subIn({x: 3}) returns new Expression(6)
   */
  subIn(x) {
    if (typeof x === "number" || x instanceof Fraction) {
      const xFrac = numberToFraction(x);
      return this.coeffs.reduce((prev, coeff, i) => {
        return prev.plus(coeff.times(xFrac.pow(i)));
      });
    }
    return super.subIn(x);
  }
}

/**
 *
 * @param {Fraction[]} arr
 * @returns {Fraction[]} array with trailing zeroes removed (leaving at least 1 element)
 */
function removeTrailingZeroes(arr) {
  let i = arr.length - 1;
  while (i >= 0 && arr[i].is.zero()) {
    i--;
  }
  return i === -1 ? [new Fraction(0)] : arr.slice(0, i + 1);
}

/**
 * add two arrays of Fractions, padding with zeros if necessary
 * @param {Fraction[]} arr1
 * @param {Fraction[]} arr2
 * @returns {Fraction[]} the sum of the two arrays
 */
function addArrays(arr1, arr2) {
  const maxLength = Math.max(arr1.length, arr2.length);
  const arr1Padded = [
    ...arr1,
    ...Array(maxLength - arr1.length).fill(new Fraction(0)),
  ];
  const arr2Padded = [
    ...arr2,
    ...Array(maxLength - arr2.length).fill(new Fraction(0)),
  ];
  return arr1Padded.map((x, i) => x.plus(arr2Padded[i]));
}
