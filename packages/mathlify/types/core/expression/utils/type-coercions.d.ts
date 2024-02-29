/** @typedef {import('../index.js').ExpressionType} ExpressionType */
/**
 * to ExpressionType
 * @param {ExpressionType|string|number|Fraction|Expression} exp
 * @return {ExpressionType}
 */
export function to_ExpressionType(exp: ExpressionType | string | number | Fraction | Expression): ExpressionType;
/**
 * to Expression
 * @param {ExpressionType|string|number|Fraction|Expression} exp
 * @return {Expression}
 */
export function to_Expression(exp: ExpressionType | string | number | Fraction | Expression): Expression;
export type ExpressionType = import('../index.js').ExpressionType;
import { Fraction } from '../index.js';
import { Expression } from '../index.js';
//# sourceMappingURL=type-coercions.d.ts.map