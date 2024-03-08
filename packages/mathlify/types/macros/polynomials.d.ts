/**
 * creates a polynomial
 * by default, the polynomial is of descending order with variable 'x'
 * fraction shorthand: [a, '/', b] represents the fraction a/b
 * @param {(number|FractionShorthand|Expression)[]} coeffs
 * @param {{ascending?: boolean, variable?: string}} [options] - defaults to ascending polynomial with variable 'x'
 * @returns {Polynomial}
 */
export function polynomial(coeffs: (number | FractionShorthand | Expression)[], options?: {
    ascending?: boolean | undefined;
    variable?: string | undefined;
} | undefined): Polynomial;
export type FractionShorthand = [number, '/', number];
export type Expression = import('../core/index.js').Expression;
import { Polynomial } from '../core/index.js';
//# sourceMappingURL=polynomials.d.ts.map