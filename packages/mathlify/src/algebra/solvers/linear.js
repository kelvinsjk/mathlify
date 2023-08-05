import { Polynomial } from "../../core/algebra/polynomial/polynomial.js";
/**
 * @typedef {import('../../core/fraction.js').Fraction} Fraction
 */

/**
 * solve linear polynomial/equations
 * @param {Polynomial|number|Fraction} poly - the polynomial to be solved/left hand side of the equation
 * @param {Polynomial|number|Fraction} [rhs] - the right hand side of the equation (defaults to 0)
 * @returns {Fraction} - the solution
 */
export function solveLinear(poly, rhs = 0) {
  if (!(poly instanceof Polynomial)) {
    poly = new Polynomial([poly]);
  }
  if (!(rhs instanceof Polynomial)) {
    rhs = new Polynomial([rhs]);
  }
  const newPoly = poly.minus(rhs);
  if (newPoly.degree !== 1) {
    throw new Error(
      `${poly} = ${rhs} does not simplify to a linear polynomial`
    );
  }
  const [a, b] = newPoly.coeffs;
  return a.negative().divide(b);
}
