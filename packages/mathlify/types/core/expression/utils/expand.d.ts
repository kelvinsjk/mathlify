/** @typedef {import('../index.js').Expression} Expression */
/** @typedef {import('../index.js').ExpressionType} ExpressionType */
/**
 * expands either products, products within a sum/quotient, or exponents with positive integral powers
 * @param {Expression} expression
 * @param {{verbatim?: boolean, numeratorOnly?: boolean}} [options] - default to automatic simplification after expansion, and expands both numerator and denominator
 */
export function expand_expression_(expression: Expression, options?: {
    verbatim?: boolean | undefined;
    numeratorOnly?: boolean | undefined;
} | undefined): void;
/**
 *
 * @param {Expression} expression
 * @returns {Sum|undefined}
 */
export function expand_product(expression: Expression): Sum | undefined;
export type Expression = import('../index.js').Expression;
export type ExpressionType = import('../index.js').ExpressionType;
import { Sum } from '../sum/index.js';
//# sourceMappingURL=expand.d.ts.map