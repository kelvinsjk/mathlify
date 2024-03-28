/** @typedef {import('../../../core').Expression} Expression */
/**
 *
 * @param {Expression} exp
 * @param {{variable?: string, ascending?: boolean}} [options]
 * @returns {Polynomial}
 */
export function expressionToPolynomial(exp: Expression, options?: {
    variable?: string | undefined;
    ascending?: boolean | undefined;
} | undefined): Polynomial;
export type Expression = import('../../../core').Expression;
import { Polynomial } from '../../../core/index.js';
//# sourceMappingURL=index.d.ts.map