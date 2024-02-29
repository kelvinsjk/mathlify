/** @typedef {import('../../numeral/index.js').Numeral} Numeral */
/** @typedef {import('../../numeral/fraction/index.js').Fraction} Fraction */
/** @typedef {import('../../variable/index.js').Variable} Variable */
/** @typedef {import('../../sum/index.js').Sum} Sum */
/** @typedef {import('../../product/index.js').Product} Product */
/** @typedef {import('../../quotient/index.js').Quotient} Quotient*/
/** @typedef {import('../../exponent/index.js').Exponent} Exponent*/
/** @typedef {import('../../index.js').ExpressionType} ExpressionType */
/**
 * Brackets Class
 * @property {Expression} expression - the expression within the parenthesis
 * */
export class Brackets {
    /**
     * Creates a Bracketed term
     * @param {Expression|ExpressionType|string|Fraction|number} expression
     */
    constructor(expression: Expression | ExpressionType | string | Fraction | number);
    /**@type {Expression} */
    expression: Expression;
    /**
     * @returns {string}
     */
    toString(): string;
    /**
     * @returns {string}
     */
    toLexicalString(): string;
    /**
     * @returns {Brackets}
     */
    clone(): Brackets;
    /**
     * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
     * @param {{verbatim: boolean}} options - default to automatic simplification
     * @returns {Brackets}
     */
    subIn(scope: {
        [x: string]: Expression;
    }, options: {
        verbatim: boolean;
    }): Brackets;
}
export type Numeral = import('../../numeral/index.js').Numeral;
export type Fraction = import('../../numeral/fraction/index.js').Fraction;
export type Variable = import('../../variable/index.js').Variable;
export type Sum = import('../../sum/index.js').Sum;
export type Product = import('../../product/index.js').Product;
export type Quotient = import('../../quotient/index.js').Quotient;
export type Exponent = import('../../exponent/index.js').Exponent;
export type ExpressionType = import('../../index.js').ExpressionType;
import { Expression } from '../../index.js';
//# sourceMappingURL=index.d.ts.map