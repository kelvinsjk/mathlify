import {
  solveLinear,
  solveQuadratic,
  castToPoly,
} from "../../algebra/index.js";
import { Polynomial } from "../../core/index.js";
import { oppositeSign, twoRoots } from "./utils/index.js";

/** @typedef {import("../../core/index.js").Fraction} Fraction */
/** @typedef {import("../../core/index.js").Expression} Expression */

/**
 * solve rational inequality of which num/den is of degree at most 2, and either has distinct rational roots or no real roots
 * @param {Polynomial|Expression} lhs - the left hand side of the inequality
 * @param {Polynomial|Expression|number|Fraction} [rhs=0] - the right hand side of the inequality
 * @param {'<'|'>'|'geq'|'leq'|'\\geq'|'\\leq'} [sign='<'] - the sign of the inequality
 * @returns {string} - the solution as a string
 */
export function solveLinearInequality(lhs, sign = "<", rhs = 0) {
  const { x, poly, finalSign } = preprocess(lhs, rhs, sign);
  const root = solveLinear(poly);
  return `${x} ${finalSign} ${root}`;
}

/**
 * solve rational inequality of which num/den is of degree at most 2, and either has distinct rational roots or no real roots
 * @param {Polynomial|Expression} lhs - the left hand side of the inequality
 * @param {Polynomial|Expression|number|Fraction} [rhs=0] - the right hand side of the inequality
 * @param {{variable?: string}} [options] - options to specify the variable
 * @param {'<'|'>'|'geq'|'leq'|'\\geq'|'\\leq'} [sign='<'] - the sign of the inequality
 * @returns {string[]} - the solution as a string
 */
export function solveQuadraticInequality(lhs, sign = "<", rhs = 0, options) {
  const { x, poly, finalSign } = preprocess(lhs, rhs, sign, options);
  const [x1, x2] = solveQuadratic(poly, 0, { variable: x });
  return twoRoots(x1, x2, finalSign, x);
}

/**
 * @param {Polynomial|Expression} lhs - the left hand side of the inequality
 * @param {Polynomial|Expression|number|Fraction} [rhs=0] - the right hand side of the inequality
 * @param {'<'|'>'|'geq'|'leq'|'\\geq'|'\\leq'} [sign='<'] - the sign of the inequality
 * @param {{variable?: string}} [options] - options to specify the variable
 * @return {{poly: Polynomial, x: string, finalSign: '<'|'>'|'\\leq'|'\\geq' }}
 */
function preprocess(lhs, rhs = 0, sign = "<", options) {
  /** @type {'>'|'<'|'\\geq'|'\\leq'} */
  let finalSign = sign === "leq" || sign == "geq" ? `\\${sign}` : sign;
  const x =
    options?.variable ??
    (lhs instanceof Polynomial
      ? lhs.variable
      : rhs instanceof Polynomial
      ? rhs.variable
      : "x");
  const lhsPoly = castToPoly(lhs, { variable: x });
  const rhsPoly = castToPoly(rhs, { variable: x });
  const poly = lhsPoly.minus(rhsPoly);
  const leadingCoeff = poly.leadingCoeff;
  if (leadingCoeff.is.negative()) {
    finalSign = oppositeSign(finalSign);
  }
  return { poly, x, finalSign };
}
