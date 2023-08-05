/**
 * @typedef {import('../../core/fraction.js').Fraction} Fraction
 */
/**
 * solve linear polynomial/equations
 * @param {Polynomial|number|Fraction} poly - the polynomial to be solved/left hand side of the equation
 * @param {Polynomial|number|Fraction} [rhs] - the right hand side of the equation (defaults to 0)
 * @returns {Fraction} - the solution
 */
export function solveLinear(poly: Polynomial | number | Fraction, rhs?: number | import("../../core/fraction.js").Fraction | Polynomial | undefined): Fraction;
export type Fraction = import('../../core/fraction.js').Fraction;
import { Polynomial } from "../../core/algebra/polynomial/polynomial.js";
//# sourceMappingURL=linear.d.ts.map