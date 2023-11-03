import { Polynomial, Expression } from "../../core/index.js";
import { castToPoly } from "../utils/castToPoly.js";
/**
 * @typedef {import('../../core/fraction.js').Fraction} Fraction
 */
/**
 * solve linear polynomial/equations
 * @param {Polynomial|number|Fraction|Expression} poly - the polynomial to be solved/left hand side of the equation
 * @param {Polynomial|number|Fraction|Expression} [rhs] - the right hand side of the equation (defaults to 0)
 * @param {{variable?: string}} [options] - options to specify the variable
 * @returns {Fraction} - the solution
 */
export function solveLinear(poly, rhs = 0, options) {
  let variable = options?.variable ?? "x";
  if (poly instanceof Polynomial) {
    variable = poly.variable;
  } else if (rhs instanceof Polynomial) {
    variable = rhs.variable;
  } else if (poly instanceof Expression && poly.variables[0]) {
    variable = poly.variables[0];
  } else if (rhs instanceof Expression && rhs.variables[0]) {
    variable = rhs.variables[0];
  }
  const lhsPoly = castToPoly(poly, { variable });
  const rhsPoly = castToPoly(rhs, { variable });
  const newPoly = lhsPoly.minus(rhsPoly);
  if (newPoly.degree !== 1) {
    throw new Error(
      `${poly} = ${rhs} does not simplify to a linear polynomial`
    );
  }
  const [a, b] = newPoly.coeffs;
  return a.negative().divide(b);
}
