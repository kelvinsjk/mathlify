/** @typedef {import('../numeral/fraction/index.js').Fraction} Fraction */
/** @typedef {import('../variable/index.js').Variable} Variable */
/** @typedef {import('../quotient/index.js').Quotient} Quotient*/
/** @typedef {import('../exponent/index.js').Exponent} Exponent*/
/** @typedef {import('../index.js').ExpressionType} ExpressionType */
/**
 * Sum Class
 * @property {Expression[]} _termsExp - the terms in the sum
 * */
export class Sum {
    /**
     * Creates a Sum
     * @param {...(Expression|ExpressionType|string|Fraction|number)} terms
     */
    constructor(...terms: (Expression | ExpressionType | string | Fraction | number)[]);
    /**@type {Expression[]} */
    _termsExp: Expression[];
    /**
     * @param {{multiplicationSign?: string, mixedFractions?: boolean}} [options]
     * @returns {string}
     */
    toString(options?: {
        multiplicationSign?: string | undefined;
        mixedFractions?: boolean | undefined;
    } | undefined): string;
    /**
     * @returns {string}
     */
    toLexicalString(): string;
    /**
     * @returns {Sum}
     */
    clone(): Sum;
    /**
     * @param {import('../index.js').SimplifyOptions} [options]
     * @returns {this}
     * WARNING: mutates current instance
     */
    simplify(options?: import("../index.js").SimplifyOptions | undefined): this;
    /**
     * removes zeroes from the sum
     * @returns {this}
     * WARNING: mutates current instance
     */
    _remove_zeroes(): this;
    /**
     * flattens sum
     * @returns {this}
     * WARNING: mutates current instance
     */
    _flatten(): this;
    /**
     * combine like terms
     * @returns {this}
     * WARNING: mutates current instance
     */
    _combine_like_terms(): this;
    /**
     * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
     * @param {{verbatim: boolean}} options
     * @returns {Sum}
     */
    subIn(scope: {
        [x: string]: Expression;
    }, options: {
        verbatim: boolean;
    }): Sum;
    /**
     * rearranges the terms in place
     * @param {number[]} order - index of term to be placed in order. eg [1, 0, 2] means the we new terms be the original 2nd, 1st, 3rd terms
     * @returns {this}
     */
    rearrange(order: number[]): this;
    /**
     * exposes the factors underneath the expression wrapper
     * @returns {ExpressionType[]}
     */
    get terms(): import("../index.js").ExpressionType[];
}
export type Fraction = import('../numeral/fraction/index.js').Fraction;
export type Variable = import('../variable/index.js').Variable;
export type Quotient = import('../quotient/index.js').Quotient;
export type Exponent = import('../exponent/index.js').Exponent;
export type ExpressionType = import('../index.js').ExpressionType;
import { Expression } from '../index.js';
//# sourceMappingURL=index.d.ts.map