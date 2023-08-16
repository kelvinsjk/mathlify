import { Polynomial } from "../../core/algebra/polynomial/polynomial.js";
import { Expression } from "../../core/algebra/expression/expression.js";
import { castToPoly } from "./utils/castToPoly.js";
/**
 * @typedef {import('../../core/fraction.js').Fraction} Fraction
 */
/**
 * solve linear polynomial/equations
 * @param {Polynomial|number|Fraction|Expression} poly - the polynomial to be solved/left hand side of the equation
 * @param {Polynomial|number|Fraction|Expression} [rhs] - the right hand side of the equation (defaults to 0)
 * @returns {Fraction} - the solution
 */
export function solveLinear(poly, rhs = 0) {
  const lhsPoly = castToPoly(poly);
  const rhsPoly = castToPoly(rhs);
  const newPoly = lhsPoly.minus(rhsPoly);
  if (newPoly.degree !== 1) {
    throw new Error(
      `${poly} = ${rhs} does not simplify to a linear polynomial`
    );
  }
  const [a, b] = newPoly.coeffs;
  return a.negative().divide(b);
}
