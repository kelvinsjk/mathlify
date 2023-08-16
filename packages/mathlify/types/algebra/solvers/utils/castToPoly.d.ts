/**
 * @typedef {import('../../../core/fraction.js').Fraction} Fraction
 */
/**
 * @param {Polynomial|number|Fraction|Expression} poly - the polynomial
 * @returns {Polynomial} - the polynomial
 */
export function castToPoly(poly: Polynomial | number | Fraction | Expression): Polynomial;
export type Fraction = import('../../../core/fraction.js').Fraction;
import { Polynomial } from "../../../core/algebra/polynomial/polynomial.js";
import { Expression } from "../../../core/algebra/expression/expression.js";
//# sourceMappingURL=castToPoly.d.ts.map