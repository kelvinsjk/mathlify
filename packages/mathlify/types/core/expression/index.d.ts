/**
 * to Expression
 * @param {ExpressionType|string|number|Fraction|Expression} exp
 * @return {Expression}
 */
export function to_Expression(exp: ExpressionType | string | number | Fraction | Expression): Expression;
/**
 *
 * @param {Expression|number|string|FractionShorthand} exp
 * @returns {Expression|number|string}
 */
export function unpack_shorthand_single(exp: Expression | number | string | import("../../macros/index.js").QuotientShorthand): Expression | number | string;
/** @typedef {import('../../macros/index.js').BracketShorthand} BracketShorthand */
/** @typedef {import('../../macros/index.js').QuotientShorthand} FractionShorthand */
/** @typedef {Sum|Product|Quotient|Exponent|Variable|Numeral|Fn} ExpressionType */
/** @typedef {{brackets?: boolean, product?: boolean, sum?: boolean, quotient?: boolean, numeral?: boolean, exponent?: boolean}} SimplifyOptions */
/** Expression Class
 * @property {ExpressionType} expression the tree representation of the expression
 *
 */
export class Expression {
    /**
     * get gcd of expressions
     * @param {Expression[]} exps
     * @returns {Expression}
     * WARNING: returns negative gcd if all terms are negative
     */
    static gcd(...exps: Expression[]): Expression;
    /**
     * get lcm of two expressions
     * @param {Expression} exp1
     * @param {Expression} exp2
     * @returns {Expression}
     */
    static lcm(exp1: Expression, exp2: Expression): Expression;
    /**
     * Creates an Expression.
     * We recommend using the provided macros (eg sum, product, etc)
     * to create expressions rather than using the constructor directly
     * @param {ExpressionType|number|string} expression
     */
    constructor(expression: ExpressionType | number | string);
    /** @type {ExpressionType} */
    expression: ExpressionType;
    /** @type {string} */
    multiplicationSign: string;
    /** @type {boolean} */
    mixedFractions: boolean;
    /**
     * @param {{multiplicationSign?: string, mixedFractions?: boolean}} [options] - default to ''
     * @returns {string}
     */
    toString(options?: {
        multiplicationSign?: string | undefined;
        mixedFractions?: boolean | undefined;
    } | undefined): string;
    /**
     * @returns {Expression}
     */
    clone(): Expression;
    /**
     * simplifies the expression
     * @param {SimplifyOptions} [options] - options for which types to simplify. if not provided, all will be true. if object provided, all will be false unless indicated.
     * @returns {this}
     * WARNING: mutates current instance
     */
    simplify(options?: SimplifyOptions | undefined): this;
    /**
     * expands either products, or products within a sum
     * @param {{verbatim?: boolean, numeratorOnly?: boolean}} [options] - default to automatic simplification
     * numeratorOnly: only expands numerator and leaves denominator as is
     * @returns {this}
     */
    expand(options?: {
        verbatim?: boolean | undefined;
        numeratorOnly?: boolean | undefined;
    } | undefined): this;
    /**
     * combines fraction, with full simplification
     * @returns {this}
     * Warning: mutates current instance
     */
    combine_fraction(): this;
    /**
     * rearranges the terms of a sum in place
     * @param {number[]} order
     * @returns {this}
     */
    rearrange(order: number[]): this;
    /**
     * factorizes a sum into a product by extracting common factors
     * @param {{verbatim?: boolean}} [options] - by default, will expand any inner products and combine like terms. use verbatim to prevent this
     * @returns {Expression}
     */
    toFactorized(options?: {
        verbatim?: boolean | undefined;
    } | undefined): Expression;
    /**
     * negative of expression
     * @returns {Expression}
     */
    negative(): Expression;
    /**
     * @param {Object.<string, Expression|string|number|FractionShorthand>} scope - variables to be replaced in the expression
     * @param {{verbatim?: boolean}} [options] - default to automatic simplification
     * @returns {Expression}
     */
    subIn(scope: {
        [x: string]: Expression | string | number | import("../../macros/index.js").QuotientShorthand;
    }, options?: {
        verbatim?: boolean | undefined;
    } | undefined): Expression;
    /** @returns {[Expression, Expression]} */
    getQuotientTerms(): [Expression, Expression];
    /** @returns {Numeral} */
    getNumeral(): Numeral;
    /** @return {[Numeral, Expression[]]} */
    getProductTerms(): [Numeral, Expression[]];
    /** @return {Expression[]} */
    getSumTerms(): Expression[];
    /**
     * @param {{coeff?: boolean}} [options] - whether to include coefficient for a product. default: true
     * @returns {string}
     * */
    _to_lexical_string(options?: {
        coeff?: boolean | undefined;
    } | undefined): string;
    /**
     * expands products
     * @param {{verbatim?: boolean}} [options] - default to automatic simplification
     * @returns {this}
     */
    _expand_product(options?: {
        verbatim?: boolean | undefined;
    } | undefined): this;
    /**
     * removes singleton
     * @param {{product?: boolean, sum?: boolean, quotient?: boolean}} [options] - options for which types to simplify. all true by default
     * @returns {this}
     * WARNING: mutates current instance
     */
    _remove_singletons(options?: {
        product?: boolean | undefined;
        sum?: boolean | undefined;
        quotient?: boolean | undefined;
    } | undefined): this;
    /**
     * removes brackets
     * @returns {this}
     * WARNING: mutates current instance
     */
    _remove_brackets(): this;
    /**
     * simplifies exponents:
     * numeral^integer -> numeral
     * base^0 -> 1
     * base^1 -> base
     * @param {SimplifyOptions} [options] - options for which types to simplify. if not provided, all will be true. if object provided, all will be false unless indicated.
     * @returns {this}
     * WARNING: mutates current instance
     */
    _simplify_exponent(options?: SimplifyOptions | undefined): this;
    /**
     * common denominator:
     * for a sum, convert all terms to quotients with the same denominator
     * @returns {this} - a sum with quotients with same denominator as its terms
     * Warning: mutates current instance
     */
    _common_denominator(): this;
    /**
     * combines into one fraction
     * (to be used strictly after 'this._common_denominator()` is called. will not work otherwise
     * @param {{verbatim?: boolean}} [options] - simplifies result by default
     * @returns {this}
     * Warning: mutate current instance
     */
    _combine_fraction(options?: {
        verbatim?: boolean | undefined;
    } | undefined): this;
    /**
     * removes common factors
     * @returns {this}
     * Warning: mutates current instance
     */
    _remove_common_factors(): this;
    /**
     * @param {ExpressionType} exp
     * @returns {Expression}
     */
    _new_exp(exp: ExpressionType): Expression;
}
export type BracketShorthand = import('../../macros/index.js').BracketShorthand;
export type FractionShorthand = import('../../macros/index.js').QuotientShorthand;
export type ExpressionType = Sum | Product | Quotient | Exponent | Variable | Numeral | Fn;
export type SimplifyOptions = {
    brackets?: boolean;
    product?: boolean;
    sum?: boolean;
    quotient?: boolean;
    numeral?: boolean;
    exponent?: boolean;
};
import { Fraction } from './numeral/index.js';
import { Variable } from './variable/index.js';
import { Numeral } from './numeral/index.js';
import { Sum } from './sum/index.js';
import { Product } from './product/index.js';
import { Quotient } from './quotient/index.js';
import { Exponent } from './exponent/index.js';
import { Fn } from './fn/index.js';
import { Brackets } from './fn/index.js';
export { Variable, Numeral, Fraction, Sum, Product, Quotient, Exponent, Fn, Brackets };
//# sourceMappingURL=index.d.ts.map