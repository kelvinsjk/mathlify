import {
  RationalTerm,
  castExpression,
  solveLinear,
  solveQuadratic,
  discriminant,
} from "../../algebra/index.js";
import {
  oppositeSign,
  twoRoots,
  threeRoots,
  fourRoots,
} from "./utils/index.js";
import { solveLinearInequality } from "./solveInequality.js";

/** @typedef {import("../../core/index.js").Fraction} Fraction */

/**
 * solve rational inequality of which num/den is of degree at most 2, and either has distinct rational roots or no real roots
 * @param {RationalTerm} lhs - the left hand side of the inequality
 * @param {RationalTerm|number|Fraction} [rhs=0] - the right hand side of the inequality
 * @param {'<'|'>'} [sign='<'] - the sign of the inequality
 * @returns {string[]} - a collection of intervals representing the solution set
 */
export function solveRationalInequality(lhs, rhs = 0, sign = "<") {
  const rational = lhs.minus(rhs);
  const num = castExpression.toPolynomial(rational.num);
  const den = castExpression.toPolynomial(rational.den.expand());
  const numDegree = num.degree;
  const denDegree = den.degree;
  if (numDegree + denDegree === 1) {
    if (numDegree === 1) {
      if (den.leadingCoeff.is.negative()) {
        sign = oppositeSign(sign);
      }
      return [solveLinearInequality(num, sign)];
    }
  } else if (numDegree === 1 && denDegree === 1) {
    let x1 = solveLinear(num);
    let x2 = solveLinear(den);
    if (num.leadingCoeff.is.negative()) {
      sign = oppositeSign(sign);
    }
    if (den.leadingCoeff.is.negative()) {
      sign = oppositeSign(sign);
    }
    return twoRoots(x1, x2, sign);
  } else if (
    numDegree + denDegree === 2 &&
    (numDegree === 2 || denDegree === 2)
  ) {
    const quadratic = numDegree === 2 ? num : den;
    const constant = numDegree === 2 ? den : num;
    const [x1, x2] = solveQuadratic(quadratic);
    if (constant.leadingCoeff.is.negative()) {
      sign = oppositeSign(sign);
    }
    return twoRoots(x1, x2, sign);
  } else if (
    numDegree + denDegree === 3 &&
    (numDegree === 2 || denDegree === 2)
  ) {
    const quadratic = numDegree === 2 ? num : den;
    const linear = numDegree === 2 ? den : num;
    const disc = discriminant(quadratic);
    if (linear.leadingCoeff.is.negative()) {
      sign = oppositeSign(sign);
    }
    if (disc.is.negative()) {
      return [solveLinearInequality(linear, sign)];
    }
    const [x1, x2] = solveQuadratic(quadratic);
    const x3 = solveLinear(linear);
    if (quadratic.leadingCoeff.is.negative()) {
      sign = oppositeSign(sign);
    }
    return threeRoots(x1, x2, x3, sign);
  } else if (
    numDegree + denDegree === 4 &&
    (numDegree === 2 || denDegree === 2)
  ) {
    const disc1 = discriminant(num);
    const disc2 = discriminant(den);
    if (disc1.is.negative() && disc2.is.negative()) {
      throw new Error("no supported solution: no real roots found");
    } else if (disc1.is.negative() || disc2.is.negative()) {
      const quadratic = disc1.is.negative() ? den : num;
      const q2 = disc1.is.negative() ? num : den;
      const [x1, x2] = solveQuadratic(quadratic);
      if (q2.leadingCoeff.is.negative()) {
        sign = oppositeSign(sign);
      }
      return twoRoots(x1, x2, sign);
    } else {
      const [x1, x2] = solveQuadratic(num);
      const [x3, x4] = solveQuadratic(den);
      if (num.leadingCoeff.is.negative()) {
        sign = oppositeSign(sign);
      }
      if (den.leadingCoeff.is.negative()) {
        sign = oppositeSign(sign);
      }
      return fourRoots(x1, x2, x3, x4, sign);
    }
  }
  throw new Error("no supported solution");
}
