/**
 * @typedef {import('../../core/index.js').Fraction} Fraction
 */

import { RationalTerm } from "../../algebra";
import { Term, Expression } from "../../core";
import { numberToFraction } from "../../utils";

/** Expression class
 * @property {Map<Fraction,Fraction>} coeffsMap - the coefficients. {power: coefficient}
 * @property {string} variable - the variable
 * @property {"polynomial-like"} kind - mathlify expression class kind
 * @property {"polynomial-like"} type - mathlify expression class type
 */
export class PolynomialLike extends Expression {
  /** @type {Map<Fraction,Fraction>} */
  coeffsMap;
  /** @type {string} */
  variable;
  /** @type {"polynomial-like"} */
  kind;
  /** @type {"polynomial-like"} */
  type;
  /**
   * @constructor
   * Creates a PolynomialLike instance
   * @param {[number|Fraction, number|Fraction][]} coeffsPowerArr - the coefficients in the order [coeff, power]
   * @param {{variable?: string}} [options] - options. default to {variable: "x"}
   */
  constructor(coeffsPowerArr, options) {
    const { variable = "x" } = options ?? {};
    /** @type {Map<Fraction,Fraction>} */
    const coeffsMap = new Map();
    coeffsPowerArr.forEach(([coeff, power]) => {
      const powerFrac = numberToFraction(power);
      const coeffFrac = numberToFraction(coeff);
      if (coeffsMap.has(powerFrac)) {
        const currentCoeff = /** @type {Fraction} */ (coeffsMap.get(powerFrac));
        coeffsMap.set(powerFrac, currentCoeff.plus(coeffFrac));
      } else {
        coeffsMap.set(powerFrac, coeffFrac);
      }
    });
    /** @type {Term[]} */
    const terms = [];
    for (const [power, coeff] of coeffsMap.entries()) {
      if (power.is.zero()) {
        terms.push(new Term(coeff));
      } else if (power.is.positive()) {
        if (power.den === 2) {
          const num = power.num;
          const numBraces = `${num}`.length === 1 ? `${num}` : `{${num}}`;
          const variableBrackets =
            `${variable}`.length === 1
              ? variable
              : `\\left(${variable}\\right)`;
          const variableString =
            num === 1 ? variable : `${variableBrackets}^${numBraces}`;
          terms.push(new Term(coeff, `\\sqrt{${variableString}}`));
        } else {
          terms.push(new Term(coeff, [variable, power]));
        }
      } else {
        if (power.den === 2) {
          const num = power.abs().num;
          const numBraces = `${num}`.length === 1 ? `${num}` : `{${num}}`;
          const variableBrackets =
            `${variable}`.length === 1
              ? variable
              : `\\left(${variable}\\right)`;
          const variableString =
            num === 1 ? variable : `${variableBrackets}^${numBraces}`;
          const sqrtString = `\\sqrt{${variableString}}`;
          const rational = new RationalTerm(
            coeff.abs().num,
            new Term(coeff.den, sqrtString),
            { coeff: coeff.sign() }
          );
          terms.push(rational);
        } else {
          const rational = new RationalTerm(
            coeff.abs().num,
            new Term(coeff.den, [variable, power.abs()]),
            { coeff: coeff.sign() }
          );
          terms.push(rational);
        }
      }
    }
    super(...terms);
    this.coeffsMap = coeffsMap;
    this.variable = variable;
    this.kind = "polynomial-like";
    this.type = "polynomial-like";
  }

  /**
   * to constructor args
   * @returns {[[number|Fraction, number|Fraction][], {variable: string}]}
   */
  toConstructorArgs() {
    /** @type {[Fraction, Fraction][]} */
    const coeffsPowerArr = [];
    for (const [power, coeff] of this.coeffsMap.entries()) {
      coeffsPowerArr.push([coeff, power]);
    }
    return [coeffsPowerArr, { variable: this.variable }];
  }

  /**
   * flatten, returning an expression of the form ax^n + bx^(n-1) + ... + cx + d
   * @returns {Expression}
   */
  flatten() {
    /** @type {Term[]} */
    let flattenedTerms = [];
    for (const [power, coeff] of this.coeffsMap.entries()) {
      flattenedTerms.push(
        new Term(coeff, [this.variable, power]).setDisplayMode("never")
      );
    }
    return new Expression(...flattenedTerms);
  }

  /**
   * @overload
   * @param {PolynomialLike} x
   * @returns {PolynomialLike}
   */
  /**
   * @overload
   * @param {string|number|Expression} x
   * @returns {Expression}
   */
  /**
   * Expression addition
   * @param {string|number|Expression|PolynomialLike} x - term/expression to be added
   * @returns {PolynomialLike|Expression} - the sum of the two
   */
  plus(x) {
    if (x instanceof PolynomialLike) {
      const [arr, variable] = this.toConstructorArgs();
      const [xArr] = x.toConstructorArgs();
      return new PolynomialLike([...arr, ...xArr], variable);
    }
    return super.plus(x);
  }

  /**
   * negative
   * @returns {PolynomialLike} the negative of the polynomial
   */
  negative() {
    /** @type {[Fraction, Fraction][]} */
    const coeffsPowerArr = [];
    for (const [power, coeff] of this.coeffsMap.entries()) {
      coeffsPowerArr.push([coeff.negative(), power]);
    }
    return new PolynomialLike(coeffsPowerArr, { variable: this.variable });
  }

  /**
   * @overload
   * @param {PolynomialLike} x
   * @returns {PolynomialLike}
   */
  /**
   * @overload
   * @param {string|number|Expression} x
   * @returns {Expression}
   */
  /**
   * Expression subtraction
   * @param {string|number|Expression|PolynomialLike} x - term/expression to be subtracted
   * @returns {PolynomialLike|Expression} - the sum of the two
   */
  minus(x) {
    if (x instanceof PolynomialLike) {
      return this.plus(x.negative());
    }
    return super.minus(x);
  }

  ///**
  // * sub in a Fraction
  // * @overload
  // * @param {Fraction|number} x - the values to sub in
  // * @returns {Fraction} - Fraction
  // */
  ///**
  // * @overload
  // * @param {{[key: string]: number|Fraction}} x - the values to sub in with the key being the variable signature.
  // * @returns {Expression} - the new Expression (WARNING: you are unlikely to want to use this method)
  // */
  ///**
  // * sub in a value for a variable
  // * @param {{[key: string]: number|Fraction}|number|Fraction} x - the value to sub in
  // * @returns {Expression|Fraction} - the new Expression
  // * @example new Expression(2,'x').subIn({x: 3}) returns new Expression(6)
  // */
  //subIn(x) {
  //	if (typeof x === 'number' || x instanceof Fraction) {
  //		const xFrac = numberToFraction(x);
  //		return this.coeffs.reduce((prev, coeff, i) => {
  //			return prev.plus(coeff.times(xFrac.pow(i)));
  //		});
  //	}
  //	return super.subIn(x);
  //}

  // /**
  //  * replace x with a polynomial
  //  * @param {Polynomial|string|(number|Fraction)[]} x - polynomial to replace x with
  //  * @param {{ascending?: boolean, variable?: string}} [options] - options for when a coefficient array is given default to {ascending: false, variable: "x"}
  //  * @returns {Polynomial}
  //  */
  // replaceXWith(x, options) {
  // 	/** @type {Polynomial} */
  // 	let xPoly;
  // 	if (typeof x === 'string') {
  // 		xPoly = new Polynomial(1, { variable: x });
  // 	} else if (Array.isArray(x)) {
  // 		xPoly = new Polynomial(x, options);
  // 	} else {
  // 		xPoly = x;
  // 	}
  // 	/** @type {Fraction[]} */
  // 	const startingArray = [];
  // 	const finalArray = this.coeffs.reduce((prev, coeff, i) => {
  // 		return addArrays(prev, xPoly.pow(i).times(coeff).coeffs);
  // 	}, startingArray);
  // 	if (!this.ascending) {
  // 		finalArray.reverse();
  // 	}
  // 	return new Polynomial(finalArray, {
  // 		variable: xPoly.variable,
  // 		ascending: this.ascending,
  // 	});
  // }

  /**
   * differentiate
   * @returns {PolynomialLike} - the derivative
   */
  differentiate() {
    /** @type {[Fraction, Fraction][]} */
    const coeffsPowerArr = [];
    for (const [power, coeff] of this.coeffsMap.entries()) {
      if (power.is.zero()) {
        continue;
      }
      coeffsPowerArr.push([coeff.times(power), power.minus(1)]);
    }
    return new PolynomialLike(coeffsPowerArr, {
      variable: this.variable,
    });
  }

  /**
   * integrate
   * @param {number|Fraction} [c=0] - the constant of integration
   * @returns {PolynomialLike} - the integral
   */
  integrate(c = 0) {
    /** @type {[Fraction, Fraction][]} */
    const coeffsPowerArr = [];
    for (const [power, coeff] of this.coeffsMap.entries()) {
      coeffsPowerArr.push([coeff.divide(power.plus(1)), power.plus(1)]);
    }
    return new PolynomialLike(
      [...coeffsPowerArr, [numberToFraction(c), numberToFraction(0)]],
      {
        variable: this.variable,
      }
    );
  }

  // /**
  //  * definite integral
  //  * @param {number|Fraction} lower - the lower limit
  //  * @param {number|Fraction} upper - the upper limit
  //  * @returns {Fraction} - the definite integral
  //  */
  // definiteIntegral(lower, upper) {
  // 	const integral = this.integrate();
  // 	return integral.subIn(lower).minus(integral.subIn(upper));
  // }

  // /**
  //  * sub in working
  //  * @param {number|Fraction} x - the value to sub in
  //  * @returns {string}
  //  */
  // subInWorking(x) {
  // 	const coeffs = [...this.coeffs];
  // 	if (!this.ascending) {
  // 		coeffs.reverse();
  // 	}
  // 	/** @type {boolean} */
  // 	let first = true;
  // 	/** @type {{term: string, addition: boolean}[]} */
  // 	return coeffs.reduce((prev, coeff, i) => {
  // 		if (coeff.is.zero()) {
  // 			return prev;
  // 		}
  // 		const power = this.ascending ? i : this.degree - i;
  // 		const addition = coeff.is.positive();
  // 		let term = '';
  // 		if (power === 0) {
  // 			term = `${coeff.abs()}`;
  // 		} else if (power === 1) {
  // 			const xBrackets =
  // 				`${x}`.length === 1 && coeff.abs().is.one()
  // 					? `${x}`
  // 					: `\\left(${x}\\right)`;
  // 			term = `${new Term(coeff.abs(), xBrackets)}`;
  // 		} else {
  // 			const xBrackets =
  // 				`${x}`.length === 1 && coeff.abs().is.one()
  // 					? `${x}`
  // 					: `\\left(${x}\\right)`;
  // 			term = `${new Term(coeff.abs(), [xBrackets, power])}`;
  // 		}
  // 		if (first) {
  // 			first = false;
  // 			return addition ? term : `- ${term}`;
  // 		}
  // 		return prev + (addition ? ` + ${term}` : ` - ${term}`);
  // 	}, '');
  // }
}
