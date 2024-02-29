/** @typedef {import('../index.js').Expression} Expression */
/** @typedef {import('../numeral/fraction/index.js').Fraction} Fraction */
/** @typedef {import('../variable/index.js').Variable} Variable */
/** @typedef {import('../quotient/index.js').Quotient} Quotient*/
/** @typedef {import('../index.js').ExpressionType} ExpressionType */
/**
 * Exponent Class
 * @property {Expression} base
 * @property {Expression} power
 * */
export class Exponent {
    /**
     * Creates a Quotient
     * @param {Expression} base
     * @param {Expression} power
     */
    constructor(base: Expression, power: Expression);
    /**@type {Expression} */
    baseExp: Expression;
    /**@type {Expression} */
    powerExp: Expression;
    /** @returns {ExpressionType} */
    get base(): import("../index.js").ExpressionType;
    /** @returns {ExpressionType} */
    get power(): import("../index.js").ExpressionType;
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
     * @returns {Exponent}
     */
    clone(): Exponent;
    /**
     * @param {import('../index.js').SimplifyOptions} [options]
     * @returns {this}
     */
    simplify(options?: import("../index.js").SimplifyOptions | undefined): this;
    /**
     * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
     * @param {{verbatim: boolean}} options
     * @returns {Exponent}
     */
    subIn(scope: {
        [x: string]: Expression;
    }, options: {
        verbatim: boolean;
    }): Exponent;
}
export type Expression = import('../index.js').Expression;
export type Fraction = import('../numeral/fraction/index.js').Fraction;
export type Variable = import('../variable/index.js').Variable;
export type Quotient = import('../quotient/index.js').Quotient;
export type ExpressionType = import('../index.js').ExpressionType;
//# sourceMappingURL=index.d.ts.map