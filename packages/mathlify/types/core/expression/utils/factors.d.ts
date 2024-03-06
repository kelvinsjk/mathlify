/** @typedef {import('../index.js').Expression} Expression */
/** @typedef {import('../index.js').ExpressionType} ExpressionType */
/**
 *
 * @param {Expression} expression
 * @param {ExpressionType} divisor
 * @returns {Product} - quotient as simplified product
 */
export function divide_by_factor(expression: Expression, divisor: ExpressionType): Product;
export type Expression = import('../index.js').Expression;
export type ExpressionType = import('../index.js').ExpressionType;
import { Product } from '../product/index.js';
//# sourceMappingURL=factors.d.ts.map