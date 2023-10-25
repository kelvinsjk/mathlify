/**
 * @typedef {import('../../core/index.js').Fraction} Fraction
 */
/**
 * @param {Polynomial|number|Fraction|Expression} poly the polynomial in Expression/number/Fraction form
 * @param {{variable?: string, ascending?: boolean}} [options] options for the polynomial
 * @returns {Polynomial} the polynomial
 */
export function castToPoly(poly: Polynomial | number | Fraction | Expression, options?: {
    variable?: string | undefined;
    ascending?: boolean | undefined;
} | undefined): Polynomial;
export type Fraction = import('../../core/index.js').Fraction;
import { Polynomial } from "../../core/index.js";
import { Expression } from "../../core/index.js";
//# sourceMappingURL=castToPoly.d.ts.map