/**
 * to Expression
 * @param {string|number|Fraction|Expression} exp
 * @return {Expression}
 */
export function to_Expression(exp: string | number | Fraction | Expression): Expression;
/**
 * unpacks the fraction shorthand
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
     * get gcd of expressions, returning a negative gcd if all terms are negative
     * @param {Expression[]} exps
     * @returns {Expression}
     */
    static gcd(...exps: Expression[]): Expression;
    /**
     * Creates an Expression.
     * We recommend using the provided macros (eg sum, product, etc)
     * to create expressions rather than using the constructor directly
     * @param {ExpressionType|number|string} expression
     */
    constructor(expression: ExpressionType | number | string);
    /** @type {ExpressionType} */
    node: ExpressionType;
    /**
     * Experimental: may be changed in the future
     * @type {string}
     * */
    _multiplicationSign: string;
    /**
     * Experimental: may be changed in the future
     * @type {boolean}
     * */
    _mixedFractions: boolean;
    /**
     * @param {{multiplicationSign?: string, mixedFractions?: boolean}} [options] - to change the multiplication sign and whether to return mixed fractions
     * @returns {string} the LaTeX string representation of the expression
     */
    toString(options?: {
        multiplicationSign?: string | undefined;
        mixedFractions?: boolean | undefined;
    } | undefined): string;
    /**
     * @returns {Expression} a clone of the current instance
     */
    clone(): Expression;
    /**
     * simplifies the expression
     * @param {SimplifyOptions} [options] - options for which types to simplify
     * @returns {this} the current instance after simplification. Note that this method mutates the current instance
     */
    simplify(options?: SimplifyOptions | undefined): this;
    /**
     * expands either products, products within a sum/quotient, or exponents with positive integral powers
     * @param {{verbatim?: boolean, numeratorOnly?: boolean}} [options] - default to automatic simplification after expansion, and expands both numerator and denominator
     * @returns {Expression}
     */
    expand(options?: {
        verbatim?: boolean | undefined;
        numeratorOnly?: boolean | undefined;
    } | undefined): Expression;
    /**
     * combines fractions within a Sum, with full simplification
     * @returns {Expression}
     */
    combineFraction(): Expression;
    /**
     * rearranges the terms of a sum in place
     * TODO: add support for rearranging products
     * WARNING: experimental API to be finalized in the future
     * @param {number[]} order
     * @returns {this}
     */
    _rearrange_(order: number[]): this;
    /** factorization methods */
    factorize: {
        /**
         * factorizes a sum by extracting common factors
         * @param {{verbatim?: boolean}} [options] - by default, will expand any inner products and combine like terms. use verbatim to prevent this
         * @returns {Expression}
         */
        commonFactor: (options?: {
            verbatim?: boolean | undefined;
        } | undefined) => Expression;
    };
    /**
     * negative of expression
     * @returns {Expression}
     */
    negative(): Expression;
    /**
     * subs in variables for other expressions
     * @param {Record<string, Expression|string|number|FractionShorthand>} scope - variables to be replaced in the expression
     * @param {{verbatim?: boolean}} [options] - default to automatic simplification
     * @returns {Expression}
     */
    subIn(scope: Record<string, Expression | string | number | import("../../macros/index.js").QuotientShorthand>, options?: {
        verbatim?: boolean | undefined;
    } | undefined): Expression;
    /** @returns {[Expression, Expression]} */
    _getQuotientTerms(): [Expression, Expression];
    /** @returns {Numeral} */
    _getNumeral(): Numeral;
    /** @return {[Numeral, Expression[]]} */
    _getProductTerms(): [Numeral, Expression[]];
    /** @return {Expression[]} */
    _getSumTerms(): Expression[];
    /**
     * @param {{coeff?: boolean}} [options] - whether to include coefficient for a product. default: true
     * @returns {string}
     * */
    _to_lexical_string(options?: {
        coeff?: boolean | undefined;
    } | undefined): string;
    /**
     * expand the expression, mutating the current instance
     * @param {{verbatim?: boolean, numeratorOnly?: boolean}} [options] - default to automatic simplification after expansion, and expands both numerator and denominator
     * @returns {this}
     */
    _expand_(options?: {
        verbatim?: boolean | undefined;
        numeratorOnly?: boolean | undefined;
    } | undefined): this;
    /**
     * expands products
     * @param {{verbatim?: boolean}} [options] - default to automatic simplification
     * @returns {this}
     */
    _expand_product_(options?: {
        verbatim?: boolean | undefined;
    } | undefined): this;
    /**
     * removes singleton
     * @param {{product?: boolean, sum?: boolean, quotient?: boolean}} [options] - options for which types to simplify. all true by default
     * @returns {this}
     * WARNING: mutates current instance
     */
    _remove_singletons_(options?: {
        product?: boolean | undefined;
        sum?: boolean | undefined;
        quotient?: boolean | undefined;
    } | undefined): this;
    /**
     * removes brackets
     * @returns {this}
     * WARNING: mutates current instance
     */
    _remove_brackets_(): this;
    /**
     * simplifies exponents:
     * numeral^integer -> numeral
     * base^0 -> 1
     * base^1 -> base
     * @param {SimplifyOptions} [options] - options for which types to simplify. if not provided, all will be true. if object provided, all will be false unless indicated.
     * @returns {this}
     * WARNING: mutates current instance
     */
    _simplify_exponent_(options?: SimplifyOptions | undefined): this;
    /**
     * common denominator:
     * for a sum, convert all terms to quotients with the same denominator
     * @returns {this} - a sum with quotients with same denominator as its terms
     * Warning: mutates current instance
     */
    _common_denominator_(): this;
    /**
     * combines into one fraction
     * (to be used strictly after 'this._common_denominator()` is called. will not work otherwise
     * @param {{verbatim?: boolean}} [options] - simplifies result by default
     * @returns {this}
     * Warning: mutate current instance
     */
    _combine_fraction_(options?: {
        verbatim?: boolean | undefined;
    } | undefined): this;
    /**
     * removes common factors
     * @returns {this}
     * Warning: mutates current instance
     */
    _remove_common_factors_(): this;
    /**
     * workaround for `new Expression(...)` to avoid circular dependency
     * @param {ExpressionType} exp
     * @returns {Expression}
     */
    _new_exp(exp: ExpressionType): Expression;
    /**
     * workaround for `Expression.gcd(...)` to avoid circular dependency
     * @param {Expression} exp2
     * @returns {Expression}
     */
    _gcd(exp2: Expression): Expression;
    /**
     * workaround for `Expression.divide_by_factor(...)` to avoid circular dependency
     * @param {Expression} factor
     * @returns {Expression}
     */
    _divide_by_factor(factor: Expression): Expression;
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