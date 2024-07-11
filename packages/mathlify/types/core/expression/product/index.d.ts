/** @typedef {import('../index.js').Expression} Expression */
/** @typedef {import('../variable/index.js').Variable} Variable */
/** @typedef {import('../quotient/index.js').Quotient} Quotient*/
/** @typedef {import('../index.js').ExpressionType} ExpressionType */
/** @typedef {import('../index.js').SimplifyOptions} SimplifyOptions */
/**
 * Product Class
 * @property {Numeral} coeff - the coefficient of the product
 * @property {Expression[]} factors - the factors in the product
 * */
export class Product {
    /**
     * Creates a Product
     * @param {Expression[]|[number|Numeral|Expression, ...Expression[]]} factors
     */
    constructor(...factors: Expression[] | [number | Numeral | Expression, ...Expression[]]);
    /** @type {'product'} */
    type: 'product';
    /** @type {Numeral} */
    coeff: Numeral;
    /**@type {Expression[]} */
    _factorsExp: Expression[];
    /**
     * @param {{multiplicationSign?: string, mixedFractions?: boolean}} [options] - default to ''
     * @returns {string}
     */
    toString(options?: {
        multiplicationSign?: string | undefined;
        mixedFractions?: boolean | undefined;
    } | undefined): string;
    /**
     * @param {{coeff?: boolean}} [options] - whether to include coefficient. default: true
     * @returns {string}
     */
    toLexicalString(options?: {
        coeff?: boolean | undefined;
    } | undefined): string;
    /**
     * @returns {Expression} new expression with coefficient set to 1. Simplified by default
     */
    toUnit(): Expression;
    /**
     * @returns {Product}
     */
    clone(): Product;
    /**
     * @param {SimplifyOptions} [options]
     * @returns {this}
     * WARNING: mutates current instance
     */
    simplify(options?: import("../index.js").SimplifyOptions | undefined): this;
    /**
     * extracts numeric factors into coefficient
     * combines singletons and exponents with numeric powers into an exponent
     * eg. combines $4 \cdot x \cdot x^2 \cdot 3$ into $12x^3$
     * @returns {this}
     */
    _combine_factors(): this;
    /**
     * flattens product
     * @returns {this}
     * WARNING: mutates current instance
     */
    _flatten(): this;
    is: {
        /**
         * checks if coefficient is negative
         * @return {boolean}
         * */
        negative: () => boolean;
    };
    /** @returns {Product} */
    negative(): Product;
    /**
     * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
     * @param {{verbatim: boolean}} options
     * @returns {Product}
     */
    subIn(scope: {
        [x: string]: Expression;
    }, options: {
        verbatim: boolean;
    }): Product;
    /**
     * @param {string} variable
     * @returns {boolean}
     */
    contains(variable: string): boolean;
    /**
     * exposes the factors underneath the expression wrapper
     * @returns {ExpressionType[]}
     */
    get factors(): import("../index.js").ExpressionType[];
}
export type Expression = import('../index.js').Expression;
export type Variable = import('../variable/index.js').Variable;
export type Quotient = import('../quotient/index.js').Quotient;
export type ExpressionType = import('../index.js').ExpressionType;
export type SimplifyOptions = import('../index.js').SimplifyOptions;
import { Numeral } from '../numeral/index.js';
//# sourceMappingURL=index.d.ts.map