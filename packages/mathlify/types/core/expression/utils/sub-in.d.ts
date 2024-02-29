/**
 * @param {Expression} expression
 * @param {Object.<string, Expression|string|number|FractionShorthand>} scope - variables to be replaced in the expression
 * @param {{verbatim?: boolean}} [options] - default to automatic simplification
 * @returns {Expression}
 */
export function sub_in(expression: Expression, scope: {
    [x: string]: Expression | string | number | import("../../../macros/index.js").QuotientShorthand;
}, options?: {
    verbatim?: boolean | undefined;
} | undefined): Expression;
export type FractionShorthand = import('../../../macros/index.js').QuotientShorthand;
import { Expression } from '../index.js';
//# sourceMappingURL=sub-in.d.ts.map