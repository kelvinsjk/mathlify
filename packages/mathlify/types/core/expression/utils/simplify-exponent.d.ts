/** @typedef {import('../index.js').SimplifyOptions} SimplifyOptions */
/** @typedef {import('../index.js').ExpressionType} ExpressionType */
/** @typedef {import('../index.js').Expression} Expression */
/**
 * simplifies exponents:
 * numeral^integer -> numeral
 * base^0 -> 1
 * base^1 -> base
 * @param {Expression} expression
 * @param {SimplifyOptions} [options] - options for which types to simplify. if not provided, all will be true. if object provided, all will be false unless indicated.
 * @returns {ExpressionType|undefined}
 * WARNING: mutates current instance
 */
export function simplify_exponent(expression: Expression, options?: import("../index.js").SimplifyOptions | undefined): ExpressionType | undefined;
export type SimplifyOptions = import('../index.js').SimplifyOptions;
export type ExpressionType = import('../index.js').ExpressionType;
export type Expression = import('../index.js').Expression;
//# sourceMappingURL=simplify-exponent.d.ts.map