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
export function solveLinear(poly: Polynomial | number | Fraction | Expression, rhs?: number | import("../../core/fraction.js").Fraction | Expression | Polynomial | undefined, options?: {
    variable?: string | undefined;
} | undefined): Fraction;
export type Fraction = import('../../core/fraction.js').Fraction;
import { Polynomial } from '../../core/index.js';
import { Expression } from '../../core/index.js';
//# sourceMappingURL=linear.d.ts.map