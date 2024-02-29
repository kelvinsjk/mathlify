/** @typedef {import('../index.js').ExpressionType} ExpressionType */
/**
 * get denominator lcm of expressions
 * @param {...Expression} expressions
 * @returns {Expression}
 */
export function denominator_lcm(...expressions: Expression[]): Expression;
/**
 * get lcm of two expressions
 * @param {Expression} exp1
 * @param {Expression} exp2
 * @returns {Expression}
 */
export function expression_lcm_two(exp1: Expression, exp2: Expression): Expression;
/**
 *
 * @param {Expression[]} exps
 * @returns {Expression}
 */
export function expression_gcd(...exps: Expression[]): Expression;
export type ExpressionType = import('../index.js').ExpressionType;
import { Expression } from '../index.js';
//# sourceMappingURL=gcd-lcm.d.ts.map