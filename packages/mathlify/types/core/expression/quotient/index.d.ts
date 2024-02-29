/** @typedef {import('../numeral/index.js').Numeral} Numeral */
/** @typedef {import('../numeral/fraction/index.js').Fraction} Fraction */
/** @typedef {import('../variable/index.js').Variable} Variable */
/** @typedef {import('../sum/index.js').Sum} Sum */
/** @typedef {import('../product/index.js').Product} Product */
/** @typedef {import('../exponent/index.js').Exponent} Exponent*/
/** @typedef {import('../index.js').ExpressionType} ExpressionType */
/**
 * Quotient Class
 * @property {Expression} num - the numerator
 * @property {Expression} den - the denominator
 * */
export class Quotient {
    /**
     * Creates a Quotient
     * @param {Expression|ExpressionType|string|Fraction|number} num
     * @param {Expression|ExpressionType|string|Fraction|number} den
     */
    constructor(num: Expression | ExpressionType | string | Fraction | number, den: Expression | ExpressionType | string | Fraction | number);
    /**@type {Expression} */
    num: Expression;
    /**@type {Expression} */
    den: Expression;
    /**
     * @param {{multiplicationSign?: string, mixedFractions?: boolean}} [options] - default to ''
     * @returns {string}
     */
    toString(options?: {
        multiplicationSign?: string | undefined;
        mixedFractions?: boolean | undefined;
    } | undefined): string;
    /** @returns {string} */
    toLexicalString(): string;
    /**
     * @returns {Quotient}
     */
    clone(): Quotient;
    /**
     * @param {{product?: boolean, numeral?: boolean, sum?: boolean, quotient?: boolean, brackets?: boolean, exponent?: boolean}} [options]
     * @returns {this}
     * WARNING: mutates current instance
     */
    simplify(options?: {
        product?: boolean | undefined;
        numeral?: boolean | undefined;
        sum?: boolean | undefined;
        quotient?: boolean | undefined;
        brackets?: boolean | undefined;
        exponent?: boolean | undefined;
    } | undefined): this;
    /**
     * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
     * @param {{verbatim: boolean}} options
     * @returns {Quotient}
     */
    subIn(scope: {
        [x: string]: Expression;
    }, options: {
        verbatim: boolean;
    }): Quotient;
}
export type Numeral = import('../numeral/index.js').Numeral;
export type Fraction = import('../numeral/fraction/index.js').Fraction;
export type Variable = import('../variable/index.js').Variable;
export type Sum = import('../sum/index.js').Sum;
export type Product = import('../product/index.js').Product;
export type Exponent = import('../exponent/index.js').Exponent;
export type ExpressionType = import('../index.js').ExpressionType;
import { Expression } from '../index.js';
//# sourceMappingURL=index.d.ts.map