// the polynomial class is a subclass of the expression class
// representing a single variable polynomial with coefficients in \mathbb{Q}
// the coefficients, stored in ascending order in `coeffs`, uniquely identify the polynomial,
// while the variable and ascending properties are used for display purposes

import { Fraction, numberToFraction } from "./fraction.js";
import { Expression } from "./expression.js";
import { Term } from "./term.js";

/** Polynomial class
 * @property {Fraction[]} coeffs - the coefficients, in ascending order
 * @property {string} variable - the variable
 * @property {boolean} ascending - whether the polynomial is in ascending order
 * @property {"polynomial"} type - mathlify polynomial type
 */
export class Polynomial extends Expression {
  /** @type {Fraction[]} */
  coeffs;
  /** @type {string} */
  variable;
  /** @type {boolean} */
  ascending;
  /** @type {"polynomial"} */
  type;
  /**
   * @constructor
   * @param {(number|Fraction)[]|string} coeffs the coefficients.
   * @param {{ascending?: boolean, variable?: string}} [options] options. default to {ascending: false, variable: "x"}
   */
  constructor(coeffs, options) {
    const ascending = options?.ascending ?? false;
    let variable = options?.variable ?? "x";
    if (typeof coeffs === "string") {
      variable = coeffs;
      coeffs = ascending ? [0, 1] : [1, 0];
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
    this.type = "polynomial";
  }

  /** degree of polynomial @type {number} */
  get degree() {
    return this.coeffs.length - 1;
  }

  /** leading coeff @type {Fraction} */
  get leadingCoeff() {
    return this.coeffs[this.coeffs.length - 1];
  }

  /** @type {boolean} */
  get descending() {
    return !this.ascending;
  }

  /**
   * @param {boolean} [ascending] whether the new polynomial should be ascending (defaults to toggle current)
   * @returns {Polynomial} the polynomial with the new ascending property
   */
  changeAscending(ascending) {
    if (ascending === undefined) {
      ascending = !this.ascending;
    }
    const coeffs = [...this.coeffs];
    if (!ascending) {
      coeffs.reverse();
    }
    return new Polynomial(coeffs, {
      ascending,
      variable: this.variable,
    });
  }

  /**
   * @overload
   * @param {Polynomial|number|Fraction} x the polynomial to be added
   * @returns {Polynomial} the sum of the two
   */
  /**
   * @overload
   * @param {Term|Expression|string} x item to be added
   * @returns {Expression} the sum
   */
  /**
   * @param {number|Fraction|string|Term|Expression} x item to be added
   * @returns {Expression} the sum. A polynomial if x is number/string/Polynomial, and an expression if x is of string or Term type
   */
  plus(x) {
    if (
      typeof x === "string" ||
      x instanceof Term ||
      (x instanceof Expression && !(x instanceof Polynomial))
    ) {
      return super.plus(x);
    }
    const xPoly =
      x instanceof Polynomial
        ? x
        : new Polynomial([x], { variable: this.variable });
    if (
      this.variable !== xPoly.variable &&
      this.degree !== 0 &&
      xPoly.degree !== 0
    ) {
      throw new Error(
        `cannot add polynomials with different variables: ${this.variable} and ${xPoly.variable} received`
      );
    }
    const newCoeffs = addArrays(this.coeffs, xPoly.coeffs);
    if (this.descending) {
      newCoeffs.reverse();
    }
    return new Polynomial(newCoeffs, {
      ascending: this.ascending,
      variable: this.variable,
    });
  }

  /**
   * @returns {Polynomial} the negative of the polynomial
   */
  negative() {
    const newCoeffs = this.coeffs.map((coeff) => coeff.negative());
    if (this.descending) {
      newCoeffs.reverse();
    }
    return new Polynomial(newCoeffs, {
      ascending: this.ascending,
      variable: this.variable,
    });
  }

  /**
   * @overload
   * @param {Polynomial|number|Fraction} x the polynomial to be subtracted
   * @returns {Polynomial} the difference this minus x
   */
  /**
   * @overload
   * @param {Term|Expression|string} x item to be subtracted
   * @returns {Expression} the difference
   */
  /**
   * @param {number|Fraction|string|Term|Expression} x item to be added
   * @returns {Expression} the difference. A polynomial if x is number/string/Polynomial, and an expression if x is of string or Term type
   */
  minus(x) {
    if (
      typeof x === "string" ||
      x instanceof Term ||
      (x instanceof Expression && !(x instanceof Polynomial))
    ) {
      return super.minus(x);
    }
    const xPoly =
      x instanceof Polynomial
        ? x
        : new Polynomial([x], { variable: this.variable });
    return this.plus(xPoly.negative());
  }

  /**
   * @overload
   * @param {Polynomial|number|Fraction} x polynomial to be multiplied
   * @returns {Polynomial} the product
   */
  /**
   * @overload
   * @param {Term|Expression|string} x item to be multiplied
   * @returns {Expression} the product
   */
  /**
   * @param {Polynomial|number|Fraction|Term|Expression|string} x item to be multiplied
   * @returns {Expression} the product. A polynomial if x is number/string/Polynomial, and an expression if x is of string or Term type
   */
  times(x) {
    if (
      x instanceof Term ||
      typeof x === "string" ||
      (x instanceof Expression && !(x instanceof Polynomial))
    ) {
      return super.times(x);
    }
    const xPoly = x instanceof Polynomial ? x : new Polynomial([x]);
    /** @type {Fraction[]} */
    let newCoeffs = [];
    xPoly.coeffs.forEach((coeff, i) => {
      newCoeffs = addArrays(newCoeffs, [
        ...new Array(i).fill(new Fraction(0)),
        ...this.coeffs.map((thisCoeff) => thisCoeff.times(coeff)),
      ]);
    });
    if (this.descending) {
      newCoeffs.reverse();
    }
    return new Polynomial(newCoeffs, {
      ascending: this.ascending,
      variable: this.variable,
    });
  }

  /**
   * Polynomial division (by a constant)
   * @param {number|Fraction} x the constant to divided by
   * @returns {Polynomial} the quotient this divided by x
   * @warning for polynomial division consider the rational term class
   */
  divide(x) {
    const newCoeffs = this.coeffs.map((coeff) => coeff.divide(x));
    if (this.descending) {
      newCoeffs.reverse();
    }
    return new Polynomial(newCoeffs, {
      ascending: this.ascending,
      variable: this.variable,
    });
  }

  /**
   * @param {number|Fraction} n the power to raise the polynomial to
   * @returns {Polynomial} the polynomial raised to the power n
   */
  pow(n) {
    if (n instanceof Fraction) {
      n = n.valueOf();
    }
    if (!Number.isInteger(n) || n < 0) {
      throw new Error(`power must be a non-negative integer. ${n} received.`);
    }
    if (n === 0) {
      return new Polynomial([1], {
        variable: this.variable,
        ascending: this.ascending,
      });
    }
    let result = new Polynomial([1], {
      variable: this.variable,
      ascending: this.ascending,
    });
    for (let i = 0; i < n; i++) {
      result = /**@type{Polynomial}*/ (result.times(this));
    }
    return result;
  }

  /**
   * @returns {Polynomial} the square of the polynomial
   */
  square() {
    return this.pow(2);
  }

  /**
   * @overload
   * @param {Fraction|number} x the value to sub in as the variable
   * @returns {Fraction} the resulting fraction
   */
  /**
   * @overload
   * @param {{[key: string]: number|Fraction}} x the values to sub in with the key being the variable signature.
   * @returns {Expression} - the resultant Expression
   * @warning you are unlikely to want to use this method for a polynomial. consider providing just a number/Fraction
   */
  /**
   * @param {{[key: string]: number|Fraction}|number|Fraction} x the value to sub in
   * @returns {Expression|Fraction} the result after subbing in x
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

  /**
   * @param {number|Fraction} x the value to sub in
   * @returns {number} the result after subbing in x
   */
  subInNumber(x) {
    return this.coeffs.reduce((prev, coeff, i) => {
      return prev + coeff.valueOf() * Math.pow(x.valueOf(), i);
    }, 0);
  }

  /**
   * @param {Polynomial|string|(number|Fraction)[]} x polynomial to replace variable with
   * @param {{ascending?: boolean, variable?: string}} [options] options for constructing polynomial from string/coeff Array. defaults to {ascending: false, variable: "x"}
   * @returns {Polynomial} the new polynomial after replacement
   */
  replaceXWith(x, options) {
    /** @type {Polynomial} */
    let xPoly;
    if (typeof x === "string") {
      xPoly = new Polynomial(x, options);
    } else if (Array.isArray(x)) {
      xPoly = new Polynomial(x, options);
    } else {
      xPoly = x;
    }
    /** @type {Fraction[]} */
    const startingArray = [];
    const finalArray = this.coeffs.reduce((prev, coeff, i) => {
      return addArrays(prev, xPoly.pow(i).times(coeff).coeffs);
    }, startingArray);
    if (this.descending) {
      finalArray.reverse();
    }
    return new Polynomial(finalArray, {
      variable: xPoly.variable,
      ascending: this.ascending,
    });
  }

  /**
   * slices the polynomial, returning a concatenated polynomial of degree n
   * @param {number} end the end index (degree of the new polynomial will be end-1)
   * @return {Polynomial} the sliced polynomial
   */
  slice(end) {
    const newCoeffs = this.coeffs.slice(0, end);
    if (this.descending) {
      newCoeffs.reverse();
    }
    return new Polynomial(newCoeffs, {
      variable: this.variable,
      ascending: this.ascending,
    });
  }

  // /**
  //  * @returns {Fraction} the quadratic discriminant
  //  * @throws if the polynomial is not quadratic
  //  */
  // quadraticDiscriminant() {
  //   if (this.coeffs.length !== 3) {
  //     throw new Error(`${this} is not a quadratic`);
  //   }
  //   const [c, b, a] = this.coeffs;
  //   return b.square().minus(a.times(c).times(4));
  // }

  /**
   * @param {number|Fraction} [x] if undefined, check if polynomial is a constant. otherwise, check if the polynomial is a constant equal to x
   * @returns {boolean} whether the polynomial is a constant/is equal to a provided constant
   */
  isConstant(x) {
    if (this.coeffs.length === 1) {
      if (x === undefined) {
        return true;
      }
      return this.coeffs[0].is.equalTo(x);
    }
    return false;
  }

  /**
   * @returns {Polynomial} the derivative
   */
  differentiate() {
    const newCoeffs = this.coeffs
      .slice(1)
      .map((coeff, i) => coeff.times(i + 1));
    if (this.descending) {
      newCoeffs.reverse();
    }
    if (newCoeffs.length === 0) {
      newCoeffs.push(new Fraction(0));
    }
    return new Polynomial(newCoeffs, {
      variable: this.variable,
      ascending: this.ascending,
    });
  }

  /**
   * @param {number|Fraction} [c=0] the constant of integration
   * @returns {Polynomial} the integral
   */
  integrate(c = 0) {
    const newCoeffs = [
      c,
      ...this.coeffs.map((coeff, i) => coeff.divide(i + 1)),
    ];
    if (this.descending) {
      newCoeffs.reverse();
    }
    return new Polynomial(newCoeffs, {
      variable: this.variable,
      ascending: this.ascending,
    });
  }

  /**
   * @param {number|Fraction} lower the lower limit
   * @param {number|Fraction} upper the upper limit
   * @returns {Fraction} the definite integral
   */
  definiteIntegral(lower, upper) {
    const integral = this.integrate();
    return integral.subIn(upper).minus(integral.subIn(lower));
  }

  // /**
  //  * @param {number|Fraction} x the value to sub in
  //  * @returns {[string, Fraction]} a string representing the intermediate step of subbing in x, and the resultant polynomial
  //  */
  // subInWorking(x) {
  //   const xFrac = numberToFraction(x);
  //   const coeffs = [...this.coeffs];
  //   if (this.descending) {
  //     coeffs.reverse();
  //   }
  //   /** @type {boolean} */
  //   let first = true;
  //   const working = coeffs.reduce((prev, coeff, i) => {
  //     if (coeff.is.zero()) {
  //       return prev;
  //     }
  //     const power = this.ascending ? i : this.degree - i;
  //     const addition = coeff.is.positive();
  //     let term = "";
  //     if (power === 0) {
  //       term = `${coeff.abs().toTex()}`;
  //     } else if (power === 1) {
  //       const xBrackets =
  //         `${xFrac.toTex()}`.length === 1 && coeff.abs().is.one()
  //           ? `${xFrac.toTex()}`
  //           : `\\left(${xFrac.toTex()}\\right)`;
  //       term = `${new Term(coeff.abs(), xBrackets).toTex()}`;
  //     } else {
  //       const xBrackets =
  //         `${xFrac.toTex()}`.length === 1 && coeff.abs().is.one()
  //           ? `${xFrac.toTex()}`
  //           : `\\left(${xFrac.toTex()}\\right)`;
  //       term = `${new Term(coeff.abs(), [xBrackets, power]).toTex()}`;
  //     }
  //     if (first) {
  //       first = false;
  //       return addition ? term : `- ${term}`;
  //     }
  //     return prev + (addition ? ` + ${term}` : ` - ${term}`);
  //   }, "");
  //   return [working, this.subIn(x)];
  // }

  /**
   * @param {number} degree
   * @param {{variable?: string, ascending?: boolean, coeff?: number|Fraction}} [options] defaults to {variable:'x', ascending: false, coeff: 1}
   * @returns {Polynomial} a single-term polynomial of required degree
   */
  static ofDegree(degree, options) {
    /** @type {(number|Fraction)[]} */
    const coeffs = new Array(degree).fill(0);
    const coeff = options?.coeff ?? 1;
    if (options?.ascending) {
      coeffs.push(coeff);
    } else {
      coeffs.unshift(coeff);
    }
    return new Polynomial(coeffs, options);
  }

  /** @typedef {import('./types.d.ts').PolynomialJSON} PolynomialJSON */
  /**
   * serializes polynomial object. can be used with the static
   * `Polynomial.FromJSON` method to recreate this polynomial
   * class instance
   * @returns {PolynomialJSON}
   */
  toJSON() {
    /** @type {PolynomialJSON[]} */
    return {
      ...super.toJSON(),
      type: "polynomial",
      variable: this.variable,
      coeffs: this.coeffs.map((c) => c.toTex()),
      args2: [
        this.coeffs.map((c) => c.toJSON()),
        { variable: this.variable, ascending: this.ascending },
      ],
    };
  }

  //! static methods
  /**
   * re-instantiate Polynomial class instance from JSON object literal
   * @param {PolynomialJSON} p JSON object literal obtained from JSON.parse
   * @returns {Polynomial} Term class instance
   */
  static fromJSON(p) {
    const [coeffsJSON, options] = p.args2;
    const coeffs = coeffsJSON.map((c) => Fraction.fromJSON(c));
    if (!options.ascending) {
      coeffs.reverse();
    }
    return new Polynomial(coeffs, options);
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
