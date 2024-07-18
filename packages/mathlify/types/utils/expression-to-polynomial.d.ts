/** @typedef {import('../core/expression/expression.js').Variable} Variable*/
/**
 *
 * @param {Expression} exp
 * @param {string|Variable} [variable='x']
 * @param {{ascending?: boolean}} [options]
 * @returns {Polynomial}
 */
export function expressionToPolynomial(exp: Expression, variable?: string | import("../index.js").Variable | undefined, options?: {
    ascending?: boolean;
} | undefined): Polynomial;
export type Variable = import("../core/expression/expression.js").Variable;
import { Expression } from '../index.js';
import { Polynomial } from '../index.js';
//# sourceMappingURL=expression-to-polynomial.d.ts.map