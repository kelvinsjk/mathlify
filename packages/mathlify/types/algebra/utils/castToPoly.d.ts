/**
 * @typedef {import('../../core/fraction.js').Fraction} Fraction
 */
/**
 * @param {Polynomial|number|Fraction|Expression} poly - the polynomial
 * @param {{variable?: string}} [options] - options for the polynomial (default: {variable: 'x'}), ignored if poly is a Polynomial
 * @returns {Polynomial} - the polynomial
 */
export function castToPoly(poly: Polynomial | number | Fraction | Expression, options?: {
    variable?: string | undefined;
} | undefined): Polynomial;
export type Fraction = import('../../core/fraction.js').Fraction;
import { Polynomial } from "../../core/algebra/polynomial/polynomial.js";
import { Expression } from "../../core/algebra/expression/expression.js";
//# sourceMappingURL=castToPoly.d.ts.map