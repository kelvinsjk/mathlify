/** @typedef {import('../index.js').ExpressionType} ExpressionType*/
/** @typedef {import('../index.js').Expression} Expression*/
/**
 * @param {Expression} exp
 * @param {{product?: boolean, sum?: boolean, quotient?: boolean}} [options] - options for which types to simplify. all true by default
 * @returns {ExpressionType|undefined}
 */
export function remove_singletons(exp: Expression, options?: {
    product?: boolean | undefined;
    sum?: boolean | undefined;
    quotient?: boolean | undefined;
} | undefined): ExpressionType | undefined;
export type ExpressionType = import('../index.js').ExpressionType;
export type Expression = import('../index.js').Expression;
//# sourceMappingURL=remove-singletons.d.ts.map